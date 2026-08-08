import { MatchRecordType } from "../types/MatchRecordType";
import type { PlayerSide } from "../types/PlayerSide";

export type BaseMatchRecord = {
  id: string;
  sequence: number;
  setNumber: number;
  recordedAt: Date;
  updatedAt?: Date;
};

export type PlayerServiceGameStats = {
  validSecondServes: number;
  doubleFaults: number;
  pointsLost: number;
};

export type PlayerReturnGameStats = {
  pointsWon: number;
};

export type PlayerServiceGameRecord = BaseMatchRecord & {
  type: typeof MatchRecordType.REGULAR_GAME;
  server: typeof PlayerSide.PLAYER;
  winner: PlayerSide;
  playerServiceStats: PlayerServiceGameStats;
};

export type PlayerReturnGameRecord = BaseMatchRecord & {
  type: typeof MatchRecordType.REGULAR_GAME;
  server: typeof PlayerSide.OPPONENT;
  winner: PlayerSide;
  playerReturnStats: PlayerReturnGameStats;
};

export type RegularGameRecord =
  | PlayerServiceGameRecord
  | PlayerReturnGameRecord;

export type SetTieBreakRecord = BaseMatchRecord & {
  type: typeof MatchRecordType.SET_TIE_BREAK;
  winner: PlayerSide;
  playerPoints: number;
  opponentPoints: number;
};

export type MatchRecord = RegularGameRecord | SetTieBreakRecord;
