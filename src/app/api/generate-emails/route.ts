import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for request body validation
const generateSchema = z.object({
  sequenceName: z
    .string()
    .min(3, "Sequence name must be at least 3 characters.")
    .max(60, "Sequence name must be under 60 characters."),
  productDescription: z
    .string()
    .min(20, "Product description must be at least 20 characters.")
    .max(800, "Product description must be under 800 characters."),
  tone: z.enum(["professional", "friendly", "casual", "persuasive", "helpful", "direct"]),
  templateId: z.string().optional(),
});

// Simple in-memory rate limiting map
// Key: user_id, Value: { count: number, hourStart: number }
const rateLimitMap = new Map<string, { count: number; hourStart: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(userId);

  if (!limit) {
    rateLimitMap.set(userId, { count: 1, hourStart: now });
    return true;
  }

  // Reset rate limit window if 1 hour has elapsed
  if (now - limit.hourStart > 60 * 60 * 1000) {
    rateLimitMap.set(userId, { count: 1, hourStart: now });
    return true;
  }

  if (limit.count >= 10) {
    return false;
  }

  limit.count += 1;
  return true;
}

// Helper to strip HTML tags
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

interface GeminiEmail {
  day_offset: number;
  subject: string;
  preview_text: string;
  body_html: string;
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // 1. Verify Session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate request body
    const body = await request.json();
    const validation = generateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { sequenceName, productDescription, tone, templateId } = validation.data;

    // 3. Enforce Rate Limit
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Max 10 email generations per hour." },
        { status: 429 }
      );
    }

    // 4. Strip HTML tags from description
    const sanitizedDescription = stripHtml(productDescription);

    // 5. Retrieve User's Workspace
    const { data: workspace, error: wsError } = await supabase
      .from("workspaces")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (wsError || !workspace) {
      return NextResponse.json(
        { error: "Workspace not found. Please complete onboarding first." },
        { status: 400 }
      );
    }

    // 6. Contact Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured on the server." },
        { status: 500 }
      );
    }

    const systemPrompt = 
      "You are an expert SaaS onboarding email copywriter. You write clear, conversion-focused emails that help users activate and get value from software products. Always respond with valid JSON only — no markdown, no explanation.";

    const userPrompt = 
      `Generate 7 onboarding emails for this SaaS product: ${sanitizedDescription}
      Tone: ${tone}
      
      Return a JSON array of 7 objects, each with:
      - day_offset: number (0, 1, 3, 5, 7, 14, 30)
      - subject: string (compelling subject line, max 50 chars)
      - preview_text: string (email preview text, max 90 chars)
      - body_html: string (full email body as clean HTML, no external CSS, inline styles only, professional design)
      
      Email sequence: welcome → key feature → social proof → check-in → upgrade nudge → win-back → final`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
          systemInstruction: {
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errorText);
      return NextResponse.json(
        { error: "AI generation failed. Please try again later." },
        { status: 502 }
      );
    }

    const geminiData = await geminiResponse.json();

    if (!geminiData.candidates || !geminiData.candidates[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json(
        { error: "Invalid response structure returned from Gemini API." },
        { status: 502 }
      );
    }

    let textOutput = geminiData.candidates[0].content.parts[0].text.trim();

    // Strip markdown code fences if Gemini wraps the JSON output
    if (textOutput.startsWith("```")) {
      textOutput = textOutput
        .replace(/^```json\s*/i, "")
        .replace(/```$/, "")
        .trim();
    }

    let parsedEmails: GeminiEmail[];
    try {
      parsedEmails = JSON.parse(textOutput);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse JSON output generated by Gemini." },
        { status: 502 }
      );
    }

    if (!Array.isArray(parsedEmails) || parsedEmails.length !== 7) {
      return NextResponse.json(
        { error: "Gemini did not return exactly 7 onboarding emails." },
        { status: 502 }
      );
    }

    // 7. Save Sequence to Database
    const { data: sequence, error: seqError } = await supabase
      .from("sequences")
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        name: sequenceName,
        tone: tone,
        status: "draft",
        template_id: templateId || null,
      })
      .select("id")
      .single();

    if (seqError || !sequence) {
      return NextResponse.json(
        { error: `Failed to create email sequence: ${seqError?.message}` },
        { status: 500 }
      );
    }

    // 8. Save Emails in Bulk
    const emailsToInsert = parsedEmails.map((email, index) => ({
      sequence_id: sequence.id,
      user_id: user.id,
      day_offset: email.day_offset,
      subject: email.subject,
      preview_text: email.preview_text || "",
      body_html: email.body_html,
      position: index,
    }));

    const { data: insertedEmails, error: emailsError } = await supabase
      .from("emails")
      .insert(emailsToInsert)
      .select();

    if (emailsError) {
      // Cleanup the sequence if email creation fails
      await supabase.from("sequences").delete().eq("id", sequence.id);
      return NextResponse.json(
        { error: `Failed to save generated emails: ${emailsError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sequenceId: sequence.id,
      emails: insertedEmails,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
