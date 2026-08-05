import Image from "next/image";
import Link from "next/link";
import { getStandings } from "@/lib/football-data";

export const metadata = { title: "Клубы — EPL Zone" };

export default async function TeamsPage() {
  let teams: Awaited<ReturnType<typeof getStandings>>["standings"][number]["table"][number]["team"][] = [];
  let errorMessage: string | null = null;

  try {
    const data = await getStandings();
    teams = (data.standings.find((s) => s.type === "TOTAL")?.table ?? []).map((row) => row.team);
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Не удалось загрузить список клубов.";
  }

  return (
    <main className="mx-auto max-w-5xl px-3 py-6 sm:px-4 sm:py-10">
      <h1 className="mb-5 text-xl font-bold text-white sm:mb-6 sm:text-2xl">Клубы АПЛ</h1>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {errorMessage}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
          {teams.map((team) => (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className="glass-card flex flex-col items-center gap-3 rounded-2xl p-4 text-center transition-all hover:-translate-y-0.5 hover:border-epl-magenta/40"
            >
              <Image src={team.crest} alt="" width={48} height={48} unoptimized />
              <span className="text-sm font-medium text-white">{team.shortName}</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
