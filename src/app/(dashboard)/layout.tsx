import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SpotifyPlayer from "@/components/layout/SpotifyPlayer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col relative">
      <Navbar />

      {/* The main content flexes to push the footer down */}
      <div className="flex-1 flex flex-col">
        {children}
        <Footer />
      </div>

      {/* The sticky player sits completely outside the scroll flow */}
      <SpotifyPlayer />
    </div>
  );
}
