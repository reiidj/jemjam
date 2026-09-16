import ical, { VEvent } from "node-ical";

export interface GoogleEvent {
  id: string;
  title: string;
  date: Date;
  description?: string;
  location?: string;
}

// 1. Get upcoming events (with 30-day past threshold for the calendar view)
export async function getUpcomingGoogleEvents(): Promise<GoogleEvent[]> {
  const icalUrl = process.env.GOOGLE_ICAL_URL;

  if (!icalUrl) {
    console.warn("Missing GOOGLE_ICAL_URL in environment variables.");
    return [];
  }

  try {
    const webEvents = await ical.async.fromURL(icalUrl);
    if (!webEvents) return [];

    const parsedEvents: GoogleEvent[] = [];
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 30);

    for (const key in webEvents) {
      const event = webEvents[key];
      if (event && event.type === "VEVENT") {
        const vEvent = event as VEvent;
        if (vEvent.start) {
          const eventDate = new Date(vEvent.start as Date);
          if (eventDate >= thresholdDate) {
            parsedEvents.push({
              id: vEvent.uid || crypto.randomUUID(),
              title: vEvent.summary || "Untitled Event",
              date: eventDate,
              description: vEvent.description || "",
              location: vEvent.location || "",
            });
          }
        }
      }
    }

    return parsedEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
  } catch (error) {
    console.error("Failed to parse Google Calendar:", error);
    return [];
  }
}

// 2. Get just the total number of events for the StatRibbon
export async function getTotalGoogleEventsCount(): Promise<number> {
  const icalUrl = process.env.GOOGLE_ICAL_URL;
  if (!icalUrl) return 0;

  try {
    const webEvents = await ical.async.fromURL(icalUrl);
    if (!webEvents) return 0;

    let totalCount = 0;
    for (const key in webEvents) {
      const event = webEvents[key];
      if (event && event.type === "VEVENT") {
        totalCount++;
      }
    }
    return totalCount;
  } catch (error) {
    console.error("Failed to count total Google Calendar events:", error);
    return 0;
  }
}

// 3. Get all events (past and future) for the /archive page list
export async function getAllGoogleEvents(): Promise<GoogleEvent[]> {
  const icalUrl = process.env.GOOGLE_ICAL_URL;
  if (!icalUrl) return [];

  try {
    const webEvents = await ical.async.fromURL(icalUrl);
    if (!webEvents) return [];

    const parsedEvents: GoogleEvent[] = [];

    for (const key in webEvents) {
      const event = webEvents[key];
      if (event && event.type === "VEVENT") {
        const vEvent = event as VEvent;
        if (vEvent.start) {
          parsedEvents.push({
            id: vEvent.uid || crypto.randomUUID(),
            title: vEvent.summary || "Untitled Event",
            date: new Date(vEvent.start as Date),
            description: vEvent.description || "",
            location: vEvent.location || "",
          });
        }
      }
    }

    return parsedEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
  } catch (error) {
    console.error("Failed to parse Google Calendar archive:", error);
    return [];
  }
}
