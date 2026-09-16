import { getAllGoogleEvents } from "@/lib/calendar";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

export default async function ArchivePage() {
  const allEvents = await getAllGoogleEvents();

  // Total count for the header
  const totalCount = allEvents.length;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 lg:px-8 py-12 lg:py-20 relative min-h-screen">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-foreground/50 hover:text-primary transition-colors mb-12"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <header className="mb-16 border-b border-border pb-8 text-center md:text-left">
        <span className="text-primary font-serif text-sm tracking-[0.2em] uppercase">
          The Full Record
        </span>
        <h1 className="font-serif text-5xl md:text-6xl text-foreground mt-2">
          Date Archive
        </h1>
        <p className="text-foreground/60 font-serif mt-4">
          A complete history of all {totalCount} dates logged in the calendar.
        </p>
      </header>

      <div className="space-y-4 pb-24">
        {allEvents.length === 0 ? (
          <p className="font-serif text-foreground/50 italic">
            No dates recorded yet.
          </p>
        ) : (
          allEvents.map((event, index) => {
            // Reversing the index number so the newest event gets the highest number
            const entryNumber = totalCount - index;

            return (
              <div
                key={event.id}
                className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-6 bg-background border border-border hover:border-primary/50 transition-colors"
              >
                {/* Number Badge */}
                <div className="flex items-center justify-center w-12 h-12 bg-secondary/20 border border-border text-foreground font-serif text-xl shrink-0">
                  {entryNumber}
                </div>

                {/* Event Details */}
                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl text-foreground mb-1">
                      {event.title}
                    </h3>
                    {event.location && (
                      <div className="flex items-center gap-2 text-foreground/50">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-serif">
                          {event.location}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-serif block">
                      {event.date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
