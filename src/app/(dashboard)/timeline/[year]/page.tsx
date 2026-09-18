import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getAllGoogleEvents } from "@/lib/calendar";
import MemoryComposer from "@/components/features/MemoryComposer";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default async function TimelineYearView({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const supabase = await createClient();

  // Fetch Supabase memories AND Google Calendar events concurrently
  const [{ data: memories, error }, allGoogleEvents] = await Promise.all([
    supabase
      .from("memories")
      .select("memory_date")
      .gte("memory_date", `${year}-01-01`)
      .lte("memory_date", `${year}-12-31`),
    getAllGoogleEvents(),
  ]);

  if (error) {
    console.error("Error fetching year memories:", error);
  }

  // Use a Set to store active month indexes (0-11) to prevent duplicates
  const activeMonthIndexes = new Set<number>();

  // 1. Add Supabase Memories
  memories?.forEach((memory) => {
    // memory_date is 'YYYY-MM-DD'. Split it and parse the month (index 1)
    const monthIndex = parseInt(memory.memory_date.split("-")[1], 10) - 1;
    activeMonthIndexes.add(monthIndex);
  });

  // 2. Add Google Calendar Events
  allGoogleEvents?.forEach((event) => {
    // Only count events that match the current year being viewed
    if (event.date.getFullYear().toString() === year) {
      activeMonthIndexes.add(event.date.getMonth());
    }
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-20 relative">
      <Link
        href="/timeline"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 hover:text-primary transition-colors mb-12"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Archive
      </Link>

      <div className="mb-12 border-b border-border pb-6 text-center md:text-left">
        <span className="text-primary font-serif text-sm tracking-[0.2em] uppercase">
          Chapter
        </span>
        <h1 className="font-serif text-6xl text-foreground mt-2">{year}</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {MONTHS.map((month, index) => {
          // Check if this month's index exists in our merged Set
          const isActive = activeMonthIndexes.has(index);

          return isActive ? (
            <Link
              key={month}
              href={`/timeline/${year}/${month.toLowerCase()}`}
              className="flex flex-col items-center justify-center p-8 bg-background border border-border shadow-sm hover:border-primary/50 hover:-translate-y-1 transition-all group"
            >
              <h2 className="font-serif text-2xl text-foreground group-hover:text-primary transition-colors">
                {month}
              </h2>
              <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 mt-2 font-serif">
                View Memories
              </span>
            </Link>
          ) : (
            <div
              key={month}
              className="flex flex-col items-center justify-center p-8 bg-secondary/5 border border-border/50 text-foreground/20 cursor-not-allowed"
            >
              <h2 className="font-serif text-2xl">{month}</h2>
            </div>
          );
        })}
      </div>

      <MemoryComposer defaultDate={`${year}-01-01`} />
    </div>
  );
}
