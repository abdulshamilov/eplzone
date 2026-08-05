const BASE_URL = "https://sportapi7.p.rapidapi.com/api/v1";

function authHeaders() {
  const apiKey = process.env.SPORTAPI_KEY;
  if (!apiKey) {
    throw new Error(
      "SPORTAPI_KEY is not set. Add it to .env.local (RapidAPI key subscribed to SportAPI)."
    );
  }
  return {
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": "sportapi7.p.rapidapi.com",
  };
}

async function saFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: authHeaders(),
    next: { revalidate: 86400 },
  });
  if (!res.ok) {
    throw new Error(`SportAPI request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export type SaTeamSearchResult = {
  id: number;
  name: string;
  slug: string;
};

export async function searchTeam(name: string): Promise<SaTeamSearchResult[]> {
  const data = await saFetch<{ results: Array<{ type: string; entity: SaTeamSearchResult }> }>(
    `/search/all?q=${encodeURIComponent(name)}`
  );
  return data.results.filter((r) => r.type === "team").map((r) => r.entity);
}

export type SaSquadPlayer = {
  id: number;
  name: string;
  position: string;
  jerseyNumber: string | null;
  dateOfBirthTimestamp: number | null;
  proposedMarketValue: { value: number; currency: string } | null;
};

export async function getTeamSquad(teamId: number): Promise<SaSquadPlayer[]> {
  const data = await saFetch<{ players: Array<{ player: SaSquadPlayer }> }>(
    `/team/${teamId}/players`
  );
  return data.players.map((p) => p.player);
}

export type SaPlayerProfile = {
  id: number;
  name: string;
  position: string;
  height: number | null;
  preferredFoot: string | null;
  dateOfBirthTimestamp: number | null;
  country: { name: string } | null;
  team: { name: string } | null;
  proposedMarketValue: { value: number; currency: string } | null;
};

export async function getPlayerProfile(playerId: number): Promise<SaPlayerProfile> {
  const data = await saFetch<{ player: SaPlayerProfile }>(`/player/${playerId}`);
  return data.player;
}

export type SaTransfer = {
  id: number;
  fromTeamName: string | null;
  toTeamName: string | null;
  transferDateTimestamp: number;
  transferFeeRaw: { value: number; currency: string } | null;
  transferFeeDescription: string | null;
};

export async function getPlayerTransfers(playerId: number): Promise<SaTransfer[]> {
  const data = await saFetch<{ transferHistory: SaTransfer[] }>(
    `/player/${playerId}/transfer-history`
  );
  return data.transferHistory;
}

const POSITION_LABEL: Record<string, string> = {
  G: "Вратарь",
  D: "Защитник",
  M: "Полузащитник",
  F: "Нападающий",
};

export function positionLabel(position: string): string {
  return POSITION_LABEL[position] ?? position;
}

export function formatMarketValue(mv: { value: number; currency: string } | null): string {
  if (!mv || !mv.value) return "—";
  const symbol = mv.currency === "EUR" ? "€" : mv.currency;
  if (mv.value >= 1_000_000) return `${symbol}${(mv.value / 1_000_000).toFixed(1)}M`;
  if (mv.value >= 1_000) return `${symbol}${(mv.value / 1_000).toFixed(0)}K`;
  return `${symbol}${mv.value}`;
}
