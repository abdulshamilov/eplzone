import Link from "next/link";
import Image from "next/image";
import { getMatches, getStandings } from "@/lib/football-data";
import { FeaturedMatchCard, CompactMatchCard } from "@/components/match-card";

function ComingSoon({ title, note }: { title: string; note: string }) {
  return (
    <div className="glass-card flex h-full flex-col justify-between rounded-2xl p-4">
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-white/40">{note}</p>
      </div>
      <span className="mt-3 inline-block w-fit rounded-full bg-epl-violet/15 px-2.5 py-1 text-xs font-medium text-epl-violet">
        Скоро
      </span>
    </div>
  );
}

export default async function Home() {
  let top3: Awaited<ReturnType<typeof getStandings>>["standings"][number]["table"] = [];
  let topEvent: Awaited<ReturnType<typeof getMatches>>[number] | null = null;
  let upcomingRow: Awaited<ReturnType<typeof getMatches>> = [];

  try {
    const data = await getStandings();
    top3 = (data.standings.find((s) => s.type === "TOTAL")?.table ?? []).slice(0, 3);
  } catch {
    top3 = [];
  }

  try {
    const matches = await getMatches();
    const live = matches.filter((m) => m.status === "IN_PLAY" || m.status === "PAUSED");
    const upcoming = matches.filter((m) => m.status === "SCHEDULED" || m.status === "TIMED");
    topEvent = (live[0] ?? upcoming[0]) ?? null;
    upcomingRow = upcoming.filter((m) => m.id !== topEvent?.id).slice(0, 10);
  } catch {
    topEvent = null;
    upcomingRow = [];
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-9 px-3 py-5 sm:gap-12 sm:px-4 sm:py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/40">Добрый день</p>
          <h1 className="text-xl font-extrabold text-white sm:text-2xl">EPL Zone</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-gradient-to-br from-epl-magenta to-epl-purple px-4 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(233,0,82,0.3)]">
            25/26
          </span>
        </div>
      </div>

      {topEvent && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Топ-событие</h2>
            <Link href="/matches" className="text-sm font-medium text-epl-cyan hover:underline">
              Все матчи →
            </Link>
          </div>
          <FeaturedMatchCard match={topEvent} />
        </section>
      )}

      {upcomingRow.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold text-white">Ближайшие матчи</h2>
          <div className="-mx-3 flex gap-3 overflow-x-auto px-3 pb-1">
            {upcomingRow.map((m) => (
              <CompactMatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Топ-3 таблицы</h2>
          <Link href="/table" className="text-sm font-medium text-epl-cyan hover:underline">
            Вся таблица →
          </Link>
        </div>
        {top3.length > 0 ? (
          <div className="glass-card overflow-hidden rounded-2xl">
            {top3.map((row) => (
              <div
                key={row.team.id}
                className="glass-row flex items-center gap-3 px-4 py-3.5 last:border-0"
              >
                <span className="w-5 text-sm font-semibold text-white/40">{row.position}</span>
                <Image src={row.team.crest} alt="" width={26} height={26} unoptimized />
                <span className="flex-1 font-medium text-white">{row.team.shortName}</span>
                <span className="text-sm font-bold text-epl-cyan">{row.points} очк.</span>
              </div>
            ))}
          </div>
        ) : (
          <ComingSoon
            title="Таблица недоступна"
            note="Не удалось загрузить данные football-data.org."
          />
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <ComingSoon title="Топ-новость" note="Лента новостей клубов и трансферов появится здесь." />
        <ComingSoon title="Live-виджет" note="Счёт и события матчей в реальном времени." />
        <ComingSoon title="Хайлайты" note="Видео-обзоры матчей появятся после подключения бэкенда." />
      </section>
    </main>
  );
}
