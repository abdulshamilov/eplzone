import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHeadToHead, getMatch } from "@/lib/football-data";
import { formatMatchDate, STATUS_LABEL } from "@/lib/format";
import { MatchTabs } from "@/components/match-tabs";

const LIVE_STATUSES = new Set(["IN_PLAY", "PAUSED"]);

export default async function MatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const matchId = Number(id);
  if (!Number.isInteger(matchId)) notFound();

  let errorMessage: string | null = null;
  let match: Awaited<ReturnType<typeof getMatch>> | null = null;
  let h2h: Awaited<ReturnType<typeof getHeadToHead>> | null = null;

  try {
    match = await getMatch(matchId);
    h2h = await getHeadToHead(matchId).catch(() => null);
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Не удалось загрузить матч.";
  }

  if (!errorMessage && !match) notFound();
  const isLive = match ? LIVE_STATUSES.has(match.status) : false;

  return (
    <main className="mx-auto max-w-3xl px-3 py-6 sm:px-4 sm:py-10">
      <Link href="/matches" className="mb-4 inline-block text-sm text-epl-cyan hover:underline">
        ← Все матчи
      </Link>

      {errorMessage || !match ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {errorMessage}
        </div>
      ) : (
        <>
          <div className="glass-card relative overflow-hidden rounded-3xl p-5 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-epl-magenta/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-epl-cyan/10 blur-3xl" />

            <div className="relative flex items-center justify-center gap-2">
              {isLive ? (
                <span className="flex items-center gap-1.5 rounded-full bg-epl-magenta/15 px-3 py-1 text-xs font-semibold text-epl-pink">
                  <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-epl-pink" />
                  LIVE
                </span>
              ) : (
                <span className="text-xs text-white/40 sm:text-sm">
                  Тур {match.matchday} · {STATUS_LABEL[match.status] ?? match.status}
                </span>
              )}
            </div>

            <div className="relative mt-5 flex items-center justify-between gap-2 sm:mt-8 sm:gap-4">
              <div className="flex flex-1 flex-col items-center gap-3">
                <Image src={match.homeTeam.crest} alt="" width={56} height={56} unoptimized className="sm:h-20 sm:w-20" />
                <span className="text-center text-xs font-semibold text-white sm:text-base">
                  {match.homeTeam.shortName}
                </span>
              </div>
              <div className="flex shrink-0 flex-col items-center px-2">
                <span
                  className={`text-3xl font-extrabold sm:text-5xl ${
                    isLive ? "glow-cyan text-epl-cyan" : "text-white"
                  }`}
                >
                  {match.score.fullTime.home ?? "–"}:{match.score.fullTime.away ?? "–"}
                </span>
                {match.score.halfTime.home !== null && (
                  <span className="mt-2 text-[11px] text-white/40 sm:text-xs">
                    Перерыв: {match.score.halfTime.home}:{match.score.halfTime.away}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col items-center gap-3">
                <Image src={match.awayTeam.crest} alt="" width={56} height={56} unoptimized className="sm:h-20 sm:w-20" />
                <span className="text-center text-xs font-semibold text-white sm:text-base">
                  {match.awayTeam.shortName}
                </span>
              </div>
            </div>
            <p className="relative mt-6 text-center text-xs text-white/40 sm:text-sm">
              {formatMatchDate(match.utcDate)}
              {match.venue ? ` · ${match.venue}` : ""}
            </p>
          </div>

          <div className="mt-8">
            <MatchTabs
              info={
                <>
                  {match.referees.length > 0 && (
                    <p className="mb-6 text-center text-sm text-white/40">
                      Судья: {match.referees.map((r) => r.name).join(", ")}
                    </p>
                  )}

                  <h2 className="mb-3 text-base font-bold text-white sm:text-lg">Личные встречи</h2>
                  {h2h ? (
                    <>
                      <div className="glass-card mb-4 grid grid-cols-3 gap-2 rounded-2xl p-4 text-center">
                        <div>
                          <p className="text-xl font-bold text-epl-cyan">{h2h.aggregates.homeTeam.wins}</p>
                          <p className="text-xs text-white/40">Побед {h2h.aggregates.homeTeam.name}</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-white">{h2h.aggregates.homeTeam.draws}</p>
                          <p className="text-xs text-white/40">Ничьих</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-epl-cyan">{h2h.aggregates.awayTeam.wins}</p>
                          <p className="text-xs text-white/40">Побед {h2h.aggregates.awayTeam.name}</p>
                        </div>
                      </div>
                      <div className="glass-card overflow-hidden rounded-2xl">
                        {h2h.matches.map((m) => (
                          <Link
                            key={m.id}
                            href={`/matches/${m.id}`}
                            className="glass-row flex items-center gap-2 px-3 py-2.5 text-xs transition-colors last:border-0 hover:bg-white/[0.03] sm:text-sm"
                          >
                            <span className="w-16 shrink-0 text-[11px] text-white/40 sm:w-24 sm:text-xs">
                              {formatMatchDate(m.utcDate)}
                            </span>
                            <span className="flex-1 truncate text-right font-medium text-white">
                              {m.homeTeam.shortName}
                            </span>
                            <span className="w-10 shrink-0 text-center font-semibold text-white">
                              {m.score.fullTime.home ?? "–"}:{m.score.fullTime.away ?? "–"}
                            </span>
                            <span className="flex-1 truncate font-medium text-white">
                              {m.awayTeam.shortName}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-white/40">История личных встреч недоступна.</p>
                  )}
                </>
              }
              lineups={
                <div className="glass-card rounded-2xl p-8 text-center text-sm text-white/40">
                  Составы команд появятся после подключения бэкенда с данными о матче.
                </div>
              }
              stats={
                <div className="glass-card rounded-2xl p-8 text-center text-sm text-white/40">
                  Удары, владение мячом и другая детальная статистика недоступны на бесплатном
                  тарифе football-data.org.
                </div>
              }
            />
          </div>
        </>
      )}
    </main>
  );
}
