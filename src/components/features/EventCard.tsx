"use client";

import { useState } from "react";
import { X, MapPin, AlignLeft } from "lucide-react";
import EventCardActions from "./EventCardActions";

interface Event {
  id: string;
  title: string;
  event_date: string;
  location?: string;
  description?: string;
}

interface EventCardProps {
  event: Event;
  isPast?: boolean; // We will use this to style the past events slightly faded!
}

export default function EventCard({ event, isPast }: EventCardProps) {
  const [showViewModal, setShowViewModal] = useState(false);

  const formattedDate = new Date(event.event_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      {/* The Clickable Card */}
      <div
        onClick={() => setShowViewModal(true)}
        className={`relative group p-6 border transition-colors cursor-pointer ${
          isPast
            ? "bg-secondary/5 border-border/50 hover:border-primary/30"
            : "bg-background border-border hover:border-primary/50"
        }`}
      >
        {/* The edit/delete icons (they already stop clicks from opening the view modal!) */}
        <EventCardActions event={event} />

        <span
          className={`text-[10px] uppercase tracking-[0.2em] font-serif block mb-2 ${isPast ? "text-foreground/50" : "text-primary"}`}
        >
          {formattedDate}
        </span>
        <h3 className="font-serif text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        {/* Optional preview of the location on the card */}
        {event.location && (
          <div className="flex items-center gap-1.5 text-foreground/60 mt-3">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs uppercase tracking-widest truncate">
              {event.location}
            </span>
          </div>
        )}
      </div>

      {/* The View Details Modal */}
      {showViewModal && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6 cursor-default"
          onClick={() => setShowViewModal(false)} // Clicking outside closes it
        >
          <div
            className="bg-[#FFFDF9] border border-border p-8 md:p-12 shadow-2xl max-w-lg w-full relative text-left max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Clicking inside prevents closing
          >
            <button
              type="button"
              onClick={() => setShowViewModal(false)}
              className="absolute top-6 right-6 text-foreground/50 hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-primary font-serif text-sm tracking-[0.2em] uppercase border-b border-primary pb-1 block w-max mb-6">
              {formattedDate}
            </span>

            <h2 className="font-serif text-4xl text-foreground mb-8 leading-tight">
              {event.title}
            </h2>

            <div className="space-y-6">
              {/* Location Block */}
              {event.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-1">
                      Location
                    </span>
                    <p className="font-serif text-lg text-foreground">
                      {event.location}
                    </p>
                  </div>
                </div>
              )}

              {/* Description Block */}
              {event.description ? (
                <div className="flex items-start gap-3">
                  <AlignLeft className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-1">
                      Details & Notes
                    </span>
                    <div
                      className="prose prose-sm prose-stone font-serif text-foreground/80 leading-relaxed max-w-none"
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <AlignLeft className="w-5 h-5 text-foreground/30 mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-1">
                      Details & Notes
                    </span>
                    <p className="font-serif text-sm text-foreground/40 italic">
                      No additional details provided.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
