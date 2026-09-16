// 1. We import from YOUR new utility file instead of the base package
import { createClient } from "@/utils/supabase/server";
import { Calendar, MapPin, Clock } from "lucide-react";
import EventComposer from "@/components/features/EventComposer";

export default async function EventsPage() {
  // 2. We use 'await' because Next.js 15 handles cookies asynchronously
  // No more messy environment variables needed here!
  const supabase = await createClient();

  // 3. The data fetching remains exactly the same
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
                <div
                  key={event.id}
                  className="p-6 bg-background border border-border hover:border-primary/50 transition-colors group cursor-pointer"
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-serif block mb-2">
                    {new Date(event.event_date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <h3 className="font-serif text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  {event.location && (
                    <div className="flex items-center gap-2 text-foreground/50 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-serif">
                        {event.location}
                      </span>
                    </div>
                  )}
                  {event.description && (
                    <div
                      className="prose prose-sm prose-stone font-serif text-foreground/70 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    />
                  )}
                </div>
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
              <div
                key={event.id}
                className="p-6 bg-secondary/5 border border-border/50"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif block mb-2">
                  {new Date(event.event_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <h3 className="font-serif text-xl text-foreground mb-2">
                  {event.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EventComposer />
    </div>
  );
}
