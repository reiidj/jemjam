import Link from "next/link";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
// 1. Swap to your secure server utility
import { createClient } from "@/utils/supabase/server";
import MemoryComposer from "@/components/features/MemoryComposer";

export default async function TimelineMonthView({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  // 2. Initialize it using await
  const supabase = await createClient();

  // Map the month string to a numeric format (e.g., "september" -> "09")
  const monthMap: Record<string, string> = {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
  };
  const monthNumber = monthMap[month.toLowerCase()];

  // NEW: Dynamically calculate the last day of the month (28, 29, 30, or 31)
  // In JS Date, asking for day '0' of the *next* month gives you the last day of the *current* month!
  const lastDay = new Date(parseInt(year), parseInt(monthNumber), 0).getDate();

  // Query the live database for this specific year and month securely
  const { data: memories, error } = await supabase
    .from("memories")
    .select("id, title, memory_date, images")
    .gte("memory_date", `${year}-${monthNumber}-01`)
    .lte("memory_date", `${year}-${monthNumber}-${lastDay}`) // Use the dynamic lastDay here
    .order("memory_date", { ascending: true });

  if (error) {
    console.error("Error fetching month memories:", error);
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
      <Link
        href={`/timeline/${year}`}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 hover:text-primary transition-colors mb-12"
      >
        <ArrowLeft className="w-4 h-4" /> Back to {year}
      </Link>

      <div className="mb-16 border-b border-border pb-6 text-center">
        <h1 className="font-serif text-5xl text-foreground">
          {capitalizedMonth}
        </h1>
        <span className="text-primary font-serif text-sm tracking-[0.2em] uppercase mt-4 block">
          {year}
        </span>
      </div>

      <div className="relative border-l border-primary/20 ml-4 md:ml-8 space-y-12">
        {memories?.length === 0 && (
          <p className="pl-8 font-serif text-foreground/50 italic">
            No memories recorded yet for this month.
          </p>
        )}

        {memories?.map((memory) => {
          // Extract just the day number from "YYYY-MM-DD"
          const day = memory.memory_date.split("-")[2];

          return (
            <div key={memory.id} className="relative pl-8 md:pl-12 group">
              <span className="absolute -left-2 top-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary group-hover:bg-primary transition-colors" />

              <Link
                href={`/timeline/${year}/${month}/${day}`}
                className="block"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-foreground/50 font-serif">
                    {capitalizedMonth} {day}
                  </span>
                  <h3 className="font-serif text-3xl text-foreground group-hover:text-primary transition-colors">
                    {memory.title}
                  </h3>
                  {memory.images && memory.images.length > 0 && (
                    <div className="flex items-center gap-2 text-foreground/40 mt-2">
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-[10px] uppercase tracking-widest font-serif">
                        Includes Gallery
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button automatically locks to this specific month */}
      <MemoryComposer defaultDate={`${year}-${monthNumber}-01`} />
    </div>
  );
}
