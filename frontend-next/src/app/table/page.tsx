import Image from "next/image";
import Link from "next/link";
import { getMatches, getSeasons, getStandings } from "@/lib/football-data";
import { formatMatchDate, seasonLabel, STATUS_LABEL } from "@/lib/format";

export const metadata = {
  title: "Турнирная таблица — EPL Zone",
};

export default async function TablePage({
  searchParams,
}: {
  searchParams: Promise<{ season?: string }>;
}) {
  const { season: seasonParam } = await searchParams;

  let errorMessage: string | null = null;
  let rows: Awaited<ReturnType<typeof getStandings>>["standings"][number]["table"] = [];
  let currentMatchday: number | null = null;
  let seasons: Awaited<ReturnType<typeof getSeasons>> = [];
  let matches: Awaited<ReturnType<typeof getMatches>> = [];
  let selectedSeason: number | undefined;

  try {
    seasons = await getSeasons();
    selectedSeason = seasonParam
      ? Number(seasonParam)
      : new Date(seasons[0]?.startDate ?? Date.now()).getFullYear();

    const [standingsData, matchesData] = await Promise.all([
      getStandings(selectedSeason),
      getMatches(selectedSeason),
    ]);

    rows = standingsData.standings.find((s) => s.type === "TOTAL")?.table ?? [];
    currentMatchday = standingsData.season.currentMatchday;
    matches = matchesData;
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Не удалось загрузить таблицу.";
  }

  return (
    <main className="mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-10">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-white sm:text-2xl">Турнирная таблица</h1>
        {seasons.length > 0 && (
          <div className="-mx-3 flex gap-1.5 overflow-x-auto px-3 sm:mx-0 sm:flex-wrap sm:px-0">
            {seasons.slice(0, 6).map((s) => {
              const year = new Date(s.startDate).getFullYear();
              const isActive = year === selectedSeason;
              return (
                <Link
                  key={s.id}
                  href={`/table?season=${year}`}
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
      {currentMatchday && (
        <p className="mb-4 text-sm text-white/40 sm:mb-6">
          Premier League · Тур {currentMatchday}
        </p>
      )}

      {errorMessage ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {errorMessage}
        </div>
      ) : (
        <>
          <div className="glass-card overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[480px] border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="glass-row text-left text-white/40">
                  <th className="px-2 py-2.5 font-medium sm:px-3">#</th>
                  <th className="px-2 py-2.5 font-medium sm:px-3">Клуб</th>
                  <th className="px-2 py-2.5 text-center font-medium sm:px-3">И</th>
                  <th className="px-2 py-2.5 text-center font-medium sm:px-3">В</th>
                  <th className="px-2 py-2.5 text-center font-medium sm:px-3">Н</th>
                  <th className="px-2 py-2.5 text-center font-medium sm:px-3">П</th>
                  <th className="px-2 py-2.5 text-center font-medium sm:px-3">ЗМ</th>
                  <th className="px-2 py-2.5 text-center font-medium sm:px-3">ПМ</th>
                  <th className="px-2 py-2.5 text-center font-medium sm:px-3">РМ</th>
                  <th className="px-2 py-2.5 text-center font-medium sm:px-3">О</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.team.id} className="glass-row last:border-0 hover:bg-white/[0.03]">
                    <td className="px-2 py-2.5 text-white/40 sm:px-3">{row.position}</td>
                    <td className="px-2 py-2.5 sm:px-3">
                      <div className="flex items-center gap-2">
                        <Image
                          src={row.team.crest}
                          alt=""
                          width={20}
                          height={20}
                          className="shrink-0"
                          unoptimized
                        />
                        <span className="font-medium text-white">{row.team.shortName}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-center text-white/70 sm:px-3">{row.playedGames}</td>
                    <td className="px-2 py-2.5 text-center text-white/70 sm:px-3">{row.won}</td>
                    <td className="px-2 py-2.5 text-center text-white/70 sm:px-3">{row.draw}</td>
                    <td className="px-2 py-2.5 text-center text-white/70 sm:px-3">{row.lost}</td>
                    <td className="px-2 py-2.5 text-center text-white/70 sm:px-3">{row.goalsFor}</td>
                    <td className="px-2 py-2.5 text-center text-white/70 sm:px-3">{row.goalsAgainst}</td>
                    <td className="px-2 py-2.5 text-center text-white/70 sm:px-3">{row.goalDifference}</td>
                    <td className="px-2 py-2.5 text-center font-semibold text-epl-cyan sm:px-3">
                      {row.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-3 mt-8 flex items-center justify-between sm:mt-10">
            <h2 className="text-base font-bold text-white sm:text-lg">
              Встречи сезона {selectedSeason ? `${selectedSeason}/${String(selectedSeason + 1).slice(2)}` : ""}
            </h2>
            <Link href="/matches" className="text-sm font-medium text-epl-cyan hover:underline">
              Все матчи →
            </Link>
          </div>
          <div className="glass-card max-h-[32rem] overflow-y-auto rounded-2xl">
            {matches.length === 0 && (
              <p className="p-4 text-sm text-white/40">Матчи не найдены.</p>
            )}
            {matches.map((match) => (
              <Link
                key={match.id}
                href={`/matches/${match.id}`}
                className="glass-row flex items-center gap-2 px-3 py-3 text-xs transition-colors last:border-0 hover:bg-white/[0.03] sm:gap-3 sm:px-4 sm:text-sm"
              >
                <span className="w-16 shrink-0 text-[11px] text-white/40 sm:w-24 sm:text-xs">
                  {formatMatchDate(match.utcDate)}
                </span>
                <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-2">
                  <span className="truncate font-medium text-white">{match.homeTeam.shortName}</span>
                  <Image src={match.homeTeam.crest} alt="" width={18} height={18} unoptimized className="shrink-0" />
                </div>
                <span className="w-12 shrink-0 text-center font-semibold text-white sm:w-14">
                  {match.score.fullTime.home ?? "–"}:{match.score.fullTime.away ?? "–"}
                </span>
                <div className="flex flex-1 items-center gap-1.5 sm:gap-2">
                  <Image src={match.awayTeam.crest} alt="" width={18} height={18} unoptimized className="shrink-0" />
                  <span className="truncate font-medium text-white">{match.awayTeam.shortName}</span>
                </div>
                <span className="hidden w-24 shrink-0 text-right text-xs text-white/40 sm:inline-block">
                  {STATUS_LABEL[match.status] ?? match.status}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
