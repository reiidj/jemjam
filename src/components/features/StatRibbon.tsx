"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Heart, Mail } from "lucide-react";

// Updated to September 16, 2025
const ANNIVERSARY_DATE = new Date("2025-09-16T00:00:00").getTime();

// 1. We define the props we expect to receive from the server
interface StatRibbonProps {
  totalDates: number;
  unreadLetters: number;
}

export default function StatRibbon({
  totalDates,
  unreadLetters,
}: StatRibbonProps) {
  const [daysTogether, setDaysTogether] = useState(0);

  useEffect(() => {
    const now = new Date().getTime();
    const difference = now - ANNIVERSARY_DATE;
    // Calculate days. If the date is in the future, it might show negative, so we can clamp it to 0 if needed!
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    setDaysTogether(days > 0 ? days : 0);
  }, []);

  const stats = [
    {
      id: 1,
      label: "Days Together",
      value: daysTogether,
      icon: <Heart className="w-5 h-5 text-primary" strokeWidth={1.5} />,
    },
    {
      id: 2,
      label: "Total Dates",
      value: totalDates, // 2. Using the dynamic prop
      icon: <CalendarDays className="w-5 h-5 text-primary" strokeWidth={1.5} />,
    },
    {
      id: 3,
      label: "Unread Letters",
      value: unreadLetters, // 3. Using the dynamic prop
      icon: <Mail className="w-5 h-5 text-primary" strokeWidth={1.5} />,
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 lg:px-8 pb-12 z-20 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex items-center justify-between p-6 bg-background border border-border shadow-sm group hover:border-primary/40 transition-colors duration-300"
          >
            <div className="flex flex-col space-y-1">
              <span className="text-xs uppercase tracking-widest text-foreground/60 font-serif">
                {stat.label}
              </span>
              <span className="text-3xl font-serif text-foreground">
                {stat.value.toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-secondary/30 rounded-full group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
