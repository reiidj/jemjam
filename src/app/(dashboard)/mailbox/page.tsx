import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Mail, Lock, MailOpen, PenLine } from "lucide-react";
import MailboxComposer from "@/components/features/MailboxComposer";
import LetterCardActions from "@/components/features/LetterCardActions";

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
        {/* Unlocked Letters */}
        <div>
          <h2 className="font-serif text-2xl text-foreground mb-8 flex items-center gap-3">
            <MailOpen className="w-6 h-6 text-primary" /> Available to Read
          </h2>
          <div className="space-y-4">
            {unlockedLetters.map((letter) => (
              <div
                key={letter.id}
                className={`relative group block p-6 bg-background border transition-colors ${
                  !letter.is_read
                    ? "border-primary shadow-sm"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {/* 1. Actions sit here on top (z-10) so they are completely separated from the link! */}
                <div className="relative z-10">
                  <LetterCardActions letter={letter} />
                </div>

                {/* 2. An invisible link that stretches over the whole card underneath the buttons */}
                <Link
                  href={`/mailbox/${letter.id}`}
                  className="absolute inset-0 z-0"
                />

                {/* 3. The card content (pointer-events-none ensures clicks pass cleanly through to the link) */}
                <div className="relative z-0 pointer-events-none pr-10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-serif block">
                      Delivered:{" "}
                      {new Date(letter.deliver_at).toLocaleDateString()}
                    </span>
                    {!letter.is_read && (
                      <span className="text-[9px] uppercase tracking-widest bg-primary text-background px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <h3
                    className={`font-serif text-xl transition-colors ${
                      !letter.is_read
                        ? "text-foreground font-bold group-hover:text-primary"
                        : "text-foreground group-hover:text-primary"
                    }`}
                  >
                    {letter.title}
                  </h3>
                  {letter.sender_name && (
                    <div className="flex items-center gap-1.5 mt-3 text-foreground/50">
                      <PenLine className="w-3 h-3" />
                      <span className="text-xs font-serif italic">
                        From {letter.sender_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time-Locked Letters */}
        <div>
          <h2 className="font-serif text-2xl text-foreground/50 mb-8 flex items-center gap-3">
            <Lock className="w-6 h-6" /> Sealed Envelopes
          </h2>
          <div className="space-y-4 opacity-70">
            {lockedLetters.length === 0 ? (
              <p className="font-serif text-foreground/50 italic">
                No sealed letters waiting.
              </p>
            ) : (
              lockedLetters.map((letter) => (
                <div
                  key={letter.id}
                  className="relative group p-6 bg-secondary/5 border border-border/50 cursor-not-allowed flex items-center justify-between"
                >
                  <LetterCardActions letter={letter} />

                  <div className="pr-10">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif block mb-1">
                      Unlocks:{" "}
                      {new Date(letter.deliver_at).toLocaleDateString()}
                    </span>
                    <h3 className="font-serif text-xl text-foreground">
                      {letter.title}
                    </h3>
                    {letter.sender_name && (
                      <div className="flex items-center gap-1.5 mt-2 text-foreground/40">
                        <PenLine className="w-3 h-3" />
                        <span className="text-xs font-serif italic">
                          From {letter.sender_name}
                        </span>
                      </div>
                    )}
                  </div>
                  <Lock className="w-5 h-5 text-foreground/30" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <MailboxComposer />
    </div>
  );
}
