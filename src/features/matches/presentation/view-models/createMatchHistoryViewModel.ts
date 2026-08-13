import type { MatchHistoryItem } from "@/features/matches/application/dto/MatchHistoryItem";

import { PlayerSide } from "@/features/matches/domain/types/PlayerSide";

import type {
    MatchHistoryItemViewModel,
    MatchHistoryViewModel,
} from "./MatchHistoryViewModel";

export function createMatchHistoryViewModel(
  history: MatchHistoryItem[],
): MatchHistoryViewModel {
  const items = history.map(createMatchHistoryItemViewModel);

  return {
    items,
    isEmpty: items.length === 0,
  };
}

function createMatchHistoryItemViewModel(
  item: MatchHistoryItem,
): MatchHistoryItemViewModel {
  const didPlayerWin = item.winner === PlayerSide.PLAYER;

  return {
    id: item.id,

    opponentName: item.opponentName,

    resultLabel: `${item.playerGames} × ${item.opponentGames}`,

    resultStatusLabel: didPlayerWin ? "Vitória" : "Derrota",

    dateLabel: formatDate(item.startedAt),

    durationLabel: formatDuration(item.durationInMinutes),

    tieBreakLabel: item.tieBreak
      ? `${item.tieBreak.playerPoints} × ${item.tieBreak.opponentPoints}`
      : null,

    didPlayerWin,
  };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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
