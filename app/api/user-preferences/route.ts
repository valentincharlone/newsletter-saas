import { inngest } from "@/inngest/client";
import { createClient } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in to svae preferences," },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { categories, frequency, email } = body;

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return NextResponse.json(
      { error: "Categories array is required and must not be empty" },
      { status: 400 }
    );
  }

  if (!frequency || !["daily", "weekly", "biweekly"].includes(frequency)) {
    return NextResponse.json(
      { error: "Valid frequency is required (daily, weekly, biweekly)" },
      { status: 400 }
    );
  }

  const { error: upsertError } = await supabase.from("user_preferences").upsert(
    {
      user_id: user.id,
      categories: categories,
      frequency: frequency,
      email: email,
      is_active: true,
    },
    { onConflict: "user_id" }
  );

  if (upsertError) {
    console.error("Error saving preferences:", upsertError);
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    );
  }

  await inngest.send({
    name: "newsletter.schedule",
    data: {
      categories,
      email,
      frequency,
      userId: user.id,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Preferences saved and newsletter scheduled",
    // scheduleId: ids[0],
  });
}

export async function GET() {
  const supabase = await createClient();

  // Get the user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in to fetch preferences." },
      { status: 401 }
    );
  }

  try {
    // Get user preferences
    const { data: preferences, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("Error fetching preferences:", error);
      return NextResponse.json(
        { error: "Failed to fetch preferences" },
        { status: 500 }
      );
    }

    if (!preferences) {
      return NextResponse.json(
        { error: "No preferences found" },
        { status: 404 }
      );
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error in user-preferences GET API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  // Get the user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in to update preferences." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { is_active } = body;

    // Update user preferences
    const { error: updateError } = await supabase
      .from("user_preferences")
      .update({ is_active })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error updating preferences:", updateError);
      return NextResponse.json(
        { error: "Failed to update preferences" },
        { status: 500 }
      );
    }

    if (is_active) {
      await inngest.send({
        name: "newsletter.schedule.deleted",
        data: {
          userId: user.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
    });
  } catch (error) {
    console.error("Error in user-preferences PATCH API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
