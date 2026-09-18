import Link from "next/link";
import { BookOpen } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getAllGoogleEvents } from "@/lib/calendar";
import MemoryComposer from "@/components/features/MemoryComposer";

export default async function TimelineYearView() {
  // 1. Initialize your secure master key
  const supabase = await createClient();

  // 2. Fetch Supabase memories AND all Google Calendar events concurrently
  const [{ data: memories, error }, googleEvents] = await Promise.all([
    supabase
      .from("memories")
      .select("memory_date")
      .order("memory_date", { ascending: true }),
    getAllGoogleEvents(),
  ]);

  if (error) {
    console.error("Error fetching memories for timeline:", error);
  }

  // 3. Dynamically group unique dates by year using a Set
  const uniqueDatesByYear: Record<string, Set<string>> = {};

  // Add Supabase Memories
  memories?.forEach((memory) => {
    const year = memory.memory_date.substring(0, 4);
    if (!uniqueDatesByYear[year]) uniqueDatesByYear[year] = new Set();
    uniqueDatesByYear[year].add(memory.memory_date);
  });

  // Add Google Calendar Events
  googleEvents?.forEach((event) => {
    const dateString = event.date.toISOString().split("T")[0]; // YYYY-MM-DD
    const year = dateString.substring(0, 4);
    if (!uniqueDatesByYear[year]) uniqueDatesByYear[year] = new Set();
    uniqueDatesByYear[year].add(dateString);
  });

  const romanNumerals = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
  ];

  // 4. Transform our counts into the format your UI expects
  const activeYears = Object.keys(uniqueDatesByYear)
    .sort((a, b) => parseInt(a) - parseInt(b)) // Ensure chronological order
    .map((year, index) => ({
      year,
      memories: uniqueDatesByYear[year].size,
      cover: `Chapter ${romanNumerals[index] || index + 1}`,
    }));

  return (
    <div className="relative min-h-screen w-full">
      <div className="w-full max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <span className="text-primary font-serif text-sm tracking-[0.2em] uppercase border-b border-primary pb-1">
            The Archive
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground">
            Our Timeline
          </h1>
          <p className="text-foreground/60 font-serif max-w-md mt-4">
            Select a year to explore our memories, from the very beginning to
            our latest adventures.
          </p>
        </div>

        {activeYears.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-foreground/50 italic">
              The archive is waiting for its first memory...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {activeYears.map((item) => (
              <Link
                key={item.year}
                href={`/timeline/${item.year}`}
                className="group relative flex flex-col aspect-[3/4] bg-secondary/20 border border-border p-6 shadow-sm hover:border-primary/50 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Vintage Book Spine Effect */}
                <div className="absolute left-0 top-0 bottom-0 w-6 bg-foreground/5 border-r border-border mix-blend-multiply" />

                <div className="flex-1 flex flex-col items-center justify-center border border-foreground/10 p-4 bg-background relative z-10">
                  <BookOpen className="w-8 h-8 text-primary/40 mb-6 group-hover:text-primary transition-colors duration-500" />
                  <span className="text-xs uppercase tracking-[0.3em] text-foreground/50 mb-2">
                    {item.cover}
                  </span>
                  <h2 className="font-serif text-5xl text-foreground">
                    {item.year}
                  </h2>
                  <div className="mt-8 pt-4 border-t border-foreground/10 w-12 text-center">
                    <span className="text-[10px] uppercase tracking-widest text-primary font-serif">
                      {item.memories} Entries
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Put the Composer here so you can add memories right from the timeline hub! */}
      <MemoryComposer />
    </div>
  );
}
