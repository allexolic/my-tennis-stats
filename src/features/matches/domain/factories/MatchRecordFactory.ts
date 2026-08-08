import type {
  PlayerReturnGameRecord,
  PlayerServiceGameRecord,
  SetTieBreakRecord,
} from "../entities/MatchRecord";

import { MatchRecordType } from "../types/MatchRecordType";

import {
  PlayerSide,
  type PlayerSide as PlayerSideType,
} from "../types/PlayerSide";

type CreatePlayerServiceGameData = {
  id: string;
  sequence: number;

  winner: PlayerSideType;

  validSecondServes: number;
  doubleFaults: number;
  pointsLost: number;

  recordedAt: Date;
};

type CreatePlayerReturnGameData = {
  id: string;
  sequence: number;

  winner: PlayerSideType;

  pointsWon: number;

  recordedAt: Date;
};

type CreateSetTieBreakData = {
  id: string;
  sequence: number;

  winner: PlayerSideType;

  playerPoints: number;
  opponentPoints: number;

  recordedAt: Date;
};

export class MatchRecordFactory {
  static createPlayerServiceGame({
    id,
    sequence,
    winner,
    validSecondServes,
    doubleFaults,
    pointsLost,
    recordedAt,
  }: CreatePlayerServiceGameData): PlayerServiceGameRecord {
    return {
      id,
      type: MatchRecordType.REGULAR_GAME,

      sequence,
      setNumber: 1,

      server: PlayerSide.PLAYER,
      winner,

      playerServiceStats: {
        validSecondServes,
        doubleFaults,
        pointsLost,
      },

      recordedAt,
    };
  }

  static createPlayerReturnGame({
    id,
    sequence,
    winner,
    pointsWon,
    recordedAt,
  }: CreatePlayerReturnGameData): PlayerReturnGameRecord {
    return {
      id,
      type: MatchRecordType.REGULAR_GAME,

      sequence,
      setNumber: 1,

      server: PlayerSide.OPPONENT,
      winner,

      playerReturnStats: {
        pointsWon,
      },

      recordedAt,
    };
  }

  static createSetTieBreak({
    id,
    sequence,
    winner,
    playerPoints,
    opponentPoints,
    recordedAt,
  }: CreateSetTieBreakData): SetTieBreakRecord {
    return {
      id,
      type: MatchRecordType.SET_TIE_BREAK,
      sequence,
      setNumber: 1,
      winner,
      playerPoints,
      opponentPoints,
      recordedAt,
    };
  }
}
