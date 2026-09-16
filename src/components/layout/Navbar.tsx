"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="flex flex-col items-start"
          onClick={() => setIsOpen(false)}
        >
          <span className="font-serif text-2xl italic text-primary leading-none">
            JemJam
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 mt-1">
            Archive
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-serif text-foreground/80">
          <Link
            href="/timeline"
            className="hover:text-primary transition-colors"
          >
            Timeline
          </Link>
          <Link
            href="/calendar"
            className="hover:text-primary transition-colors"
          >
            Calendar
          </Link>
          <Link href="/events" className="hover:text-primary transition-colors">
            Events
          </Link>
          <Link
            href="/mailbox"
            className="hover:text-primary transition-colors"
          >
            Mailbox
          </Link>
        </div>

        <div className="hidden md:block">
          <button className="text-xs uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5">
            Lock
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden p-2 -mr-2 text-foreground/80 hover:text-primary transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-0 w-full bg-background border-b border-border shadow-xl md:hidden"
          >
            <div className="flex flex-col px-6 py-10 gap-8 text-center font-serif text-lg uppercase tracking-widest text-foreground/80">
              <Link
                href="/timeline"
                onClick={() => setIsOpen(false)}
                className="hover:text-primary transition-colors"
              >
                Timeline
              </Link>
              <Link
                href="/calendar"
                onClick={() => setIsOpen(false)}
                className="hover:text-primary transition-colors"
              >
                Calendar
              </Link>
              <Link
                href="/events"
                onClick={() => setIsOpen(false)}
                className="hover:text-primary transition-colors"
              >
                Events
              </Link>
              <Link
                href="/mailbox"
                onClick={() => setIsOpen(false)}
                className="hover:text-primary transition-colors"
              >
                Mailbox
              </Link>

              <div className="pt-6 mt-2 border-t border-border w-1/2 mx-auto">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs uppercase tracking-[0.2em] text-foreground/60 hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5"
                >
                  Lock
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
