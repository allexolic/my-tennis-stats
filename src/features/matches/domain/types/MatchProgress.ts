import type { PlayerSide } from "./PlayerSide";

export type NextRecordType =
  | "PLAYER_SERVICE_GAME"
  | "PLAYER_RETURN_GAME"
  | "SET_TIE_BREAK"
  | "MATCH_FINISHED";

export type CurrentSetScore = {
  playerGames: number;
  opponentGames: number;

  tieBreak?: {
    playerPoints: number;
    opponentPoints: number;
  };

  winner?: PlayerSide;
};

export type MatchProgress = {
  score: CurrentSetScore;

  winner?: PlayerSide;
  nextServer?: PlayerSide;
  nextRecordType: NextRecordType;

  isMatchFinished: boolean;
};
