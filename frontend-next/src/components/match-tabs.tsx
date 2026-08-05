"use client";

import { useState, type ReactNode } from "react";

const TABS = [
  { key: "info", label: "Инфо" },
  { key: "lineups", label: "Составы" },
  { key: "stats", label: "Статистика" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function MatchTabs({
  info,
  lineups,
  stats,
}: {
  info: ReactNode;
  lineups: ReactNode;
  stats: ReactNode;
}) {
  const [active, setActive] = useState<TabKey>("info");
  const content = { info, lineups, stats } satisfies Record<TabKey, ReactNode>;

  return (
    <div>
      <div className="glass-card mb-6 flex gap-1 rounded-full p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex-1 rounded-full py-2 text-xs font-semibold transition-colors sm:text-sm ${
              active === tab.key
                ? "bg-gradient-to-r from-epl-magenta to-epl-pink text-white shadow-[0_0_16px_rgba(233,0,82,0.3)]"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {content[active]}
    </div>
  );
}
