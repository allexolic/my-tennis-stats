import type { Match } from "@/features/matches/domain/entities/Match";
import { MatchEngine } from "@/features/matches/domain/services/MatchEngine";
import type { MatchProgress } from "@/features/matches/domain/types/MatchProgress";

import type { MatchRepository } from "../ports/MatchRepository";

export type GetMatchByIdResult = {
  match: Match;
  progress: MatchProgress;
};

export class GetMatchById {
  constructor(
    private readonly repository: MatchRepository,
    private readonly engine: MatchEngine,
  ) {}

  async execute(matchId: string): Promise<GetMatchByIdResult | null> {
    const match = await this.repository.findById(matchId);

    if (!match) {
      return null;
    }

    const progress = this.engine.calculateProgress(match);

    return {
      match,
      progress,
    };
  }
}
