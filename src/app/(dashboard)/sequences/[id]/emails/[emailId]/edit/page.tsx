import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EditorForm from "./EditorForm";

interface EditEmailPageProps {
  params: {
    id: string;
    emailId: string;
  };
}

export default async function EditEmailPage({ params }: EditEmailPageProps) {
  const supabase = createClient();

  // Retrieve user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // Fetch the email and confirm ownership
  const { data: email } = await supabase
    .from("emails")
    .select(`
      id,
      sequence_id,
      day_offset,
      subject,
      preview_text,
      body_html,
      position,
      user_id
    `)
    .eq("id", params.emailId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!email) {
    notFound();
  }

  // Double check the email is part of the sequence specified in the path
  if (email.sequence_id !== params.id) {
    notFound();
  }

  return <EditorForm email={email} />;
}
