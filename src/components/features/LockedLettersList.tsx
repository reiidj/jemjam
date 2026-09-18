"use client";

import { useState } from "react";
import { Lock, PenLine } from "lucide-react";
import LetterCardActions from "./LetterCardActions";

const VISIBLE_COUNT = 3;

export default function LockedLettersList({ letters }: { letters: any[] }) {
  const [showAll, setShowAll] = useState(false);

  const visibleLetters = showAll ? letters : letters.slice(0, VISIBLE_COUNT);
  const hiddenCount = letters.length - VISIBLE_COUNT;

  return (
    <div>
      <h2 className="font-serif text-2xl text-foreground/50 mb-8 flex items-center gap-3">
        <Lock className="w-6 h-6" /> Sealed Envelopes
      </h2>
      <div className="space-y-4 opacity-70">
        {letters.length === 0 ? (
          <p className="font-serif text-foreground/50 italic">
            Hey, the mailbox is empty! Write a letter for the future.
          </p>
        ) : (
          <>
            {visibleLetters.map((letter) => (
              <div
                key={letter.id}
                className="relative group p-6 bg-secondary/5 border border-border/50 cursor-not-allowed flex items-center justify-between"
              >
                <LetterCardActions letter={letter} />

                <div className="pr-10">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif block mb-1">
                    Unlocks:{" "}
                    {new Date(letter.deliver_at).toLocaleDateString("en-US", {
                      timeZone: "Asia/Manila",
                    })}
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
            ))}

            {!showAll && hiddenCount > 0 && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full text-center py-3 font-serif italic text-sm text-foreground/50 hover:text-primary transition-colors border border-dashed border-border hover:border-primary/50"
              >
                Check the other {hiddenCount} sealed{" "}
                {hiddenCount === 1 ? "envelope" : "envelopes"}
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
