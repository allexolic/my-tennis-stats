import type { MatchSummary } from "@/features/matches/application/dto/MatchSummary";

import { PlayerSide } from "@/features/matches/domain/types/PlayerSide";

import type { MatchSummaryViewModel } from "./MatchSummaryViewModel";

export function createMatchSummaryViewModel(
  summary: MatchSummary,
): MatchSummaryViewModel {
  return {
    opponentName: summary.match.opponentName,

    resultLabel: `${summary.playerGames} × ${summary.opponentGames}`,

    winnerLabel:
      summary.winner === PlayerSide.PLAYER
        ? "Você venceu"
        : `${summary.match.opponentName} venceu`,

    durationLabel: formatDuration(summary.durationInMinutes),

    service: {
      gamesPlayed: summary.statistics.service.gamesPlayed,

      gamesWon: summary.statistics.service.gamesWon,

      gamesLost: summary.statistics.service.gamesLost,

      holdPercentageLabel: formatPercentage(
        summary.statistics.service.holdPercentage,
      ),

      validSecondServes: summary.statistics.service.validSecondServes,

      doubleFaults: summary.statistics.service.doubleFaults,

      pointsLost: summary.statistics.service.pointsLost,

      averageValidSecondServesPerGameLabel: formatDecimal(
        summary.statistics.service.averageValidSecondServesPerGame,
      ),

      averageDoubleFaultsPerGameLabel: formatDecimal(
        summary.statistics.service.averageDoubleFaultsPerGame,
      ),

      averagePointsLostPerGameLabel: formatDecimal(
        summary.statistics.service.averagePointsLostPerGame,
      ),
    },

    return: {
      gamesPlayed: summary.statistics.return.gamesPlayed,

      gamesWon: summary.statistics.return.gamesWon,

      gamesLost: summary.statistics.return.gamesLost,

      breaks: summary.statistics.return.breaks,

      breakPercentageLabel: formatPercentage(
        summary.statistics.return.breakPercentage,
      ),

      pointsWon: summary.statistics.return.pointsWon,

      averagePointsWonPerGameLabel: formatDecimal(
        summary.statistics.return.averagePointsWonPerGame,
      ),
    },

    tieBreakLabel: summary.tieBreak
      ? `${summary.tieBreak.playerPoints} × ${summary.tieBreak.opponentPoints}`
      : null,
  };
}

function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

function formatDecimal(value: number): string {
  return value.toFixed(1);
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);

  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
}
