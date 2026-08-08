import type { Match } from "@/features/matches/domain/entities/Match";

import { StatisticsCalculator } from "./StatisticsCalculator";

describe("StatisticsCalculator", () => {
  const calculator = new StatisticsCalculator();

  it("returns zero values for a match without games", () => {
    const match = createEmptyMatch();

    const statistics = calculator.calculate(match);

    expect(statistics.service).toEqual({
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      holdPercentage: 0,
      validSecondServes: 0,
      doubleFaults: 0,
      pointsLost: 0,
      averageValidSecondServesPerGame: 0,
      averageDoubleFaultsPerGame: 0,
      averagePointsLostPerGame: 0,
    });

    expect(statistics.return).toEqual({
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      breaks: 0,
      breakPercentage: 0,
      pointsWon: 0,
      averagePointsWonPerGame: 0,
    });
  });

  it("calculates service and return statistics", () => {
    const match: Match = {
      ...createEmptyMatch(),

      records: [
        {
          id: "game-1",
          type: "REGULAR_GAME",
          sequence: 1,
          setNumber: 1,
          server: "PLAYER",
          winner: "PLAYER",

          playerServiceStats: {
            validSecondServes: 2,
            doubleFaults: 1,
            pointsLost: 2,
          },

          recordedAt: new Date(),
        },
        {
          id: "game-2",
          type: "REGULAR_GAME",
          sequence: 2,
          setNumber: 1,
          server: "OPPONENT",
          winner: "OPPONENT",

          playerReturnStats: {
            pointsWon: 2,
          },

          recordedAt: new Date(),
        },
        {
          id: "game-3",
          type: "REGULAR_GAME",
          sequence: 3,
          setNumber: 1,
          server: "PLAYER",
          winner: "OPPONENT",

          playerServiceStats: {
            validSecondServes: 1,
            doubleFaults: 2,
            pointsLost: 4,
          },

          recordedAt: new Date(),
        },
        {
          id: "game-4",
          type: "REGULAR_GAME",
          sequence: 4,
          setNumber: 1,
          server: "OPPONENT",
          winner: "PLAYER",

          playerReturnStats: {
            pointsWon: 5,
          },

          recordedAt: new Date(),
        },
      ],
    };

    const statistics = calculator.calculate(match);

    expect(statistics.service).toEqual({
      gamesPlayed: 2,
      gamesWon: 1,
      gamesLost: 1,

      holdPercentage: 50,

      validSecondServes: 3,
      doubleFaults: 3,
      pointsLost: 6,

      averageValidSecondServesPerGame: 1.5,
      averageDoubleFaultsPerGame: 1.5,
      averagePointsLostPerGame: 3,
    });

    expect(statistics.return).toEqual({
      gamesPlayed: 2,
      gamesWon: 1,
      gamesLost: 1,

      breaks: 1,
      breakPercentage: 50,

      pointsWon: 7,
      averagePointsWonPerGame: 3.5,
    });
  });

  it("does not include a tie-break in service or return statistics", () => {
    const match: Match = {
      ...createEmptyMatch(),

      records: [
        {
          id: "tie-break-1",
          type: "SET_TIE_BREAK",
          sequence: 13,
          setNumber: 1,
          winner: "PLAYER",
          playerPoints: 7,
          opponentPoints: 5,
          recordedAt: new Date(),
        },
      ],
    };

    const statistics = calculator.calculate(match);

    expect(statistics.service.gamesPlayed).toBe(0);
    expect(statistics.return.gamesPlayed).toBe(0);
  });
});

function createEmptyMatch(): Match {
  return {
    id: "match-1",
    opponentName: "Adversário",
    firstServer: "PLAYER",
    status: "IN_PROGRESS",
    startedAt: new Date("2026-08-06T12:00:00.000Z"),
    records: [],
  };
}
