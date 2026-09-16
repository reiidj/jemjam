import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, PenLine } from "lucide-react";

// 1. Update the type so Next.js knows params is a Promise
export default async function LetterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 2. Await and unwrap the params to get the ID
  const { id } = await params;

  // Initialize your secure client
  const supabase = await createClient();

  // Fetch the specific letter using the unwrapped 'id'
  const { data: letter, error } = await supabase
    .from("mailbox_letters")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !letter) {
    notFound();
  }

  const now = new Date();
  const deliveryDate = new Date(letter.deliver_at);
  const isLocked = deliveryDate > now;

  // Security Check: If they try to force-navigate to a locked letter's URL
  if (isLocked) {
    return (
      <div className="w-full max-w-3xl mx-auto px-6 py-20 min-h-screen flex flex-col items-center justify-center text-center">
        <Lock className="w-16 h-16 text-primary mb-6" />
        <h1 className="font-serif text-4xl text-foreground mb-4">
          No Peeking!
        </h1>
        <p className="font-serif text-foreground/60 mb-8 text-lg">
          This letter is time-locked and cannot be opened until{" "}
          {deliveryDate.toLocaleString()}.
        </p>
        <Link
          href="/mailbox"
          className="text-[10px] uppercase tracking-[0.2em] text-primary hover:text-foreground transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Mailbox
        </Link>
      </div>
    );
  }

  // If the letter is open but hasn't been marked as read yet, update it securely
  if (!letter.is_read) {
    await supabase
      .from("mailbox_letters")
      .update({ is_read: true })
      .eq("id", id);
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-6 lg:px-8 py-12 lg:py-20 relative min-h-[80vh]">
      <Link
        href="/mailbox"
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-foreground/50 hover:text-primary transition-colors mb-12"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Mailbox
      </Link>

      <article className="bg-[#FFFDF9] border border-border p-8 md:p-16 shadow-sm">
        <header className="mb-12 border-b border-border/50 pb-8 text-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-serif block mb-4">
            Delivered on {deliveryDate.toLocaleDateString()}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
            {letter.title}
          </h1>
          {letter.sender_name && (
            <div className="flex items-center justify-center gap-2 text-foreground/60">
              <PenLine className="w-4 h-4" />
              <span className="text-sm font-serif italic">
                Written by {letter.sender_name}
              </span>
            </div>
          )}
        </header>

        <div
          className="prose prose-stone lg:prose-lg font-serif text-foreground/80 max-w-none prose-headings:font-serif prose-headings:font-normal prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: letter.content || "" }}
        />
      </article>
    </div>
  );
}
