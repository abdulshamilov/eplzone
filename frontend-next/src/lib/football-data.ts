const BASE_URL = "https://api.football-data.org/v4";
const PREMIER_LEAGUE_ID = "PL";

export type StandingRow = {
  position: number;
  team: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form: string | null;
};

type StandingsResponse = {
  standings: Array<{
    type: "TOTAL" | "HOME" | "AWAY";
    table: StandingRow[];
  }>;
  season: {
    startDate: string;
    endDate: string;
    currentMatchday: number;
  };
};

function authHeaders() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    throw new Error(
      "FOOTBALL_DATA_API_KEY is not set. Add it to .env.local (get one at https://www.football-data.org/client/register)."
    );
  }
  return { "X-Auth-Token": apiKey };
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: authHeaders(),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`football-data.org request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getStandings(season?: number): Promise<StandingsResponse> {
  const query = season ? `?season=${season}` : "";
  return fetchJson<StandingsResponse>(
    `/competitions/${PREMIER_LEAGUE_ID}/standings${query}`
  );
}

export type Season = {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday: number | null;
};

type CompetitionResponse = {
  currentSeason: Season;
  seasons: Season[];
};

export async function getSeasons(): Promise<Season[]> {
  const data = await fetchJson<CompetitionResponse>(`/competitions/${PREMIER_LEAGUE_ID}`);
  return data.seasons.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}

export type MatchStatus =
  | "SCHEDULED"
  | "TIMED"
  | "IN_PLAY"
  | "PAUSED"
  | "FINISHED"
  | "POSTPONED"
  | "CANCELLED";

export type Match = {
  id: number;
  utcDate: string;
  status: MatchStatus;
  matchday: number;
  homeTeam: { id: number; name: string; shortName: string; crest: string };
  awayTeam: { id: number; name: string; shortName: string; crest: string };
  score: {
    fullTime: { home: number | null; away: number | null };
  };
};

type MatchesResponse = {
  matches: Match[];
};

export async function getMatches(season?: number): Promise<Match[]> {
  const query = season ? `?season=${season}` : "";
  const data = await fetchJson<MatchesResponse>(
    `/competitions/${PREMIER_LEAGUE_ID}/matches${query}`
  );
  return data.matches;
}

export type MatchDetail = Match & {
  venue: string | null;
  score: Match["score"] & {
    halfTime: { home: number | null; away: number | null };
    winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
  };
  referees: Array<{ id: number; name: string; nationality: string | null }>;
};

export async function getMatch(id: number): Promise<MatchDetail> {
  return fetchJson<MatchDetail>(`/matches/${id}`);
}

export type HeadToHead = {
  aggregates: {
    numberOfMatches: number;
    totalGoals: number;
    homeTeam: { id: number; name: string; wins: number; draws: number; losses: number };
    awayTeam: { id: number; name: string; wins: number; draws: number; losses: number };
  };
  matches: Match[];
};

export async function getHeadToHead(id: number): Promise<HeadToHead> {
  return fetchJson<HeadToHead>(`/matches/${id}/head2head?limit=10`);
}
