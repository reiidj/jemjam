import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import SpotifyPlayer from "@/components/layout/SpotifyPlayer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      {/* The player sits completely outside the page routing! */}
      <SpotifyPlayer />
    </div>
  );
}
