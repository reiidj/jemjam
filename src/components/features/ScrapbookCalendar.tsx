"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  Image as ImageIcon,
  Calendar as CalendarIcon,
} from "lucide-react";

export default function ScrapbookCalendar({
  memories,
  googleEvents,
}: {
  memories: any[];
  googleEvents: any[];
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  // Dynamic Grid Math
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Helper to find data for a specific day
  const getDayData = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const memory = memories.find((m) => m.memory_date === formattedDate);
    const googleEvent = googleEvents.find((e) => {
      const eDate = new Date(e.date);
      return (
        eDate.getDate() === day &&
        eDate.getMonth() === month &&
        eDate.getFullYear() === year
      );
    });
    return { memory, googleEvent, formattedDate };
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 lg:px-8 py-12 lg:py-20 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-border pb-8 mb-12 gap-6">
        <div className="flex flex-col space-y-2 text-center md:text-left">
          <span className="text-primary font-serif text-sm tracking-[0.2em] uppercase">
            The Archive
          </span>
          <h1 className="font-serif text-5xl text-foreground">
            Scrapbook Calendar
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={prevMonth}
            className="text-foreground/40 hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="font-serif text-2xl text-foreground w-48 text-center">
            {monthName} {year}
          </span>
          <button
            onClick={nextMonth}
            className="text-foreground/40 hover:text-primary transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-4 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <span
            key={day}
            className="text-xs uppercase tracking-widest text-foreground/50 font-serif"
          >
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 md:gap-4">
        {blanks.map((step) => (
          <div
            key={`blank-${step}`}
            className="aspect-square border border-transparent"
          />
        ))}

        {days.map((day) => {
          const { memory, googleEvent } = getDayData(day);
          const hasData = memory || googleEvent;

          return (
            <motion.button
              key={day}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                hasData && setSelectedEntry({ day, memory, googleEvent })
              }
              className={`relative aspect-square flex flex-col items-center justify-center border p-2 transition-colors ${
                hasData
                  ? "border-primary/20 bg-secondary/10 cursor-pointer hover:border-primary/60"
                  : "border-border/50 text-foreground/30 cursor-default"
              }`}
            >
              <span
                className={`font-serif text-xl md:text-2xl ${hasData ? "text-foreground" : ""}`}
              >
                {day}
              </span>

              <div className="absolute bottom-2 md:bottom-4 flex gap-1.5">
                {memory && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    title="Archive Memory"
                  />
                )}
                {googleEvent && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-foreground/40"
                    title="Upcoming Event"
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedEntry && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEntry(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full max-w-md h-full bg-[#FFFDF9] border-l border-border shadow-2xl z-50 p-8 flex flex-col"
            >
              <button
                onClick={() => setSelectedEntry(null)}
                className="absolute top-8 right-8 text-foreground/40 hover:text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mt-12 flex-1">
                <span className="text-primary font-serif text-xs tracking-[0.2em] uppercase border-b border-primary pb-1">
                  {monthName} {selectedEntry.day}, {year}
                </span>

                <h2 className="font-serif text-4xl text-foreground mt-8 mb-4 leading-tight">
                  {selectedEntry.memory?.title ||
                    selectedEntry.googleEvent?.title}
                </h2>

                <span className="inline-block px-3 py-1 bg-secondary/30 text-[10px] uppercase tracking-widest text-foreground/60 font-serif mb-8 border border-border">
                  {selectedEntry.memory
                    ? "Archived Memory"
                    : "Google Calendar Event"}
                </span>

                {selectedEntry.memory ? (
                  <div className="w-full aspect-square bg-secondary/20 border border-border flex items-center justify-center relative shadow-sm transform -rotate-1 mb-8">
                    <ImageIcon className="w-8 h-8 text-foreground/20" />
                    <span className="absolute bottom-4 font-serif text-xs italic text-foreground/40">
                      Polaroid Preview
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-32 bg-secondary/10 border border-dashed border-border flex flex-col items-center justify-center mb-8 gap-2">
                    <CalendarIcon className="w-6 h-6 text-foreground/40" />
                    <span className="font-serif text-sm italic text-foreground/40">
                      {selectedEntry.googleEvent?.location || "Scheduled Sync"}
                    </span>
                  </div>
                )}
              </div>

              {selectedEntry.memory && (
                <Link
                  href={`/timeline/${year}/${monthName.toLowerCase()}/${selectedEntry.day}`}
                  className="w-full py-4 border border-primary text-primary flex items-center justify-center gap-3 hover:bg-primary hover:text-background transition-colors font-serif uppercase tracking-[0.2em] text-xs"
                >
                  Read Full Entry <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
