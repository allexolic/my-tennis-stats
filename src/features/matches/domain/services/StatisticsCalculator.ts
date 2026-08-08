import type { Match } from "../entities/Match";
import type {
    PlayerReturnGameRecord,
    PlayerServiceGameRecord,
} from "../entities/MatchRecord";
import type {
    MatchStatistics,
    ReturnStatistics,
    ServiceStatistics,
} from "../types/MatchStatistics";

export class StatisticsCalculator {
  calculate(match: Match): MatchStatistics {
    const serviceGames = match.records.filter(
      (record): record is PlayerServiceGameRecord =>
        record.type === "REGULAR_GAME" && record.server === "PLAYER",
    );

    const returnGames = match.records.filter(
      (record): record is PlayerReturnGameRecord =>
        record.type === "REGULAR_GAME" && record.server === "OPPONENT",
    );

    return {
      service: this.calculateServiceStatistics(serviceGames),

      return: this.calculateReturnStatistics(returnGames),
    };
  }

  private calculateServiceStatistics(
    games: PlayerServiceGameRecord[],
  ): ServiceStatistics {
    const gamesPlayed = games.length;

    const gamesWon = games.filter((game) => game.winner === "PLAYER").length;

    const validSecondServes = games.reduce(
      (total, game) => total + game.playerServiceStats.validSecondServes,
      0,
    );

    const doubleFaults = games.reduce(
      (total, game) => total + game.playerServiceStats.doubleFaults,
      0,
    );

    const pointsLost = games.reduce(
      (total, game) => total + game.playerServiceStats.pointsLost,
      0,
    );

    return {
      gamesPlayed,
      gamesWon,
      gamesLost: gamesPlayed - gamesWon,

      holdPercentage: this.percentage(gamesWon, gamesPlayed),

      validSecondServes,
      doubleFaults,
      pointsLost,

      averageValidSecondServesPerGame: this.average(
        validSecondServes,
        gamesPlayed,
      ),

      averageDoubleFaultsPerGame: this.average(doubleFaults, gamesPlayed),

      averagePointsLostPerGame: this.average(pointsLost, gamesPlayed),
    };
  }

  private calculateReturnStatistics(
    games: PlayerReturnGameRecord[],
  ): ReturnStatistics {
    const gamesPlayed = games.length;

    const gamesWon = games.filter((game) => game.winner === "PLAYER").length;

    const pointsWon = games.reduce(
      (total, game) => total + game.playerReturnStats.pointsWon,
      0,
    );

    return {
      gamesPlayed,
      gamesWon,
      gamesLost: gamesPlayed - gamesWon,

      breaks: gamesWon,

      breakPercentage: this.percentage(gamesWon, gamesPlayed),

      pointsWon,

      averagePointsWonPerGame: this.average(pointsWon, gamesPlayed),
    };
  }

  private percentage(value: number, total: number): number {
    if (total === 0) {
      return 0;
    }

    return (value / total) * 100;
  }

  private average(value: number, quantity: number): number {
    if (quantity === 0) {
      return 0;
    }

    return value / quantity;
  }
}
