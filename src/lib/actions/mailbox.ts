"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addLetter(formData: FormData, contentHTML: string) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const deliver_at = formData.get("deliver_at") as string;
  const sender_name = (formData.get("sender_name") as string) || "Me";
  const recipient_email = formData.get("recipient_email") as string;

  const { error } = await supabase.from("mailbox_letters").insert({
    title,
    content: contentHTML,
    deliver_at,
    sender_name,
    recipient_email,
    is_read: false,
  });

  if (error) {
    console.error("Supabase Insert Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/mailbox", "layout");
}
