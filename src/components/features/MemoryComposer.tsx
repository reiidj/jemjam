"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { addMemory } from "@/lib/actions/memories";
import RichTextEditor from "./RichTextEditor";

export default function MemoryComposer({
  defaultDate = "",
  defaultTitle = "",
}: {
  defaultDate?: string;
  defaultTitle?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    formData.append("description", htmlContent);

    await addMemory(formData);

    setIsPending(false);
    setIsOpen(false);
    setHtmlContent("");
  };

  // Format the date nicely for the UI (e.g., "September 14, 2026")
  const formattedDisplayDate = defaultDate
    ? new Date(defaultDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : "Select a date";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-background rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full max-w-lg h-full bg-background border-l border-border shadow-2xl z-50 p-8 overflow-y-auto"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 text-foreground/40 hover:text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mt-12 mb-8 border-b border-border pb-4">
                <span className="text-primary font-serif text-xs tracking-[0.2em] uppercase">
                  Archive Entry
                </span>
                <h2 className="font-serif text-3xl text-foreground mt-2">
                  Log Memory
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* 1. Date is visually locked and passed via a hidden input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest text-foreground/50 font-serif">
                    Date
                  </label>
                  <div className="p-3 bg-secondary/5 border border-border text-foreground/50 font-serif cursor-not-allowed">
                    {formattedDisplayDate}
                  </div>
                  <input type="hidden" name="memory_date" value={defaultDate} />
                </div>

                {/* 2. Title is locked if provided, otherwise an editable input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest text-foreground/50 font-serif">
                    Title
                  </label>
                  {defaultTitle ? (
                    <>
                      <div className="p-3 bg-secondary/5 border border-border text-foreground/50 font-serif cursor-not-allowed">
                        {defaultTitle}
                      </div>
                      <input type="hidden" name="title" value={defaultTitle} />
                    </>
                  ) : (
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g., Coffee at the Corner Shop"
                      required
                      className="p-3 bg-secondary/10 border border-border focus:border-primary/50 outline-none font-serif text-foreground"
                    />
                  )}
                </div>

                <div className="flex flex-col space-y-2 mb-6">
                  <label className="text-xs uppercase tracking-widest text-foreground/50 font-serif">
                    Attach Photos
                  </label>
                  <input
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:bg-primary/10 file:text-primary file:font-serif file:text-sm hover:file:bg-primary/20 cursor-pointer text-sm text-foreground/60 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest text-foreground/50 font-serif">
                    Story
                  </label>
                  <RichTextEditor onChange={setHtmlContent} />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="mt-4 py-4 bg-primary text-background font-serif uppercase tracking-[0.2em] text-xs hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isPending ? "Saving to Archive..." : "Save to Archive"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
