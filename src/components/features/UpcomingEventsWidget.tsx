import { MapPin } from "lucide-react";
import Link from "next/link";
// 1. Swap to your secure server utility
import { createClient } from "@/utils/supabase/server";
import EventSoonBell from "./EventSoonBell";

export default async function UpcomingEventsWidget() {
  // 2. Initialize it using await
  const supabase = await createClient();

  // Fetch only future events, limited to the top 3 closest dates
  const today = new Date().toISOString().split("T")[0];
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .limit(3);

  if (error) {
    console.error("Error fetching upcoming events:", error);
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h2 className="font-serif text-xl text-foreground">Upcoming Events</h2>
        <Link
          href="/events"
          className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 hover:text-primary transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {!events || events.length === 0 ? (
          <p className="font-serif text-sm italic text-foreground/50">
            No upcoming plans on the horizon.
          </p>
        ) : (
          events.map((event) => {
            // Format the date to match your "Sep 14" mock style
            const dateObj = new Date(event.event_date);
            const formattedDate = dateObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            return (
              <Link
                href="/events"
                key={event.id}
                className="group flex gap-4 p-4 border border-border bg-secondary/10 hover:border-primary/40 transition-colors cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center px-4 border-r border-border">
                  <span className="font-serif text-primary text-sm whitespace-nowrap">
                    {formattedDate}
                  </span>
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  {event.location && (
                    <div className="flex items-center gap-1.5 mt-1 text-foreground/60">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs uppercase tracking-widest">
                        {event.location}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bell only renders if the event is less than 1 day away */}
                <EventSoonBell
                  eventDate={event.event_date}
                  className="ml-auto self-center"
                />
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
