import type { PlayerSide } from "@/features/matches/domain/types/PlayerSide";

export type RegisterPlayerServiceGameInput = {
  matchId: string;

  winner: PlayerSide;

  validSecondServes: number;
  doubleFaults: number;
  pointsLost: number;
};

export type RegisterPlayerReturnGameInput = {
  matchId: string;

  winner: PlayerSide;

  pointsWon: number;
};

export type RegisterGameInput =
  | RegisterPlayerServiceGameInput
  | RegisterPlayerReturnGameInput;
