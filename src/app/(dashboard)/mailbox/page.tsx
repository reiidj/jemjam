import { createClient } from "@/utils/supabase/server";
import { Mail } from "lucide-react";
import MailboxComposer from "@/components/features/MailboxComposer";
import UnlockedLettersList from "@/components/features/UnlockedLettersList";
import LockedLettersList from "@/components/features/LockedLettersList";

export default async function MailboxPage() {
  const supabase = await createClient();

  const { data: allLetters, error } = await supabase
    .from("mailbox_letters")
    .select("id, title, content, sender_name, is_read, deliver_at, created_at")
    .order("deliver_at", { ascending: true });

  if (error) {
    console.error("Error fetching letters:", error);
  }

  const now = new Date();

  const unlockedLetters =
    allLetters?.filter((letter) => new Date(letter.deliver_at) <= now) || [];
  const lockedLetters =
    allLetters?.filter((letter) => new Date(letter.deliver_at) > now) || [];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 lg:px-8 py-12 lg:py-20 relative min-h-screen">
      <div className="mb-16 border-b border-border pb-8">
        <span className="text-primary font-serif text-sm tracking-[0.2em] uppercase">
          Digital Mailbox
        </span>
        <h1 className="font-serif text-5xl md:text-6xl text-foreground mt-2 flex items-center gap-4">
          <Mail className="w-10 h-10 md:w-12 md:h-12 text-primary" /> Letters
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pb-24">
        <UnlockedLettersList letters={unlockedLetters} />
        <LockedLettersList letters={lockedLetters} />
      </div>

      <MailboxComposer />
    </div>
  );
}
