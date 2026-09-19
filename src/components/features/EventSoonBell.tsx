"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

const DAY_MS = 24 * 60 * 60 * 1000;

/*
 * True when the event hasn't finished yet and starts less than 24 hours
 * from now.
 *
 * - Date-only values ("2026-09-20") are treated as an all-day event in the
 *   viewer's local time, so the bell shows the day before and stays on
 *   through the day itself.
 * - Values with a time ("2026-09-20T18:00:00Z") use the exact moment.
 */
function isLessThanOneDayAway(eventDate: string): boolean {
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(eventDate);

  let start: Date;
  let end: Date;

  if (isDateOnly) {
    const [y, m, d] = eventDate.split("-").map(Number);
    start = new Date(y, m - 1, d);
    end = new Date(y, m - 1, d + 1);
  } else {
    start = new Date(eventDate);
    end = start;
  }

  const now = Date.now();
  return now < end.getTime() && start.getTime() - now < DAY_MS;
}

interface EventSoonBellProps {
  eventDate: string;
  className?: string;
}

export default function EventSoonBell({
  eventDate,
  className = "",
}: EventSoonBellProps) {
  const [isSoon, setIsSoon] = useState(false);

  useEffect(() => {
    const check = () => setIsSoon(isLessThanOneDayAway(eventDate));
    check();

    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, [eventDate]);

  if (!isSoon) return null;

  return (
    <span
      className={`relative inline-flex shrink-0 text-primary ${className}`}
      role="img"
      aria-label="Coming up in less than a day"
      title="Coming up in less than a day"
    >
      <Bell className="w-4 h-4 fill-current" />
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
    </span>
  );
}
