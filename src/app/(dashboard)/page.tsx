import CountdownHero from "@/components/features/CountdownHero";
import StatRibbon from "@/components/features/StatRibbon";
import ScrapbookCalendar from "@/components/features/ScrapbookCalendar";
import UpcomingEventsWidget from "@/components/features/UpcomingEventsWidget";
import EventComposer from "@/components/features/EventComposer";
import { createClient } from "@/utils/supabase/server";
import {
  getUpcomingGoogleEvents,
  getTotalGoogleEventsCount,
} from "@/lib/calendar";

export default async function DashboardHome() {
  const supabase = await createClient();

  // Get today's date in YYYY-MM-DD format to filter out past events
  const today = new Date().toISOString().split("T")[0];

  const [
    { data: memories },
    googleEvents,
    totalDatesCount,
    { count: unreadCount },
    { data: nextEvent }, // 1. Fetching the closest upcoming event!
  ] = await Promise.all([
    supabase.from("memories").select("*"),
    getUpcomingGoogleEvents(),
    getTotalGoogleEventsCount(),
    supabase
      .from("mailbox_letters")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
    // Query events: future dates only, sorted by nearest date, grab the first one
    supabase
      .from("events")
      .select("*")
      .gte("event_date", today)
      .order("event_date", { ascending: true })
      .limit(1)
      .single(),
  ]);

  return (
    <main className="w-full overflow-hidden flex flex-col pb-24 bg-background relative">
      {/* 2. Pass the automated event data down. Add fallbacks if no events exist! */}
      <CountdownHero
        targetDateString={nextEvent?.event_date || null}
        title={nextEvent?.title || "Awaiting Next Adventure"}
      />

      <StatRibbon
        totalDates={totalDatesCount}
        unreadLetters={unreadCount || 0}
      />

      <section className="w-full max-w-6xl mx-auto px-6 lg:px-8 z-20 mt-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
          <div className="w-full lg:w-7/12">
            <ScrapbookCalendar
              memories={memories || []}
              googleEvents={googleEvents}
              hideComposer={true}
            />
          </div>

          <div className="w-full lg:w-5/12 flex flex-col gap-8">
            <UpcomingEventsWidget />
            <EventComposer />
          </div>
        </div>
      </section>
    </main>
  );
}
