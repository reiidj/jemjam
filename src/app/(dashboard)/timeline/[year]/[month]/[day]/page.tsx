import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, PenLine } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getAllGoogleEvents, getManilaDateParts } from "@/lib/calendar";
import MemoryComposer from "@/components/features/MemoryComposer";

export default async function DetailedMemoryView({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string }>;
}) {
  const { year, month, day } = await params;
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  // Initialize secure client
  const supabase = await createClient();

  // Map string month to numeric for the database query
  const monthMap: Record<string, string> = {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
  };

  const monthNumber = monthMap[month.toLowerCase()];
  const formattedDay = day.padStart(2, "0");
  const targetDate = `${year}-${monthNumber}-${formattedDay}`;

  // Fetch Supabase memory AND Google Events concurrently
  // Using .maybeSingle() prevents throwing an error if the Supabase row doesn't exist yet!
  const [{ data: memory, error }, allGoogleEvents] = await Promise.all([
    supabase
      .from("memories")
      .select("*")
      .eq("memory_date", targetDate)
      .maybeSingle(),
    getAllGoogleEvents(),
  ]);

  if (error) {
    console.error("Error fetching specific memory:", error);
  }

  // 1. Generate Secure URLs for the private gallery
  let secureGalleryUrls: string[] = [];

  if (memory?.images && memory.images.length > 0) {
    const { data: signedUrlsData } = await supabase.storage
      .from("jemjam-vault")
      .createSignedUrls(memory.images, 3600); // 1-hour expiration

    secureGalleryUrls =
      signedUrlsData
        ?.map((file) => file.signedUrl)
        .filter((url): url is string => !!url) || [];
  }

  // Look for a matching Google Calendar event on this exact date
  const matchingGoogleEvent = allGoogleEvents.find((event) => {
    const {
      year: eventYear,
      month: eventMonth,
      day: eventDay,
    } = getManilaDateParts(event.date);
    return (
      eventYear === year &&
      eventMonth === monthNumber &&
      eventDay === formattedDay
    );
  });

  // If there is NO memory and NO Google Event, trigger the 404 page
  if (!memory && !matchingGoogleEvent) {
    notFound();
  }

  // Determine which title to show (Supabase takes priority over the read-only Google skeleton)
  const displayTitle = memory?.title || matchingGoogleEvent?.title;

  return (
    <article className="w-full max-w-4xl mx-auto px-6 lg:px-8 py-12 lg:py-20 relative">
      <Link
        href={`/timeline/${year}/${month}`}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 hover:text-primary transition-colors mb-12"
      >
        <ArrowLeft className="w-4 h-4" /> Back to {capitalizedMonth}
      </Link>

      <header className="text-center mb-16 space-y-6">
        <span className="text-primary font-serif text-sm tracking-[0.3em] uppercase block">
          {capitalizedMonth} {day}, {year}
        </span>
        <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight max-w-2xl mx-auto">
          {displayTitle}
        </h1>
      </header>

      {/* Conditionally Render Content based on whether it's a native Memory or just a Google Skeleton */}
      {memory ? (
        <>
          {/* Renders your rich-text Tiptap HTML cleanly */}
          <div
            className="prose prose-stone mx-auto font-serif text-foreground/80 leading-loose text-lg mb-16 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: memory.content || memory.description || "",
            }}
          />

          {/* Live Supabase Gallery */}
          {secureGalleryUrls.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px bg-border flex-1" />
                <span className="font-serif text-xs uppercase tracking-widest text-foreground/40">
                  Gallery
                </span>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 2. Loop over your newly generated secure URLs instead of memory.images */}
                {secureGalleryUrls.map((url: string, index: number) => (
                  <div
                    key={index}
                    className={`bg-background border border-border p-3 shadow-md transform transition-transform duration-500 hover:rotate-0 hover:z-10 hover:scale-105 ${
                      index % 2 === 0 ? "rotate-2" : "-rotate-1"
                    }`}
                  >
                    <div className="relative w-full aspect-square overflow-hidden bg-secondary/10">
                      <img
                        src={url}
                        alt={`Memory from ${targetDate}`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {memory.google_drive_url && (
            <div className="border-t border-border pt-12 flex flex-col items-center text-center">
              <span className="font-serif text-sm text-foreground/60 mb-4">
                Want to see the rest of the photos from this day?
              </span>
              <a
                href={memory.google_drive_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-background transition-colors font-serif uppercase tracking-[0.2em] text-xs"
              >
                Open Google Drive Vault <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </>
      ) : (
        /* Empty State for Google Events waiting for a memory */
        <div className="text-center border-t border-border pt-16 flex flex-col items-center">
          <PenLine className="w-8 h-8 text-foreground/30 mb-6" />
          <p className="font-serif text-xl text-foreground/60 mb-2">
            This date was saved from your calendar.
          </p>
          <p className="font-serif text-foreground/40 text-sm">
            Click the button in the corner to log the memory and attach photos.
          </p>
        </div>
      )}

      {/* Put the Composer here so you can add memories right from the empty day! */}
      <MemoryComposer defaultDate={targetDate} defaultTitle={displayTitle} />
    </article>
  );
}
