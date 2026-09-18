"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MailPlus, Loader2, Clock } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import { addLetter } from "@/lib/actions/mailbox";

export default function MailboxComposer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentHTML, setContentHTML] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      const rawDate = formData.get("deliver_at") as string;
      if (rawDate) {
        formData.set("deliver_at", new Date(rawDate).toISOString());
      }

      await addLetter(formData, contentHTML);

      setIsOpen(false);
      setContentHTML("");
    } catch (error) {
      console.error("Failed to add letter:", error);
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
          <MailPlus className="w-5 h-5 text-foreground/50 group-hover:text-primary transition-colors" />
          <span className="font-serif uppercase tracking-[0.2em] text-xs">
            Draft Letter
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
                    Time-Locked Mail
                  </span>
                  <h2 className="font-serif text-4xl text-foreground mt-2">
                    Seal an Envelope
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
                        Subject / Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        placeholder="E.g., Open on our Anniversary"
                        className="w-full bg-transparent border-b border-border/50 pb-2 font-serif text-2xl text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="sender_name"
                          className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-2"
                        >
                          From
                        </label>
                        <input
                          type="text"
                          name="sender_name"
                          id="sender_name"
                          defaultValue="Me"
                          required
                          className="w-full bg-transparent border-b border-border/50 pb-2 font-serif text-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="recipient_email"
                          className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-2"
                        >
                          Recipient (Optional)
                        </label>
                        <input
                          type="email"
                          name="recipient_email"
                          id="recipient_email"
                          placeholder="her@email.com"
                          className="w-full bg-transparent border-b border-border/50 pb-2 font-serif text-lg text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="deliver_at"
                        className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-2 flex items-center gap-2"
                      >
                        <Clock className="w-3 h-3" /> Delivery Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        name="deliver_at"
                        id="deliver_at"
                        required
                        className="w-full bg-transparent border-b border-border/50 pb-2 font-serif text-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-2">
                        The Letter
                      </label>
                      <RichTextEditor onChange={setContentHTML} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-background border border-primary text-primary hover:bg-primary hover:text-background transition-colors font-serif uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Sealing
                        Envelope...
                      </>
                    ) : (
                      "Lock & Send"
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
