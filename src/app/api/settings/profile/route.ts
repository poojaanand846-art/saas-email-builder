import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(60, "Name must be less than 60 characters").optional(),
  avatar_url: z.string().url().nullable().optional(),
});

export async function PATCH(request: Request) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await request.json();
    const result = profileSchema.safeParse(json);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }
    
    const { full_name, avatar_url } = result.data;
    
    const dataToUpdate: Record<string, string | null> = {};
    if (full_name !== undefined) dataToUpdate.full_name = full_name;
    if (avatar_url !== undefined) dataToUpdate.avatar_url = avatar_url;

    const { error: updateError } = await supabase.auth.updateUser({
      data: dataToUpdate,
    });

    if (updateError) {
      throw updateError;
    }

    // Log to audit_logs
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "profile_updated",
      ip_address: ip,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
