import Link from "next/link";
import { getMatches, getSeasons } from "@/lib/football-data";
import { seasonLabel } from "@/lib/format";
import type { Match } from "@/lib/football-data";
import { MatchCard } from "@/components/match-card";

export const metadata = { title: "Матчи — EPL Zone" };

function groupByMatchday(matches: Match[]) {
  const groups = new Map<number, Match[]>();
  for (const match of matches) {
    const list = groups.get(match.matchday) ?? [];
    list.push(match);
    groups.set(match.matchday, list);
  }
  return [...groups.entries()].sort((a, b) => a[0] - b[0]);
}

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ season?: string }>;
}) {
  const { season: seasonParam } = await searchParams;

  let errorMessage: string | null = null;
  let seasons: Awaited<ReturnType<typeof getSeasons>> = [];
  let matches: Match[] = [];
  let selectedSeason: number | undefined;

  try {
    seasons = await getSeasons();
    selectedSeason = seasonParam
      ? Number(seasonParam)
      : new Date(seasons[0]?.startDate ?? Date.now()).getFullYear();
    matches = await getMatches(selectedSeason);
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Не удалось загрузить матчи.";
  }

  const matchdayGroups = groupByMatchday(matches);
  const nextUpcomingMatchday = matches.find((m) => m.status === "SCHEDULED" || m.status === "TIMED")?.matchday;

  return (
    <main className="mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
        <h1 className="text-xl font-bold text-white sm:text-2xl">Календарь матчей</h1>
        {seasons.length > 0 && (
          <div className="-mx-3 flex gap-1.5 overflow-x-auto px-3 sm:mx-0 sm:flex-wrap sm:px-0">
            {seasons.slice(0, 6).map((s) => {
              const year = new Date(s.startDate).getFullYear();
              const isActive = year === selectedSeason;
              return (
                <Link
                  key={s.id}
                  href={`/matches?season=${year}`}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-epl-magenta to-epl-pink text-white shadow-[0_0_16px_rgba(233,0,82,0.35)]"
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {seasonLabel(s.startDate, s.endDate)}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {errorMessage}
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {matchdayGroups.map(([matchday, dayMatches]) => (
            <section key={matchday} id={`matchday-${matchday}`}>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/50">
                Тур {matchday}
                {matchday === nextUpcomingMatchday && (
                  <span className="rounded-full bg-epl-green/15 px-2 py-0.5 text-[11px] font-semibold text-epl-green">
                    ближайший
                  </span>
                )}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {dayMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
