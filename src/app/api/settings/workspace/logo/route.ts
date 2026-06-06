import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
    const formData = await request.formData();
    const file = formData.get("logo") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 2MB limit" }, { status: 400 });
    }

    if (!["image/jpeg", "image/png", "image/svg+xml"].includes(file.type)) {
      return NextResponse.json({ error: "Only PNG, JPG, and SVG files are allowed" }, { status: 400 });
    }

    // Convert file to array buffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const fileExt = file.name.split('.').pop() || "png";
    const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("logos")
      .getPublicUrl(fileName);

    const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;

    // Update workspace with new logo_url
    // Check if workspace exists
    const { data: existingWorkspace } = await supabase
      .from("workspaces")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existingWorkspace) {
      await supabase
        .from("workspaces")
        .update({ logo_url: cacheBustedUrl })
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("workspaces")
        .insert({ user_id: user.id, brand_name: "My Brand", logo_url: cacheBustedUrl });
    }

    // Log to audit_logs
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "workspace_logo_updated",
      ip_address: ip,
    });

    return NextResponse.json({ logo_url: cacheBustedUrl });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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
    const { data: workspace } = await supabase
      .from("workspaces")
      .select("logo_url")
      .eq("user_id", user.id)
      .single();

    if (workspace?.logo_url) {
      // Extract the filename from the public URL
      const parts = workspace.logo_url.split('/logos/');
      if (parts.length === 2) {
        const filePathWithQuery = parts[1]; // user_id/uuid.ext?t=123
        const filePath = filePathWithQuery.split('?')[0];
        await supabase.storage.from("logos").remove([filePath]);
      }
      
      await supabase
        .from("workspaces")
        .update({ logo_url: null })
        .eq("user_id", user.id);

      // Log to audit_logs
      const ip = request.headers.get("x-forwarded-for") || "unknown";
      await supabase.from("audit_logs").insert({
        user_id: user.id,
        action: "workspace_logo_deleted",
        ip_address: ip,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
