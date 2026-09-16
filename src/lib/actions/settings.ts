"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateCountdownSettings(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const date = formData.get("date") as string;

  const { error } = await supabase
    .from("site_settings")
    .update({
      countdown_title: title,
      countdown_date: date,
    })
    .eq("id", 1); // We always update the first row

  if (error) {
    console.error("Error updating settings:", error);
    throw new Error("Failed to update settings");
  }

  // Instantly refresh the dashboard so the new clock starts ticking!
  revalidatePath("/", "layout");
}
