import CountdownHero from "@/components/features/CountdownHero";
import StatRibbon from "@/components/features/StatRibbon";
import ScrapbookCalendar from "@/components/features/ScrapbookCalendar";
import UpcomingEventsWidget from "@/components/features/UpcomingEventsWidget";
import EventComposer from "@/components/features/EventComposer";
import { createClient } from "@/utils/supabase/server";
// 1. Import your new counting function alongside the upcoming one
import {
  getUpcomingGoogleEvents,
  getTotalGoogleEventsCount,
} from "@/lib/calendar";

export default async function DashboardHome() {
  const supabase = await createClient();

  // 2. Add the counting function to your Promise.all so everything loads simultaneously
  const [
    { data: memories },
    googleEvents,
    totalDatesCount, // This is your new true lifetime count!
    { count: unreadCount },
    { data: settings },
  ] = await Promise.all([
    supabase.from("memories").select("*"),
    getUpcomingGoogleEvents(),
    getTotalGoogleEventsCount(), // Fetching the true count here
    supabase
      .from("mailbox_letters")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
    supabase.from("site_settings").select("*").eq("id", 1).single(),
  ]);

  return (
    <main className="w-full overflow-hidden flex flex-col pb-24 bg-background relative">
      <CountdownHero
        targetDateString={settings?.countdown_date || "2026-12-25T19:00:00Z"}
        title={settings?.countdown_title || "Our Next Adventure"}
      />

      {/* 3. Pass the true lifetime count into the ribbon */}
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
