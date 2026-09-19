"use client";

import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";

interface Memory {
  id: string;
  title: string;
  memory_date: string;
  images?: string[];
  coverUrl?: string | null;
}

// Map to convert numeric months (01-12) into routing slugs
const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

/*
 * Tuning knobs
 * - MIN_CARDS_PER_SET: each "set" of cards must be wider than the widest
 *   screen you care about, otherwise a gap appears while looping.
 * - SECONDS_PER_CARD: higher = slower. 8s per ~350px card is roughly 44px/s.
 */
const MIN_CARDS_PER_SET = 8;
const SECONDS_PER_CARD = 8;

export default function RecentMemories({ memories }: { memories: Memory[] }) {
  const hasMemories = memories && memories.length > 0;
  const shouldScroll = hasMemories && memories.length > 1;

  /*
   * Build one "set" of cards that is long enough to fill any screen.
   * If there are only a few memories, they get repeated within the set.
   */
  const set: Memory[] = shouldScroll
    ? Array.from(
        { length: Math.ceil(MIN_CARDS_PER_SET / memories.length) },
        () => memories,
      ).flat()
    : hasMemories
      ? memories
      : [];

  /*
   * Render the set twice. The track slides left by exactly 50% (one full
   * set) and then loops, so the second copy lands exactly where the first
   * started. Nothing ever visibly resets.
   */
  const copies = shouldScroll ? [0, 1] : [0];

  return (
    <section className="w-full mt-16 border-t-2 border-foreground/20 pt-12 relative">
      {/*
       * Keyframes live here so no Tailwind config changes are needed.
       * Feel free to move them into globals.css.
       */}
      <style>{`
        @keyframes memories-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .memories-marquee-track {
          display: flex;
          width: max-content;
          animation: memories-marquee linear infinite;
          will-change: transform;
        }
        .memories-marquee:hover .memories-marquee-track,
        .memories-marquee:focus-within .memories-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .memories-marquee-track { animation: none; }
        }
      `}</style>

      <div className="absolute -top-5 left-0 bg-background pr-6">
        <span className="font-serif italic text-primary text-2xl md:text-3xl">
          Recent Memories
        </span>
      </div>

      <div className="flex justify-end mb-8">
        <Link
          href="/timeline"
          className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 hover:text-primary transition-colors border-b border-foreground/10 pb-1"
        >
          View Full Archive
        </Link>
      </div>

      {!hasMemories ? (
        <div className="w-full flex flex-col items-center justify-center py-16 px-4 text-center bg-secondary/5 border border-dashed border-border/60">
          <span className="font-serif italic text-xl text-foreground/60 mb-2">
            Your scrapbook is currently empty.
          </span>

          <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-serif mb-8">
            Head over to the timeline to log your first memory.
          </p>

          <Link
            href="/timeline"
            className="px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-background transition-colors font-serif uppercase tracking-[0.2em] text-xs"
          >
            Open Timeline
          </Link>
        </div>
      ) : (
        /*
         * Outer container hides overflow. The vertical padding stops the
         * tilted cards from being clipped at the top and bottom.
         * Hovering (or focusing a card) pauses the motion.
         */
        <div className="memories-marquee overflow-hidden motion-reduce:overflow-x-auto w-full py-6">
          <div
            className="memories-marquee-track"
            style={
              shouldScroll
                ? { animationDuration: `${set.length * SECONDS_PER_CARD}s` }
                : { animation: "none" }
            }
          >
            {copies.map((copy) =>
              set.map((memory, index) => {
                const [year, monthNum, day] = memory.memory_date.split("-");
                const monthSlug = MONTH_NAMES[parseInt(monthNum, 10) - 1];
                const isClone = copy > 0;

                return (
                  /*
                   * Spacing is padding-right on a wrapper instead of flex
                   * `gap`. This keeps every card the same width so the
                   * 50% shift lines up perfectly with the second copy.
                   */
                  <div
                    key={`${copy}-${index}-${memory.id}`}
                    className="shrink-0 pr-6 md:pr-8"
                    aria-hidden={isClone || undefined}
                  >
                    <Link
                      href={`/timeline/${year}/${monthSlug}/${day}`}
                      tabIndex={isClone ? -1 : undefined}
                      className={`block w-[85vw] md:w-[320px] group bg-background border border-border p-4 pb-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/50 ${
                        index % 2 === 0
                          ? "rotate-2 hover:rotate-0"
                          : "-rotate-1 hover:rotate-0"
                      }`}
                    >
                      <div className="w-full aspect-square bg-secondary/10 border border-border mb-6 overflow-hidden relative flex items-center justify-center">
                        {memory.coverUrl ? (
                          <img
                            src={memory.coverUrl}
                            alt={isClone ? "" : memory.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-foreground/20" />
                        )}
                      </div>

                      <div className="flex flex-col items-center text-center px-2">
                        <span className="text-[10px] uppercase tracking-widest text-primary font-serif mb-2">
                          {new Date(memory.memory_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              timeZone: "UTC",
                            },
                          )}
                        </span>

                        <h3 className="font-serif text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {memory.title}
                        </h3>
                      </div>
                    </Link>
                  </div>
                );
              }),
            )}
          </div>
        </div>
      )}
    </section>
  );
}
