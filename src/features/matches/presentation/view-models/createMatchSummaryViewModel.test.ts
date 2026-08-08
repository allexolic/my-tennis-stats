import type { MatchSummary } from "@/features/matches/application/dto/MatchSummary";

import { PlayerSide } from "@/features/matches/domain/types/PlayerSide";

import { createMatchSummaryViewModel } from "./createMatchSummaryViewModel";

describe("createMatchSummaryViewModel", () => {
  it("maps the complete match summary", () => {
    const summary = createSummary();

    const viewModel = createMatchSummaryViewModel(summary);

    expect(viewModel).toEqual({
      opponentName: "Carlos",

      resultLabel: "6 × 3",

      winnerLabel: "Você venceu",

      durationLabel: "1h 12min",

      service: {
        gamesPlayed: 5,
        gamesWon: 4,
        gamesLost: 1,

        holdPercentageLabel: "80%",

        validSecondServes: 8,
        doubleFaults: 2,
        pointsLost: 10,

        averageValidSecondServesPerGameLabel: "1.6",

        averageDoubleFaultsPerGameLabel: "0.4",

        averagePointsLostPerGameLabel: "2.0",
      },

      return: {
        gamesPlayed: 4,
        gamesWon: 2,
        gamesLost: 2,

        breaks: 2,

        breakPercentageLabel: "50%",

        pointsWon: 13,

        averagePointsWonPerGameLabel: "3.3",
      },

      tieBreakLabel: null,
    });
  });

  it("uses the opponent name when the opponent wins", () => {
    const summary = createSummary();

    summary.winner = PlayerSide.OPPONENT;

    summary.playerGames = 3;
    summary.opponentGames = 6;

    const viewModel = createMatchSummaryViewModel(summary);

    expect(viewModel.resultLabel).toBe("3 × 6");

    expect(viewModel.winnerLabel).toBe("Carlos venceu");
  });

  it("formats a duration shorter than one hour", () => {
    const summary = createSummary();

    summary.durationInMinutes = 47;

    const viewModel = createMatchSummaryViewModel(summary);

    expect(viewModel.durationLabel).toBe("47 min");
  });

  it("formats an exact hour duration", () => {
    const summary = createSummary();

    summary.durationInMinutes = 60;

    const viewModel = createMatchSummaryViewModel(summary);

    expect(viewModel.durationLabel).toBe("1h");
  });

  it("formats a duration longer than one hour", () => {
    const summary = createSummary();

    summary.durationInMinutes = 72;

    const viewModel = createMatchSummaryViewModel(summary);

    expect(viewModel.durationLabel).toBe("1h 12min");
  });

  it("formats a duration longer than two hours", () => {
    const summary = createSummary();

    summary.durationInMinutes = 135;

    const viewModel = createMatchSummaryViewModel(summary);

    expect(viewModel.durationLabel).toBe("2h 15min");
  });

  it("rounds percentage values", () => {
    const summary = createSummary();

    summary.statistics.service.holdPercentage = 66.666;

    summary.statistics.return.breakPercentage = 33.333;

    const viewModel = createMatchSummaryViewModel(summary);

    expect(viewModel.service.holdPercentageLabel).toBe("67%");

    expect(viewModel.return.breakPercentageLabel).toBe("33%");
  });

  it("formats average values with one decimal place", () => {
    const summary = createSummary();

    summary.statistics.service.averageValidSecondServesPerGame = 1.666;

    summary.statistics.service.averageDoubleFaultsPerGame = 0.25;

    summary.statistics.service.averagePointsLostPerGame = 2;

    summary.statistics.return.averagePointsWonPerGame = 3.456;

    const viewModel = createMatchSummaryViewModel(summary);

    expect(viewModel.service.averageValidSecondServesPerGameLabel).toBe("1.7");

    expect(viewModel.service.averageDoubleFaultsPerGameLabel).toBe("0.3");

    expect(viewModel.service.averagePointsLostPerGameLabel).toBe("2.0");

    expect(viewModel.return.averagePointsWonPerGameLabel).toBe("3.5");
  });

  it("includes the tie-break score", () => {
    const summary = createSummary();

    summary.playerGames = 7;
    summary.opponentGames = 6;

    summary.tieBreak = {
      playerPoints: 8,
      opponentPoints: 6,
    };

    const viewModel = createMatchSummaryViewModel(summary);

    expect(viewModel.resultLabel).toBe("7 × 6");

    expect(viewModel.tieBreakLabel).toBe("8 × 6");
  });

  it("returns null when the match has no tie-break", () => {
    const summary = createSummary();

    summary.tieBreak = null;

    const viewModel = createMatchSummaryViewModel(summary);

    expect(viewModel.tieBreakLabel).toBeNull();
  });

  it("handles zero service statistics", () => {
    const summary = createSummary();

    summary.statistics.service = {
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
    };

    const viewModel = createMatchSummaryViewModel(summary);

    expect(viewModel.service.gamesPlayed).toBe(0);

    expect(viewModel.service.holdPercentageLabel).toBe("0%");

    expect(viewModel.service.averageValidSecondServesPerGameLabel).toBe("0.0");

    expect(viewModel.service.averageDoubleFaultsPerGameLabel).toBe("0.0");

    expect(viewModel.service.averagePointsLostPerGameLabel).toBe("0.0");
  });

  it("handles zero return statistics", () => {
    const summary = createSummary();

    summary.statistics.return = {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,

      breaks: 0,
      breakPercentage: 0,

      pointsWon: 0,

      averagePointsWonPerGame: 0,
    };

    const viewModel = createMatchSummaryViewModel(summary);

    expect(viewModel.return.gamesPlayed).toBe(0);

    expect(viewModel.return.breaks).toBe(0);

    expect(viewModel.return.breakPercentageLabel).toBe("0%");

    expect(viewModel.return.averagePointsWonPerGameLabel).toBe("0.0");
  });
});

function createSummary(): MatchSummary {
  const startedAt = new Date("2026-08-07T15:00:00.000Z");

  const finishedAt = new Date("2026-08-07T16:12:00.000Z");

  return {
    match: {
      id: "match-1",

      opponentName: "Carlos",

      firstServer: PlayerSide.PLAYER,

      status: "FINISHED",

      startedAt,
      finishedAt,

      records: [],
    },

    winner: PlayerSide.PLAYER,

    playerGames: 6,
    opponentGames: 3,

    durationInMinutes: 72,

    statistics: {
      service: {
        gamesPlayed: 5,
        gamesWon: 4,
        gamesLost: 1,

        holdPercentage: 80,

        validSecondServes: 8,
        doubleFaults: 2,
        pointsLost: 10,

        averageValidSecondServesPerGame: 1.6,

        averageDoubleFaultsPerGame: 0.4,

        averagePointsLostPerGame: 2,
      },

      return: {
        gamesPlayed: 4,
        gamesWon: 2,
        gamesLost: 2,

        breaks: 2,

        breakPercentage: 50,

        pointsWon: 13,

        averagePointsWonPerGame: 3.25,
      },
    },

    tieBreak: null,
  };
}
