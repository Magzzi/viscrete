"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";

const LandingNav = () => {

  return (
    <header className="fixed top-0 left-0 right-0 z-50
                       border-b border-emerald-100 dark:border-[#2ca75d]/10
                       bg-white/80 dark:bg-[#14171e]/80 backdrop-blur-md">
      <div className="container max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <span className="text-sm font-bold font-mono tracking-tight
                           bg-gradient-to-r from-[#2ca75d] to-[#0da6f2]
                           bg-clip-text text-transparent">
            viscrete
          </span>
          <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-500 font-mono">
            / structural inspection
          </span>
        </Link>

        {/* Right side */}
        <ModeToggle />
      </div>
    </header>
  );
};

export default LandingNav;
