"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addEvent(formData: FormData, descriptionHTML: string) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const event_date = formData.get("event_date") as string;
  const location = formData.get("location") as string;

  const { error } = await supabase.from("events").insert({
    title,
    event_date,
    location,
    description: descriptionHTML,
  });

  if (error) {
    console.error("Supabase Insert Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
}
