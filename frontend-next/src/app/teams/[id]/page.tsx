import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStandings } from "@/lib/football-data";
import { getTeamSquad, searchTeam, formatMarketValue, positionLabel } from "@/lib/sportapi";
import teamTrophies from "@/data/team-trophies.json";

type TrophiesMap = Record<string, { name: string; trophies: Array<{ title: string; count: number }> }>;
const trophies: TrophiesMap = teamTrophies;

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let team: Awaited<ReturnType<typeof getStandings>>["standings"][number]["table"][number]["team"] | null = null;
  try {
    const data = await getStandings();
    team =
      (data.standings.find((s) => s.type === "TOTAL")?.table ?? []).find(
        (row) => String(row.team.id) === id
      )?.team ?? null;
  } catch {
    team = null;
  }

  if (!team) notFound();

  const clubTrophies = trophies[id]?.trophies ?? [];

  let squad: Awaited<ReturnType<typeof getTeamSquad>> = [];
  let squadError: string | null = null;
  try {
    const results = await searchTeam(team.shortName);
    const saTeamId = results[0]?.id;
    if (saTeamId) {
      squad = await getTeamSquad(saTeamId);
    } else {
      squadError = "Клуб не найден.";
    }
  } catch (err) {
    squadError = err instanceof Error ? err.message : "Не удалось загрузить состав.";
  }

  return (
    <main className="mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-10">
      <Link href="/teams" className="mb-4 inline-block text-sm text-epl-cyan hover:underline">
        ← Все клубы
      </Link>

      <div className="glass-card relative mb-8 flex items-center gap-4 overflow-hidden rounded-2xl p-5">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-epl-magenta/15 blur-3xl" />
        <Image src={team.crest} alt="" width={56} height={56} unoptimized className="relative" />
        <h1 className="relative text-xl font-bold text-white sm:text-2xl">{team.name}</h1>
      </div>

      <h2 className="mb-3 text-base font-bold text-white sm:text-lg">Трофеи</h2>
      {clubTrophies.length > 0 ? (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {clubTrophies.map((t) => (
            <div key={t.title} className="glass-card rounded-2xl p-3 text-center">
              <p className="text-xl font-extrabold text-epl-cyan">{t.count}</p>
              <p className="mt-1 text-xs text-white/40">{t.title}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-8 text-sm text-white/40">Клуб пока не выигрывал крупных трофеев.</p>
      )}

      <h2 className="mb-3 text-base font-bold text-white sm:text-lg">Состав</h2>
      {squadError ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {squadError}
        </div>
      ) : (
        <div className="glass-card overflow-hidden rounded-2xl">
          {squad.map((player) => (
            <Link
              key={player.id}
              href={`/players/${player.id}`}
              className="glass-row flex items-center gap-3 px-3 py-2.5 text-sm transition-colors last:border-0 hover:bg-white/[0.03] sm:px-4"
            >
              <Image
                src={`/api/player-image/${player.id}`}
                alt=""
                width={32}
                height={32}
                unoptimized
                className="shrink-0 rounded-full bg-white/5 object-cover"
              />
              <span className="flex-1 truncate font-medium text-white">{player.name}</span>
              <span className="w-28 shrink-0 truncate text-xs text-white/40">
                {positionLabel(player.position)}
              </span>
              <span className="w-16 shrink-0 text-right text-xs font-semibold text-epl-cyan">
                {formatMarketValue(player.proposedMarketValue)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
