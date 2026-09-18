"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { sendLetterSealedEmail } from "@/lib/email";

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

  // Notify the recipient immediately that a letter has been sealed for them.
  // Failure to send shouldn't roll back the letter, so this is fire-and-forget with logging.
  if (recipient_email) {
    try {
      await sendLetterSealedEmail({
        to: recipient_email,
        title,
        sender_name,
        deliver_at,
      });
    } catch (emailError) {
      console.error("Failed to send letter-sealed email:", emailError);
    }
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

  revalidatePath("/mailbox");
  revalidatePath("/", "layout");
}

export async function updateLetter(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
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
