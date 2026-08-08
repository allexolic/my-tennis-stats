import type { Match } from "@/features/matches/domain/entities/Match";
import type { MatchProgress } from "@/features/matches/domain/types/MatchProgress";

import type { MatchViewModel } from "./MatchViewModel";

export function createMatchViewModel(
  match: Match,
  progress: MatchProgress,
): MatchViewModel {
  return {
    id: match.id,
    opponentName: match.opponentName,

    playerGames: progress.score.playerGames,

    opponentGames: progress.score.opponentGames,

    nextServerLabel: getNextServerLabel(progress),

    nextActionLabel: getNextActionLabel(progress),

    winnerLabel: getWinnerLabel(match, progress),

    isTieBreak: progress.nextRecordType === "SET_TIE_BREAK",

    isFinished: progress.isMatchFinished,
  };
}

function getNextServerLabel(progress: MatchProgress): string | null {
  if (progress.isMatchFinished || progress.nextRecordType === "SET_TIE_BREAK") {
    return null;
  }

  return progress.nextServer === "PLAYER" ? "Você" : "Adversário";
}

function getNextActionLabel(progress: MatchProgress): string {
  if (progress.isMatchFinished) {
    return "Ver resumo";
  }

  if (progress.nextRecordType === "SET_TIE_BREAK") {
    return "Registrar tie-break";
  }

  return "Registrar game";
}

function getWinnerLabel(match: Match, progress: MatchProgress): string | null {
  if (!progress.winner) {
    return null;
  }

  return progress.winner === "PLAYER" ? "Você" : match.opponentName;
}
