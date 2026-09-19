import CountdownHero from "@/components/features/CountdownHero";
import StatRibbon from "@/components/features/StatRibbon";
import ScrapbookCalendar from "@/components/features/ScrapbookCalendar";
import UpcomingEventsWidget from "@/components/features/UpcomingEventsWidget";
import EventComposer from "@/components/features/EventComposer";
import RecentMemories from "@/components/features/RecentMemories"; // Import the new widget
import { createClient } from "@/utils/supabase/server";
import {
  getUpcomingGoogleEvents,
  getTotalGoogleEventsCount,
} from "@/lib/calendar";

export default async function DashboardHome() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  // 1. Request secure 1-hour links for the hero images
  const { data: signedUrlsData } = await supabase.storage
    .from("jemjam-vault")
    .createSignedUrls(
      ["hero-photo-1.jpg", "hero-photo-2.jpg", "hero-photo-3.jpg"],
      3600,
    );

  const secureImages =
    signedUrlsData
      ?.map((file) => file.signedUrl)
      .filter((url): url is string => !!url) || [];

  const [
    { data: memories },
    googleEvents,
    totalDatesCount,
    { count: unreadCount },
    { data: nextEvent },
  ] = await Promise.all([
    supabase.from("memories").select("*"),
    getUpcomingGoogleEvents(),
    getTotalGoogleEventsCount(),
    supabase
      .from("mailbox_letters")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
    supabase
      .from("events")
      .select("*")
      .gte("event_date", today)
      .order("event_date", { ascending: true })
      .limit(1)
      .single(),
  ]);

  // 2. Process Recent Memories
  // Sort all memories by newest first and take the top 3
  const recentMemoriesRaw = [...(memories || [])]
    .sort(
      (a, b) =>
        new Date(b.memory_date).getTime() - new Date(a.memory_date).getTime(),
    )
    .slice(0, 6);

  // Extract the first image from each memory to use as a cover
  const coverImages = recentMemoriesRaw
    .map((m) => m.images?.[0])
    .filter((url): url is string => !!url);

  // Request signed URLs for those specific cover images
  const signedCoverUrls: Record<string, string> = {};
  if (coverImages.length > 0) {
    const { data: signedCoversData } = await supabase.storage
      .from("jemjam-vault")
      .createSignedUrls(coverImages, 3600);

    signedCoversData?.forEach((file) => {
      if (file.signedUrl && file.path) {
        signedCoverUrls[file.path] = file.signedUrl;
      }
    });
  }

  // Attach the signed cover URL back to the memory object
  const recentMemories = recentMemoriesRaw.map((m) => ({
    ...m,
    coverUrl: m.images?.[0] ? signedCoverUrls[m.images[0]] : null,
  }));

  return (
    <main className="w-full overflow-hidden flex flex-col pb-32 bg-background relative selection:bg-primary/20">
      <CountdownHero
        targetDateString={nextEvent?.event_date || null}
        title={nextEvent?.title || "Awaiting Next Adventure"}
        secureImages={secureImages}
      />

      <StatRibbon
        totalDates={totalDatesCount}
        unreadLetters={unreadCount || 0}
      />

      <section className="w-full max-w-6xl mx-auto px-6 lg:px-8 z-20 mt-10">
        <div className="w-full bg-primary text-background py-3 px-8 mb-16 flex justify-between items-center shadow-sm">
          <h2 className="font-serif text-sm tracking-[0.4em] uppercase">
            Together Board
          </h2>
          <span className="text-[10px] uppercase tracking-[0.2em] font-serif opacity-70">
            Volume I
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          <div className="w-full lg:w-7/12 flex flex-col relative border-t-2 border-foreground/20 pt-10">
            <div className="absolute -top-6 left-0 bg-background pr-6">
              <span className="font-serif italic text-primary text-3xl">
                Memories
              </span>
            </div>

            <ScrapbookCalendar
              memories={memories || []}
              googleEvents={googleEvents}
            />
          </div>

          <div className="w-full lg:w-5/12 relative border-t-2 border-foreground/20 pt-10">
            <div className="absolute -top-6 left-0 bg-background pr-6">
              <span className="font-serif italic text-primary text-3xl">
                Details & Plans
              </span>
            </div>

            <div className="sticky top-28 flex flex-col gap-10">
              <UpcomingEventsWidget />
              <EventComposer />
            </div>
          </div>
        </div>

        {/* 3. Drop the new Recent Memories widget at the bottom of the grid block */}
        <RecentMemories memories={recentMemories} />
      </section>
    </main>
  );
}
