import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const saveTemplateSchema = z.object({
  name: z.string().min(2, "Template name must be at least 2 characters."),
  sequenceId: z.string().uuid("Invalid sequence ID."),
});

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // 1. Verify session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Verify Pro plan
    const { data: workspace } = await supabase
      .from("workspaces")
      .select("plan")
      .eq("user_id", user.id)
      .maybeSingle();

    if (workspace?.plan !== "pro") {
      return NextResponse.json({ error: "PRO_REQUIRED" }, { status: 403 });
    }

    // 3. Validate body
    const body = await request.json();
    const validation = saveTemplateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, sequenceId } = validation.data;

    // 4. Fetch the sequence and emails
    const { data: sequence, error: seqError } = await supabase
      .from("sequences")
      .select("tone")
      .eq("id", sequenceId)
      .eq("user_id", user.id)
      .single();

    if (seqError || !sequence) {
      return NextResponse.json({ error: "Sequence not found." }, { status: 404 });
    }

    const { data: emails, error: emailsError } = await supabase
      .from("emails")
      .select("day_offset, subject, preview_text")
      .eq("sequence_id", sequenceId)
      .order("position", { ascending: true });

    if (emailsError || !emails || emails.length === 0) {
      return NextResponse.json({ error: "No emails found in this sequence." }, { status: 400 });
    }

    // 5. Build template object matching lib/templates.ts structure
    const templateData = {
      name,
      goal: "Custom",
      emailCount: emails.length,
      layoutStyle: "Custom",
      tone: sequence.tone || "professional",
      tags: ["Custom"],
      contentTypes: ["Text"], // Simplified for now since we don't store individual email layout types on the sequence currently
      emails: emails.map(e => ({
        dayOffset: e.day_offset,
        purpose: e.subject,
        contentType: "Text"
      }))
    };

    // 6. Save to user_templates
    const { error: insertError } = await supabase
      .from("user_templates")
      .insert({
        user_id: user.id,
        name,
        template_data: templateData
      });

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
