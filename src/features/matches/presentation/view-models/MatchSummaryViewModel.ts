export type MatchSummaryViewModel = {
  opponentName: string;

  resultLabel: string;
  winnerLabel: string;
  durationLabel: string;

  service: {
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;

    holdPercentageLabel: string;

    validSecondServes: number;
    doubleFaults: number;
    pointsLost: number;

    averageValidSecondServesPerGameLabel: string;
    averageDoubleFaultsPerGameLabel: string;
    averagePointsLostPerGameLabel: string;
  };

  return: {
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;

    breaks: number;
    breakPercentageLabel: string;

    pointsWon: number;
    averagePointsWonPerGameLabel: string;
  };

  tieBreakLabel: string | null;
};
