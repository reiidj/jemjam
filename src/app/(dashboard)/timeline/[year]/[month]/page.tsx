import Link from "next/link";
import {
  ArrowLeft,
  Image as ImageIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getAllGoogleEvents } from "@/lib/calendar";
import MemoryComposer from "@/components/features/MemoryComposer";

export default async function TimelineMonthView({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  // Initialize secure client
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

  // Dynamically calculate the last day of the month
  const lastDay = new Date(parseInt(year), parseInt(monthNumber), 0).getDate();

  // Fetch Supabase memories AND all Google Calendar events concurrently
  const [{ data: memories, error }, allGoogleEvents] = await Promise.all([
    supabase
      .from("memories")
      .select("id, title, memory_date, images")
      .gte("memory_date", `${year}-${monthNumber}-01`)
      .lte("memory_date", `${year}-${monthNumber}-${lastDay}`),
    getAllGoogleEvents(),
  ]);

  if (error) {
    console.error("Error fetching month memories:", error);
  }

  // Filter Google Events down to just this specific year and month
  const monthGoogleEvents = allGoogleEvents.filter((event) => {
    const eventYear = event.date.getFullYear().toString();
    const eventMonth = (event.date.getMonth() + 1).toString().padStart(2, "0");
    return eventYear === year && eventMonth === monthNumber;
  });

  // Merge Data: Create a unified record keyed by the day (e.g., "14")
  const unifiedEntries: Record<
    string,
    {
      id: string;
      day: string;
      title: string;
      hasImages: boolean;
      isGoogleOnly: boolean;
    }
  > = {};

  // 1. Lay down the skeleton: Google Calendar Events
  monthGoogleEvents.forEach((event) => {
    const day = event.date.getDate().toString().padStart(2, "0");
    unifiedEntries[day] = {
      id: event.id,
      day,
      title: event.title,
      hasImages: false,
      isGoogleOnly: true,
    };
  });

  // 2. Add the meat: Supabase Memories (These overwrite Google events on the same day)
  memories?.forEach((memory) => {
    const day = memory.memory_date.split("-")[2];
    unifiedEntries[day] = {
      id: memory.id,
      day,
      title: memory.title,
      hasImages: memory.images && memory.images.length > 0,
      isGoogleOnly: false,
    };
  });

  // Convert the merged record into an array sorted chronologically by day
  const sortedEntries = Object.values(unifiedEntries).sort(
    (a, b) => parseInt(a.day) - parseInt(b.day),
  );

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
        {sortedEntries.length === 0 && (
          <p className="pl-8 font-serif text-foreground/50 italic">
            No memories or scheduled events recorded for this month.
          </p>
        )}

        {sortedEntries.map((entry) => (
          <div key={entry.id} className="relative pl-8 md:pl-12 group">
            {/* Timeline Dot: Gray for Google skeleton, Crimson for Supabase memory */}
            <span
              className={`absolute -left-2 top-1.5 w-4 h-4 rounded-full bg-background border-2 transition-colors ${
                entry.isGoogleOnly
                  ? "border-foreground/30 group-hover:bg-foreground/30"
                  : "border-primary group-hover:bg-primary"
              }`}
            />

            <Link
              href={`/timeline/${year}/${month}/${entry.day}`}
              className="block"
            >
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.2em] text-foreground/50 font-serif">
                  {capitalizedMonth} {entry.day}
                </span>
                <h3
                  className={`font-serif text-3xl transition-colors ${
                    entry.isGoogleOnly
                      ? "text-foreground/70 group-hover:text-foreground"
                      : "text-foreground group-hover:text-primary"
                  }`}
                >
                  {entry.title}
                </h3>

                {/* Secondary Indicators */}
                <div className="flex items-center gap-4 mt-2">
                  {entry.hasImages && (
                    <div className="flex items-center gap-1.5 text-foreground/40">
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-[10px] uppercase tracking-widest font-serif">
                        Includes Gallery
                      </span>
                    </div>
                  )}
                  {entry.isGoogleOnly && (
                    <div className="flex items-center gap-1.5 text-foreground/40">
                      <CalendarIcon className="w-4 h-4" />
                      <span className="text-[10px] uppercase tracking-widest font-serif italic">
                        Click to add memory
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <MemoryComposer defaultDate={`${year}-${monthNumber}-01`} />
    </div>
  );
}
