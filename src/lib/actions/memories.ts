"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addMemory(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const memory_date = formData.get("memory_date") as string;
  const description = formData.get("description") as string;

  // 1. Process and upload any newly attached image files to Supabase Storage
  const files = formData.getAll("images") as File[];
  const newImageUrls: string[] = [];

  for (const file of files) {
    if (file && file.size > 0 && file.name) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("jemjam-vault")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from("jemjam-vault")
        .getPublicUrl(fileName);

      newImageUrls.push(publicUrlData.publicUrl);
    }
  }

  // 2. Check if a memory entry already exists for this exact date
  const { data: existingMemory, error: fetchError } = await supabase
    .from("memories")
    .select("id, title, description, images")
    .eq("memory_date", memory_date)
    .maybeSingle();

  if (fetchError) {
    console.error("Error checking existing memory:", fetchError);
  }

  if (existingMemory) {
    // 3A. Update & Append: Merge existing photos with newly uploaded photos
    const mergedImages = [...(existingMemory.images || []), ...newImageUrls];

    const { error: updateError } = await supabase
      .from("memories")
      .update({
        title: title || existingMemory.title,
        description: description || existingMemory.description,
        images: mergedImages,
      })
      .eq("id", existingMemory.id);

    if (updateError) {
      console.error("Supabase Update Error:", updateError);
      throw new Error(updateError.message);
    }
  } else {
    // 3B. Insert fresh memory row
    const { error: insertError } = await supabase.from("memories").insert({
      title,
      memory_date,
      description,
      images: newImageUrls,
    });

    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      throw new Error(insertError.message);
    }
  }

  // 4. Invalidate caches across the dashboard and timeline
  revalidatePath("/timeline", "layout");
  revalidatePath("/", "layout");
}
