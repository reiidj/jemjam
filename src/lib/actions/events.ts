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

export async function updateEvent(formData: FormData) {
  const supabase = await createClient();

  // Extract all the fields directly from the FormData
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const event_date = formData.get("event_date") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;

  const { error } = await supabase
    .from("events")
    .update({
      title,
      event_date,
      location,
      description,
    })
    .eq("id", id);

  if (error) {
    console.error("Supabase Update Error:", error);
    throw new Error(error.message);
  }

  // Force Next.js to immediately show the updated data
  revalidatePath("/events");
  revalidatePath("/", "layout");
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    console.error("Error deleting event:", error);
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
}
