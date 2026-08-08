export type MatchViewModel = {
  id: string;
  opponentName: string;

  playerGames: number;
  opponentGames: number;

  nextServerLabel: string | null;
  nextActionLabel: string;

  winnerLabel: string | null;

  isTieBreak: boolean;
  isFinished: boolean;
};
