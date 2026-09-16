import ical, { VEvent } from "node-ical";

export interface GoogleEvent {
  id: string;
  title: string;
  date: Date;
  description?: string;
  location?: string;
}

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

    // Set threshold to 30 days ago to keep recent past events on the calendar
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 30);

    for (const key in webEvents) {
      const event = webEvents[key];

      // Ensure the event exists and is explicitly a VEVENT
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

    // Sort chronologically (oldest to newest upcoming)
    return parsedEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
  } catch (error) {
    console.error("Failed to parse Google Calendar:", error);
    return [];
  }
}
