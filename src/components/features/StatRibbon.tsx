"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Heart, Mail } from "lucide-react";
import Link from "next/link";

const ANNIVERSARY_DATE = new Date("2025-09-16T00:00:00").getTime();

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
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    setDaysTogether(days > 0 ? days : 0);
  }, []);

  // Added 'href' to map where each button should route to
  const stats = [
    {
      id: 1,
      label: "Days Together",
      value: daysTogether,
      icon: <Heart className="w-5 h-5 text-primary" strokeWidth={1.5} />,
      href: "/timeline",
    },
    {
      id: 2,
      label: "Total Dates",
      value: totalDates,
      icon: <CalendarDays className="w-5 h-5 text-primary" strokeWidth={1.5} />,
      href: "/archive", // Pointing to our new page!
    },
    {
      id: 3,
      label: "Unread Letters",
      value: unreadLetters,
      icon: <Mail className="w-5 h-5 text-primary" strokeWidth={1.5} />,
      href: "/mailbox",
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 lg:px-8 pb-12 z-20 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            href={stat.href}
            key={stat.id}
            className="flex items-center justify-between p-6 bg-background border border-border shadow-sm group hover:border-primary/40 transition-colors duration-300 cursor-pointer"
          >
            <div className="flex flex-col space-y-1">
              <span className="text-xs uppercase tracking-widest text-foreground/60 font-serif">
                {stat.label}
              </span>
              <span className="text-3xl font-serif text-foreground group-hover:text-primary transition-colors">
                {stat.value.toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-secondary/30 rounded-full group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
              {stat.icon}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
