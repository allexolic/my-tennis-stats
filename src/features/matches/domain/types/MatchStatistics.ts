export type ServiceStatistics = {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;

  holdPercentage: number;

  validSecondServes: number;
  doubleFaults: number;
  pointsLost: number;

  averageValidSecondServesPerGame: number;
  averageDoubleFaultsPerGame: number;
  averagePointsLostPerGame: number;
};

export type ReturnStatistics = {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;

  breaks: number;
  breakPercentage: number;

  pointsWon: number;
  averagePointsWonPerGame: number;
};

export type MatchStatistics = {
  service: ServiceStatistics;
  return: ReturnStatistics;
};
