export default function Footer() {
  return (
    <footer className="w-full bg-primary pt-12 pb-24 mt-20 shadow-inner">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center gap-4">
        <span className="font-serif text-2xl italic text-background leading-none">
          JemJam
        </span>

        <p className="font-serif text-sm text-background/80 max-w-sm">
          A documentation of shared memories, made with love by Djemf.
        </p>

        <div className="flex items-center gap-4 mt-6">
          <div className="h-px w-8 bg-background/30" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-background/60 font-serif">
            Volume I &copy; {new Date().getFullYear()}
          </span>
          <div className="h-px w-8 bg-background/30" />
        </div>
      </div>
    </footer>
  );
}
