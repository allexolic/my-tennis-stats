import { MatchDomainError } from "../errors/MatchDomainError";
import type { PlayerSide } from "../types/PlayerSide";

type ValidateSetTieBreakInput = {
  playerPoints: number;
  opponentPoints: number;
  winner: PlayerSide;
};

export function validateSetTieBreak({
  playerPoints,
  opponentPoints,
  winner,
}: ValidateSetTieBreakInput): void {
  if (!Number.isInteger(playerPoints) || !Number.isInteger(opponentPoints)) {
    throw new MatchDomainError("A pontuação do tie-break deve ser inteira.");
  }

  if (playerPoints < 0 || opponentPoints < 0) {
    throw new MatchDomainError(
      "A pontuação do tie-break não pode ser negativa.",
    );
  }

  const highestScore = Math.max(playerPoints, opponentPoints);

  const scoreDifference = Math.abs(playerPoints - opponentPoints);

  if (highestScore < 7) {
    throw new MatchDomainError(
      "O vencedor do tie-break deve ter pelo menos 7 pontos.",
    );
  }

  if (scoreDifference < 2) {
    throw new MatchDomainError(
      "O tie-break deve terminar com diferença mínima de 2 pontos.",
    );
  }

  const calculatedWinner: PlayerSide =
    playerPoints > opponentPoints ? "PLAYER" : "OPPONENT";

  if (winner !== calculatedWinner) {
    throw new MatchDomainError(
      "O vencedor informado não corresponde ao placar do tie-break.",
    );
  }
}
