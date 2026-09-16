import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
// 1. Swap to your secure server utility
import { createClient } from "@/utils/supabase/server";

export default async function DetailedMemoryView({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string }>;
}) {
  const { year, month, day } = await params;
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  // 2. Initialize it using await
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
  // Ensure single digit days (like '1') become '01' to match SQL date format
  const formattedDay = day.padStart(2, "0");
  const targetDate = `${year}-${monthNumber}-${formattedDay}`;

  // Fetch the specific memory from Supabase securely
  const { data: memory, error } = await supabase
    .from("memories")
    .select("*")
    .eq("memory_date", targetDate)
    .single();

  if (error) {
    console.error("Error fetching specific memory:", error);
  }

  if (!memory) {
    notFound(); // Triggers the default Next.js 404 page if no memory exists
  }

  return (
    <article className="w-full max-w-4xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
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
          {memory.title}
        </h1>
      </header>

      {/* Renders your rich-text Tiptap HTML cleanly */}
      <div
        className="prose prose-stone mx-auto font-serif text-foreground/80 leading-loose text-lg mb-16 whitespace-pre-wrap"
        dangerouslySetInnerHTML={{
          __html: memory.content || memory.description || "",
        }}
      />

      {/* Temporary Mock Gallery Frame until we build the upload feature */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-background border border-primary p-4 pb-12 shadow-md transform rotate-1 hover:rotate-0 transition-transform duration-300">
          <div className="w-full aspect-square bg-secondary/30 border border-border flex items-center justify-center">
            <span className="text-foreground/30 font-serif text-sm italic">
              Gallery Upload Coming Next
            </span>
          </div>
        </div>
      </div>

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
    </article>
  );
}
