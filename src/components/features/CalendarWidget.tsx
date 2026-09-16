"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  // Calendar Math
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Creates a 42-cell grid (6 weeks) to ensure all months fit perfectly
  const gridCells = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - firstDayOfMonth + 1;
    return dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : null;
  });

  return (
    <div className="bg-background border border-border p-6 shadow-sm w-full">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
        <h2 className="font-serif text-2xl text-foreground">
          {monthName} {year}
        </h2>
        <div className="flex gap-4">
          <button
            onClick={prevMonth}
            className="text-foreground/50 hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="text-foreground/50 hover:text-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <span
            key={day}
            className="text-[10px] uppercase tracking-widest text-foreground/50 font-serif"
          >
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {gridCells.map((day, idx) => {
          // Temporary mock database matches, we will replace this with real Supabase/Google data
          const hasMemory = day === 14 || day === 22;

          return (
            <div
              key={idx}
              className={`aspect-square flex items-center justify-center relative cursor-pointer border ${
                day
                  ? "border-transparent hover:border-primary/30"
                  : "border-transparent pointer-events-none"
              } transition-colors`}
            >
              <span
                className={`font-serif text-sm ${day ? "text-foreground" : "text-transparent"}`}
              >
                {day || ""}
              </span>

              {day && hasMemory && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
