import Image from "next/image";
import Link from "next/link";
import {
  formatMarketValue,
  getPlayerProfile,
  getPlayerTransfers,
  positionLabel,
} from "@/lib/sportapi";
import { formatDate } from "@/lib/format";

const FOOT_LABEL: Record<string, string> = {
  Left: "Левая",
  Right: "Правая",
  Both: "Обе",
};

function calcAge(timestamp: number | null): number | null {
  if (!timestamp) return null;
  const dob = new Date(timestamp * 1000);
  const diff = Date.now() - dob.getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const playerId = Number(id);

  let errorMessage: string | null = null;
  let profile: Awaited<ReturnType<typeof getPlayerProfile>> | null = null;
  let transfers: Awaited<ReturnType<typeof getPlayerTransfers>> = [];

  try {
    profile = await getPlayerProfile(playerId);
    transfers = await getPlayerTransfers(playerId).catch(() => []);
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Не удалось загрузить игрока.";
  }

  return (
    <main className="mx-auto max-w-3xl px-3 py-6 sm:px-4 sm:py-10">
      {errorMessage || !profile ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {errorMessage}
        </div>
      ) : (
        <>
          <div className="glass-card relative mb-8 flex items-center gap-4 overflow-hidden rounded-2xl p-5">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-epl-cyan/15 blur-3xl" />
            <Image
              src={`/api/player-image/${profile.id}`}
              alt=""
              width={72}
              height={72}
              unoptimized
              className="relative rounded-full bg-white/5 object-cover"
            />
            <div className="relative">
              <h1 className="text-xl font-bold text-white sm:text-2xl">{profile.name}</h1>
              <p className="text-sm text-white/40">
                {positionLabel(profile.position)}
                {profile.team?.name ? ` · ${profile.team.name}` : ""}
              </p>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div className="glass-card rounded-2xl p-3 text-center">
              <p className="text-xs text-white/40">Возраст</p>
              <p className="font-semibold text-white">{calcAge(profile.dateOfBirthTimestamp) ?? "—"}</p>
            </div>
            <div className="glass-card rounded-2xl p-3 text-center">
              <p className="text-xs text-white/40">Гражданство</p>
              <p className="font-semibold text-white">{profile.country?.name ?? "—"}</p>
            </div>
            <div className="glass-card rounded-2xl p-3 text-center">
              <p className="text-xs text-white/40">Рост / нога</p>
              <p className="font-semibold text-white">
                {profile.height ? `${profile.height} см` : "—"}
                {profile.preferredFoot ? ` · ${FOOT_LABEL[profile.preferredFoot] ?? profile.preferredFoot}` : ""}
              </p>
            </div>
            <div className="glass-card rounded-2xl p-3 text-center">
              <p className="text-xs text-white/40">Стоимость</p>
              <p className="font-semibold text-epl-cyan">{formatMarketValue(profile.proposedMarketValue)}</p>
            </div>
          </div>

          <h2 className="mb-3 text-base font-bold text-white sm:text-lg">Трансферная история</h2>
          {transfers.length > 0 ? (
            <div className="glass-card overflow-hidden rounded-2xl">
              {transfers.map((t) => (
                <div
                  key={t.id}
                  className="glass-row flex flex-wrap items-center gap-2 px-3 py-2.5 text-xs last:border-0 sm:text-sm"
                >
                  <span className="w-20 shrink-0 text-white/40">
                    {formatDate(new Date(t.transferDateTimestamp * 1000).toISOString())}
                  </span>
                  <span className="truncate font-medium text-white">{t.fromTeamName ?? "—"}</span>
                  <span className="text-white/30">→</span>
                  <span className="truncate font-medium text-white">{t.toTeamName ?? "—"}</span>
                  <span className="ml-auto shrink-0 font-semibold text-epl-cyan">
                    {t.transferFeeRaw ? formatMarketValue(t.transferFeeRaw) : (t.transferFeeDescription ?? "—")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/40">Данные о трансферах недоступны.</p>
          )}

          <Link href="/teams" className="mt-8 inline-block text-sm text-epl-cyan hover:underline">
            ← Все клубы
          </Link>
        </>
      )}
    </main>
  );
}
