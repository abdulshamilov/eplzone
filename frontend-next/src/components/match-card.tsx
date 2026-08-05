import Image from "next/image";
import Link from "next/link";
import type { Match } from "@/lib/football-data";
import { formatMatchDate, STATUS_LABEL } from "@/lib/format";

const LIVE_STATUSES = new Set(["IN_PLAY", "PAUSED"]);

export function MatchCard({ match }: { match: Match }) {
  const isLive = LIVE_STATUSES.has(match.status);
  const isFinished = match.status === "FINISHED";

  return (
    <Link
      href={`/matches/${match.id}`}
      className="glass-card block rounded-2xl p-4 transition-transform hover:-translate-y-0.5 hover:border-white/20 sm:p-5"
    >
      <div className="mb-3 flex items-center justify-between text-xs">
        {isLive ? (
          <span className="flex items-center gap-1.5 rounded-full bg-epl-magenta/15 px-2.5 py-1 font-semibold text-epl-pink">
            <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-epl-pink" />
            LIVE
          </span>
        ) : (
          <span className="text-white/40">{formatMatchDate(match.utcDate)}</span>
        )}
        <span className="text-white/40">Тур {match.matchday}</span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 flex-col items-center gap-2 text-center">
          <Image src={match.homeTeam.crest} alt="" width={36} height={36} unoptimized />
          <span className="text-xs font-medium text-white/90 sm:text-sm">
            {match.homeTeam.shortName}
          </span>
        </div>

        <div className="flex shrink-0 flex-col items-center px-2">
          {isFinished || isLive ? (
            <span
              className={`text-xl font-extrabold sm:text-2xl ${
                isLive ? "glow-cyan text-epl-cyan" : "text-white"
              }`}
            >
              {match.score.fullTime.home ?? 0}:{match.score.fullTime.away ?? 0}
            </span>
          ) : (
            <span className="text-sm font-semibold text-white/70">vs</span>
          )}
          {!isLive && (
            <span className="mt-1 text-[10px] text-white/30">
              {STATUS_LABEL[match.status] ?? match.status}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col items-center gap-2 text-center">
          <Image src={match.awayTeam.crest} alt="" width={36} height={36} unoptimized />
          <span className="text-xs font-medium text-white/90 sm:text-sm">
            {match.awayTeam.shortName}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedMatchCard({ match }: { match: Match }) {
  const isLive = LIVE_STATUSES.has(match.status);
  const isFinished = match.status === "FINISHED";

  return (
    <Link
      href={`/matches/${match.id}`}
      className="glass-card relative block overflow-hidden rounded-3xl p-6 transition-transform hover:-translate-y-1 hover:border-white/20 sm:p-10"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-epl-magenta/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-epl-cyan/15 blur-3xl" />

      <div className="relative mb-6 flex items-center justify-between">
        {isLive ? (
          <span className="flex items-center gap-1.5 rounded-full bg-epl-magenta/15 px-3 py-1.5 text-xs font-bold text-epl-pink">
            <span className="live-dot inline-block h-2 w-2 rounded-full bg-epl-pink" />
            LIVE
          </span>
        ) : (
          <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/50">
            {formatMatchDate(match.utcDate)}
          </span>
        )}
        <span className="text-xs font-semibold uppercase tracking-wider text-white/30">
          Тур {match.matchday}
        </span>
      </div>

      <div className="relative flex items-center justify-between gap-3 sm:gap-6">
        <div className="flex flex-1 flex-col items-center gap-3 text-center">
          <Image src={match.homeTeam.crest} alt="" width={64} height={64} unoptimized className="sm:h-20 sm:w-20" />
          <span className="text-sm font-bold text-white sm:text-lg">{match.homeTeam.shortName}</span>
        </div>

        <div className="flex shrink-0 flex-col items-center px-2">
          {isFinished || isLive ? (
            <span
              className={`text-4xl font-black sm:text-6xl ${isLive ? "glow-cyan text-epl-cyan" : "text-white"}`}
            >
              {match.score.fullTime.home ?? 0}:{match.score.fullTime.away ?? 0}
            </span>
          ) : (
            <span className="text-xl font-bold text-white/50 sm:text-2xl">vs</span>
          )}
          {!isLive && (
            <span className="mt-2 text-xs text-white/30">{STATUS_LABEL[match.status] ?? match.status}</span>
          )}
        </div>

        <div className="flex flex-1 flex-col items-center gap-3 text-center">
          <Image src={match.awayTeam.crest} alt="" width={64} height={64} unoptimized className="sm:h-20 sm:w-20" />
          <span className="text-sm font-bold text-white sm:text-lg">{match.awayTeam.shortName}</span>
        </div>
      </div>
    </Link>
  );
}

export function CompactMatchCard({ match }: { match: Match }) {
  const isLive = LIVE_STATUSES.has(match.status);

  return (
    <Link
      href={`/matches/${match.id}`}
      className="glass-card block w-44 shrink-0 rounded-2xl p-3.5 transition-transform hover:-translate-y-0.5 hover:border-white/20 sm:w-52"
    >
      <div className="mb-2.5 flex items-center justify-between">
        {isLive ? (
          <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-epl-pink" />
        ) : (
          <span className="text-[10px] text-white/30">{formatMatchDate(match.utcDate)}</span>
        )}
      </div>
      <div className="flex items-center justify-between gap-1">
        <div className="flex flex-col items-center gap-1.5">
          <Image src={match.homeTeam.crest} alt="" width={26} height={26} unoptimized />
          <span className="max-w-14 truncate text-[10px] font-medium text-white/80">
            {match.homeTeam.shortName}
          </span>
        </div>
        <span className={`text-sm font-bold ${isLive ? "text-epl-cyan" : "text-white/70"}`}>
          {match.score.fullTime.home ?? "–"}:{match.score.fullTime.away ?? "–"}
        </span>
        <div className="flex flex-col items-center gap-1.5">
          <Image src={match.awayTeam.crest} alt="" width={26} height={26} unoptimized />
          <span className="max-w-14 truncate text-[10px] font-medium text-white/80">
            {match.awayTeam.shortName}
          </span>
        </div>
      </div>
    </Link>
  );
}
