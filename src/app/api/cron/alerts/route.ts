import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEventAlertEmail } from "@/lib/email";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split("T")[0];

  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("title, location")
    .gte("event_date", `${tomorrowString}T00:00:00.000Z`)
    .lt("event_date", `${tomorrowString}T23:59:59.999Z`);

  const emailsToSend = [];

  if (upcomingEvents && upcomingEvents.length > 0) {
    for (const event of upcomingEvents) {
      emailsToSend.push(
        sendEventAlertEmail({
          to: process.env.EMAIL_USER!,
          title: event.title,
          location: event.location,
        }),
      );
    }
  }

  if (emailsToSend.length > 0) {
    await Promise.all(emailsToSend);
  }

  return NextResponse.json({ success: true, alertsSent: emailsToSend.length });
}
