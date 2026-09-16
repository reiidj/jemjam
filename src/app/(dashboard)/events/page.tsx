import { createClient } from "@/utils/supabase/server";
import { Calendar, Clock } from "lucide-react";
import EventComposer from "@/components/features/EventComposer";
import EventCard from "@/components/features/EventCard";

export default async function EventsPage() {
  const supabase = await createClient();

  const { data: allEvents, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
  }

  const today = new Date().toISOString().split("T")[0];

  const upcomingEvents = allEvents?.filter((e) => e.event_date >= today) || [];
  const pastEvents =
    allEvents?.filter((e) => e.event_date < today).reverse() || [];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 lg:px-8 py-12 lg:py-20 relative min-h-screen">
      <div className="mb-16 border-b border-border pb-8">
        <span className="text-primary font-serif text-sm tracking-[0.2em] uppercase">
          Itinerary
        </span>
        <h1 className="font-serif text-5xl md:text-6xl text-foreground mt-2">
          Plans & Archives
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pb-24">
        {/* Upcoming Column */}
        <div>
          <h2 className="font-serif text-3xl text-foreground mb-8 flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary" /> On The Horizon
          </h2>
          <div className="space-y-6">
            {upcomingEvents.length === 0 ? (
              <p className="font-serif text-foreground/50 italic">
                No upcoming plans yet.
              </p>
            ) : (
              upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </div>
        </div>

        {/* Past Archive Column */}
        <div>
          <h2 className="font-serif text-3xl text-foreground/50 mb-8 flex items-center gap-3">
            <Calendar className="w-6 h-6" /> Past Archive
          </h2>
          <div className="space-y-6 opacity-70">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} isPast={true} />
            ))}
          </div>
        </div>
      </div>

      <EventComposer />
    </div>
  );
}
