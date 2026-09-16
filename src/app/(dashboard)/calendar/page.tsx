import { createClient } from "@supabase/supabase-js";
import { getUpcomingGoogleEvents } from "@/lib/calendar";
import ScrapbookCalendar from "@/components/features/ScrapbookCalendar";

export default async function CalendarPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // Fetch all past memories
  const { data: memories } = await supabase.from("memories").select("*");

  // Fetch future Google Calendar events
  const googleEvents = await getUpcomingGoogleEvents();

  return (
    <ScrapbookCalendar memories={memories || []} googleEvents={googleEvents} />
  );
}
