import { MatchStatus } from "@/features/matches/domain/types/MatchStatus";

import { DeleteMatchError } from "../errors/DeleteMatchError";

import type { MatchRepository } from "../ports/MatchRepository";

export class DeleteMatch {
  constructor(private readonly repository: MatchRepository) {}

  async execute(matchId: string): Promise<void> {
    const match = await this.repository.findById(matchId);

    if (!match) {
      throw new DeleteMatchError(
        "MATCH_NOT_FOUND",
        "A partida não foi encontrada.",
      );
    }

    if (match.status !== MatchStatus.FINISHED) {
      throw new DeleteMatchError(
        "MATCH_NOT_FINISHED",
        "Apenas partidas finalizadas podem ser excluídas.",
      );
    }

    await this.repository.delete(matchId);
  }
}
