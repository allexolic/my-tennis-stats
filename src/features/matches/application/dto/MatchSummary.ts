import type { Match } from "@/features/matches/domain/entities/Match";

import type { MatchStatistics } from "@/features/matches/domain/types/MatchStatistics";

import type { PlayerSide } from "@/features/matches/domain/types/PlayerSide";

export type MatchSummary = {
  match: Match;

  winner: PlayerSide;

  playerGames: number;
  opponentGames: number;

  durationInMinutes: number;

  statistics: MatchStatistics;

  tieBreak: {
    playerPoints: number;
    opponentPoints: number;
  } | null;
};
