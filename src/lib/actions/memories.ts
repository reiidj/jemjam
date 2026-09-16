"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addMemory(formData: FormData, contentHTML: string) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const memory_date = formData.get("memory_date") as string;

  const { error } = await supabase.from("memories").insert({
    title,
    memory_date,
    content: contentHTML,
  });

  if (error) {
    console.error("Supabase Insert Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/timeline", "layout");
  revalidatePath("/", "layout");
}
