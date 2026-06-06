import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const workspaceSchema = z.object({
  brand_name: z.string().min(2, "Brand name must be at least 2 characters").max(60, "Brand name must be at most 60 characters"),
  product_description: z.string().min(20, "Description must be at least 20 characters").max(800, "Description must be at most 800 characters"),
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Primary color must be a valid hex code (e.g., #6366f1)"),
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
    const result = workspaceSchema.safeParse(json);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }
    
    const { brand_name, product_description, primary_color } = result.data;

    // Check if workspace exists
    const { data: existingWorkspace } = await supabase
      .from("workspaces")
      .select("id")
      .eq("user_id", user.id)
      .single();

    let updatedWorkspace;

    if (existingWorkspace) {
      const { data, error: updateError } = await supabase
        .from("workspaces")
        .update({ brand_name, product_description, primary_color })
        .eq("user_id", user.id)
        .select()
        .single();
        
      if (updateError) throw updateError;
      updatedWorkspace = data;
    } else {
      const { data, error: insertError } = await supabase
        .from("workspaces")
        .insert({ user_id: user.id, brand_name, product_description, primary_color })
        .select()
        .single();
        
      if (insertError) throw insertError;
      updatedWorkspace = data;
    }

    // Log to audit_logs
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "workspace_updated",
      ip_address: ip,
    });

    return NextResponse.json({ success: true, workspace: updatedWorkspace });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
