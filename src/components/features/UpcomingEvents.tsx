import { getUpcomingGoogleEvents } from "@/lib/calendar";
import { Calendar as CalendarIcon, MapPin } from "lucide-react";

export default async function UpcomingEventsWidget() {
  const googleEvents = await getUpcomingGoogleEvents();

  // Filter for events occurring today or in the future, limit to 5
  const upcomingEvents = googleEvents
    .filter((event) => event.date >= new Date(new Date().setHours(0, 0, 0, 0)))
    .slice(0, 5);

  return (
    <div className="w-full bg-background border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
        <h2 className="font-serif text-2xl text-foreground">Upcoming Dates</h2>
        <CalendarIcon className="w-5 h-5 text-primary" />
      </div>

      <div className="flex flex-col gap-6">
        {upcomingEvents.length === 0 ? (
          <p className="font-serif text-foreground/50 italic text-sm">
            No upcoming dates scheduled.
          </p>
        ) : (
          upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="group relative pl-4 border-l-2 border-primary/20 hover:border-primary transition-colors"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif block mb-1">
                {event.date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">
                {event.title}
              </h3>
              {event.location && (
                <div className="flex items-center gap-1.5 mt-2 text-foreground/40">
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs font-serif">{event.location}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
