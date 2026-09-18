"use client";

import { useState } from "react";
import Link from "next/link";
import { MailOpen, PenLine } from "lucide-react";
import LetterCardActions from "./LetterCardActions";

const VISIBLE_COUNT = 3;

export default function UnlockedLettersList({ letters }: { letters: any[] }) {
  const [showAll, setShowAll] = useState(false);

  const visibleLetters = showAll ? letters : letters.slice(0, VISIBLE_COUNT);
  const hiddenCount = letters.length - VISIBLE_COUNT;

  return (
    <div>
      <h2 className="font-serif text-2xl text-foreground mb-8 flex items-center gap-3">
        <MailOpen className="w-6 h-6 text-primary" /> Available to Read
      </h2>
      <div className="space-y-4">
        {letters.length === 0 ? (
          <p className="font-serif text-foreground/50 italic">
            Hey, the mailbox is empty! Write a letter.
          </p>
        ) : (
          <>
            {visibleLetters.map((letter) => (
              <div
                key={letter.id}
                className={`relative group block p-6 bg-background border transition-colors ${
                  !letter.is_read
                    ? "border-primary shadow-sm"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="relative z-10">
                  <LetterCardActions letter={letter} />
                </div>

                <Link
                  href={`/mailbox/${letter.id}`}
                  className="absolute inset-0 z-0"
                />

                <div className="relative z-0 pointer-events-none pr-10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-serif block">
                      Delivered:{" "}
                      {new Date(letter.deliver_at).toLocaleDateString("en-US", {
                        timeZone: "Asia/Manila",
                      })}
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

            {!showAll && hiddenCount > 0 && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full text-center py-3 font-serif italic text-sm text-foreground/50 hover:text-primary transition-colors border border-dashed border-border hover:border-primary/50"
              >
                Check the other {hiddenCount} read{" "}
                {hiddenCount === 1 ? "letter" : "letters"}
              </button>
            )}

            {showAll && letters.length > VISIBLE_COUNT && (
              <button
                onClick={() => setShowAll(false)}
                className="w-full text-center py-3 font-serif italic text-sm text-foreground/50 hover:text-primary transition-colors"
              >
                Show less
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
