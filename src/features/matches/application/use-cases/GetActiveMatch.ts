import type { Match } from "@/features/matches/domain/entities/Match";

import type { MatchRepository } from "../ports/MatchRepository";

export class GetActiveMatch {
  constructor(private readonly repository: MatchRepository) {}

  async execute(): Promise<Match | null> {
    return this.repository.findActive();
  }
}
