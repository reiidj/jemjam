"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const MOCK_IMAGES = [
  "/images/hero-photo-1.jpg",
  "/images/hero-photo-2.jpg",
  "/images/hero-photo-3.jpg",
];

interface CountdownHeroProps {
  targetDateString: string | null;
  title: string;
  secureImages: string[];
}

export default function CountdownHero({
  targetDateString,
  title,
  secureImages,
}: CountdownHeroProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [cards, setCards] = useState(secureImages);

  const handleSwipe = () => {
    setCards((prev) => {
      const newCards = [...prev];
      newCards.shift();
      if (newCards.length === 0) return secureImages;
      return newCards;
    });
  };

  useEffect(() => {
    // If there is no upcoming event, keep everything at zero
    if (!targetDateString) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const targetDate = new Date(targetDateString).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateString]);

  return (
    <section className="relative flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl mx-auto py-12 lg:py-20 px-6 lg:px-8 gap-12 lg:gap-16 bg-background">
      <div className="flex-1 space-y-6 z-10 text-center lg:text-left pt-6 lg:pt-0">
        <span className="text-primary font-serif text-xs lg:text-sm tracking-[0.2em] uppercase border-b border-primary pb-1">
          Next Chapter
        </span>
        <h1 className="font-serif text-5xl md:text-7xl text-foreground leading-tight">
          {title.split(" ").map((word, i, arr) =>
            i === arr.length - 1 ? (
              <span key={i} className="italic text-primary block lg:inline">
                {" "}
                {word}
              </span>
            ) : (
              <span key={i}>{word} </span>
            ),
          )}
        </h1>

        <div className="flex justify-center lg:justify-start gap-6 mt-10 pt-8 border-t border-foreground/10">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: String(timeLeft.hours).padStart(2, "0") },
            { label: "Mins", value: String(timeLeft.minutes).padStart(2, "0") },
            { label: "Secs", value: String(timeLeft.seconds).padStart(2, "0") },
          ].map((time) => (
            <div key={time.label} className="flex flex-col items-center">
              <span className="text-4xl lg:text-5xl font-serif text-foreground">
                {time.value}
              </span>
              <span className="text-xs uppercase tracking-[0.15em] text-primary/80 mt-2">
                {time.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[520px] flex items-center justify-center perspective-[1000px] mt-8 lg:mt-0">
        <AnimatePresence>
          {cards.map((id, index) => {
            const isTop = index === 0;

            return (
              <motion.div
                key={id}
                className="absolute w-full h-full bg-background border-[1px] border-primary shadow-xl p-3 md:p-4 flex flex-col justify-between cursor-grab active:cursor-grabbing origin-bottom"
                style={{ zIndex: cards.length - index }}
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{
                  scale: 1 - index * 0.04,
                  y: index * 18,
                  opacity: 1 - index * 0.15,
                  rotate: index % 2 === 0 ? index * -1.5 : index * 1.5,
                }}
                exit={{
                  x: 400,
                  y: -150,
                  rotate: 25,
                  opacity: 0,
                  transition: { duration: 0.4, ease: "easeOut" },
                }}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(e, info) => {
                  if (Math.abs(info.offset.x) > 100) handleSwipe();
                }}
              >
                <div className="w-full h-full bg-secondary overflow-hidden border border-foreground/10">
                  <img
                    src={id}
                    alt="Memory"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="pt-4 text-center font-serif text-sm text-foreground/70 uppercase tracking-widest">
                  [ {index + 1} / {cards.length} ]
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
