import type { PlayerSide } from "@/features/matches/domain/types/PlayerSide";

export type MatchHistoryItem = {
  id: string;
  opponentName: string;

  startedAt: Date;
  finishedAt: Date;

  winner: PlayerSide;

  playerGames: number;
  opponentGames: number;

  durationInMinutes: number;

  tieBreak: {
    playerPoints: number;
    opponentPoints: number;
  } | null;
};
