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

export async function deleteLetter(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("mailbox_letters")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting letter:", error);
    throw new Error(error.message);
  }

  // Refresh both the mailbox and the dashboard (for the unread count)
  revalidatePath("/mailbox");
  revalidatePath("/", "layout");
}

export async function updateLetter(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string; // Adjust if we want rich text here
  const deliver_at = formData.get("deliver_at") as string;

  const { error } = await supabase
    .from("mailbox_letters")
    .update({
      title,
      content,
      deliver_at,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating letter:", error);
    throw new Error(error.message);
  }

  revalidatePath("/mailbox");
  revalidatePath("/", "layout");
}
