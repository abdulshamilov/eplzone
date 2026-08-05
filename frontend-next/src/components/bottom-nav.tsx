"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ICONS = {
  home: (
    <path d="M3 11.5 12 4l9 7.5M5 10v9.5a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
  ),
  matches: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  table: (
    <>
      <rect x="3.5" y="4" width="17" height="16" rx="2" />
      <path d="M3.5 10h17M9 4v16" />
    </>
  ),
  teams: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M2.5 20c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6" />
      <circle cx="17.5" cy="8.5" r="2.3" />
      <path d="M15.8 14.2c2.9.4 5.2 2.6 5.2 5.8" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </>
  ),
};

const TABS: Array<{ href: string; label: string; icon: keyof typeof ICONS; match?: (p: string) => boolean }> = [
  { href: "/", label: "Главная", icon: "home", match: (p) => p === "/" },
  { href: "/matches", label: "Матчи", icon: "matches", match: (p) => p.startsWith("/matches") || p.startsWith("/live") },
  { href: "/table", label: "Таблица", icon: "table" },
  { href: "/teams", label: "Клубы", icon: "teams", match: (p) => p.startsWith("/teams") || p.startsWith("/players") },
  { href: "/search", label: "Ещё", icon: "more", match: (p) => ["/search", "/news", "/highlights", "/stats", "/login", "/register", "/profile"].some((x) => p.startsWith(x)) },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/60 backdrop-blur-xl sm:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2 py-1.5">
        {TABS.map((tab) => {
          const isActive = tab.match ? tab.match(pathname) : pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-medium transition-colors ${
                isActive ? "text-epl-cyan" : "text-white/40"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={isActive ? 2.2 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-5 w-5 ${isActive ? "drop-shadow-[0_0_6px_rgba(4,245,255,0.6)]" : ""}`}
              >
                {ICONS[tab.icon]}
              </svg>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
