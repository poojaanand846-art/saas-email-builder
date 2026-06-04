import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const onboardingSchema = z.object({
  brandName: z.string().min(2, "Product name must be at least 2 characters."),
  productDescription: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(500, "Description must be under 500 characters."),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color format."),
});

export async function POST(request: Request) {
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

    // Validate body
    const body = await request.json();
    const validation = onboardingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { brandName, productDescription, primaryColor } = validation.data;

    // Check for existing workspace for the user
    const { data: existing, error: checkError } = await supabase
      .from("workspaces")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    let workspaceId: string;

    if (existing) {
      // Update existing workspace
      const { data: updated, error: updateError } = await supabase
        .from("workspaces")
        .update({
          brand_name: brandName,
          product_description: productDescription,
          primary_color: primaryColor,
        })
        .eq("user_id", user.id)
        .select("id")
        .single();

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
      workspaceId = updated.id;
    } else {
      // Insert new workspace
      const { data: inserted, error: insertError } = await supabase
        .from("workspaces")
        .insert({
          user_id: user.id,
          brand_name: brandName,
          product_description: productDescription,
          primary_color: primaryColor,
        })
        .select("id")
        .single();

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
      workspaceId = inserted.id;
    }

    return NextResponse.json({ success: true, workspaceId });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
