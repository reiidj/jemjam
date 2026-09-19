"use client";

import { useState } from "react";
import { Music, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SpotifyPlayer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-background border border-border shadow-xl p-3 w-[320px] md:w-[350px]"
          >
            <div className="flex justify-between items-center mb-3 px-1">
              <span className="font-serif text-xs uppercase tracking-widest text-primary">
                Our Soundtrack
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-foreground/50 hover:text-primary transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            <iframe
              data-testid="embed-iframe"
              style={{ borderRadius: "12px" }}
              src="https://open.spotify.com/embed/playlist/0x5jeMkBjkm0FmtudAFyuQ?utm_source=generator&theme=0&si=8326ea86536e4dad"
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="bg-background"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-secondary/90 backdrop-blur-md border border-border text-foreground rounded-full flex items-center justify-center shadow-lg hover:border-primary/50 hover:text-primary transition-all duration-300"
        >
          <Music className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
