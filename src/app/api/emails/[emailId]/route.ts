import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const emailUpdateSchema = z.object({
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters.")
    .max(60, "Subject must be 60 characters or less."),
  preview_text: z
    .string()
    .max(90, "Preview text must be 90 characters or less.")
    .optional()
    .or(z.literal("")),
  body_html: z
    .string()
    .min(10, "Email body must be at least 10 characters."),
});

async function handleUpdate(
  request: Request,
  { params }: { params: { emailId: string } }
) {
  try {
    const supabase = createClient();

    // Verify session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const emailId = params.emailId;
    if (!emailId) {
      return NextResponse.json({ error: "Email ID is required" }, { status: 400 });
    }

    // Verify email ownership: check if the email exists and belongs to the user
    const { data: email, error: fetchError } = await supabase
      .from("emails")
      .select("user_id")
      .eq("id", emailId)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    if (email.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate body
    const body = await request.json();
    const validation = emailUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { subject, preview_text, body_html } = validation.data;

    // Update table
    const { data: updated, error: updateError } = await supabase
      .from("emails")
      .update({
        subject,
        preview_text: preview_text || null,
        body_html,
      })
      .eq("id", emailId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, email: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: { emailId: string } }
) {
  return handleUpdate(request, context);
}

// Fallback to POST as requested in step 3
export async function POST(
  request: Request,
  context: { params: { emailId: string } }
) {
  return handleUpdate(request, context);
}
