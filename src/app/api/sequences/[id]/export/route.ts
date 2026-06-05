import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import JSZip from "jszip";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: Request,
  { params }: RouteParams
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

    const sequenceId = params.id;
    if (!sequenceId) {
      return NextResponse.json({ error: "Sequence ID is required" }, { status: 400 });
    }

    // Retrieve sequence and verify ownership
    const { data: sequence, error: seqError } = await supabase
      .from("sequences")
      .select("id, name, user_id")
      .eq("id", sequenceId)
      .maybeSingle();

    if (seqError) {
      return NextResponse.json({ error: seqError.message }, { status: 500 });
    }

    if (!sequence) {
      return NextResponse.json({ error: "Sequence not found" }, { status: 404 });
    }

    if (sequence.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch emails in order of position
    const { data: emails, error: emailsError } = await supabase
      .from("emails")
      .select("day_offset, subject, body_html, position")
      .eq("sequence_id", sequenceId)
      .order("position", { ascending: true });

    if (emailsError) {
      return NextResponse.json({ error: emailsError.message }, { status: 500 });
    }

    if (!emails || emails.length === 0) {
      return NextResponse.json({ error: "No emails found in this sequence to export" }, { status: 400 });
    }

    // Generate ZIP
    const zip = new JSZip();

    const stages = [
      "welcome",
      "feature",
      "social-proof",
      "check-in",
      "upgrade",
      "win-back",
      "final-cta",
    ];

    emails.forEach((email, idx) => {
      const stageName = stages[idx] || `step-${idx + 1}`;
      const filename = `day-${email.day_offset}-${stageName}.html`;

      // Escape HTML special chars to prevent XSS when opening exported files
      const escapeHtml = (str: string) =>
        str
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");

      const safeSubject = escapeHtml(email.subject);

      const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${safeSubject}</title>
</head>
<body>
  ${email.body_html}
</body>
</html>`;

      zip.file(filename, fullHtml);
    });

    const zipBuffer = await zip.generateAsync({ type: "arraybuffer" });

    // Log the export event
    const { error: logError } = await supabase.from("exports").insert({
      sequence_id: sequenceId,
      user_id: user.id,
      provider: "html",
    });

    if (logError) {
      console.error("Failed to log export event in DB:", logError.message);
    }

    const safeName = sequence.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    return new Response(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${safeName}-emails.zip"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
