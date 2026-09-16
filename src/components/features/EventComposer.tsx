"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarPlus, MapPin, Loader2 } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import { addEvent } from "@/lib/actions/events";

export default function EventComposer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descriptionHTML, setDescriptionHTML] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      await addEvent(formData, descriptionHTML);

      setIsOpen(false);
      setDescriptionHTML(""); // Reset after successful submission
    } catch (error) {
      console.error("Failed to add event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-background border border-border p-4 shadow-lg hover:border-primary hover:-translate-y-1 transition-all group z-30"
      >
        <div className="flex items-center gap-3">
          <CalendarPlus className="w-5 h-5 text-foreground/50 group-hover:text-primary transition-colors" />
          <span className="font-serif uppercase tracking-[0.2em] text-xs">
            Add Plan
          </span>
        </div>
      </button>

      {/* Slide-Over Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full max-w-xl h-full bg-[#FFFDF9] border-l border-border shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-8 md:p-12">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-8 right-8 text-foreground/40 hover:text-primary transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="mb-12">
                  <span className="text-primary font-serif text-sm tracking-[0.2em] uppercase">
                    New Itinerary
                  </span>
                  <h2 className="font-serif text-4xl text-foreground mt-2">
                    Draft a Plan
                  </h2>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-8 flex flex-col h-full"
                >
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-2"
                      >
                        Event Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        placeholder="E.g., Weekend Getaway to Tagaytay"
                        className="w-full bg-transparent border-b border-border/50 pb-2 font-serif text-2xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="event_date"
                          className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-2"
                        >
                          Date
                        </label>
                        <input
                          type="date"
                          name="event_date"
                          id="event_date"
                          required
                          className="w-full bg-transparent border-b border-border/50 pb-2 font-serif text-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="location"
                          className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-2 flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3" /> Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          id="location"
                          placeholder="Where to?"
                          className="w-full bg-transparent border-b border-border/50 pb-2 font-serif text-lg text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-2">
                        The Details
                      </label>
                      <RichTextEditor onChange={setDescriptionHTML} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-background border border-primary text-primary hover:bg-primary hover:text-background transition-colors font-serif uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving
                        Plan...
                      </>
                    ) : (
                      "Add to Itinerary"
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
