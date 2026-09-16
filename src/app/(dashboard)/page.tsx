import CountdownHero from "@/components/features/CountdownHero";
import StatRibbon from "@/components/features/StatRibbon";
import ScrapbookCalendar from "@/components/features/ScrapbookCalendar";
import UpcomingEventsWidget from "@/components/features/UpcomingEventsWidget";
import EventComposer from "@/components/features/EventComposer";
import { createClient } from "@/utils/supabase/server";
import { getUpcomingGoogleEvents } from "@/lib/calendar";

export default async function DashboardHome() {
  const supabase = await createClient();

  // 1. Fetch memories, google events, AND efficiently count unread letters!
  const [
    { data: memories },
    googleEvents,
    { count: unreadCount }, // Using Supabase's built-in count feature
  ] = await Promise.all([
    supabase.from("memories").select("*"),
    getUpcomingGoogleEvents(),
    supabase
      .from("mailbox_letters")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
  ]);

  return (
    <main className="w-full overflow-hidden flex flex-col pb-24 bg-background relative">
      <CountdownHero />

      {/* 2. Pass the data right into the ribbon */}
      <StatRibbon
        totalDates={googleEvents?.length || 0}
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
