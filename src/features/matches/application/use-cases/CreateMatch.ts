import type { Match } from "@/features/matches/domain/entities/Match";
import { MatchFactory } from "@/features/matches/domain/factories/MatchFactory";

import type { CreateMatchInput } from "../dto/CreateMatchInput";
import { CreateMatchError } from "../errors/CreateMatchError";
import type { Clock } from "../ports/Clock";
import type { IdGenerator } from "../ports/IdGenerator";
import type { MatchRepository } from "../ports/MatchRepository";

export class CreateMatch {
  constructor(
    private readonly repository: MatchRepository,
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock,
  ) {}

  async execute(input: CreateMatchInput): Promise<Match> {
    const opponentName = this.normalizeOpponentName(input.opponentName);

    if (!opponentName) {
      throw new CreateMatchError(
        "OPPONENT_NAME_REQUIRED",
        "Informe o nome do adversário.",
      );
    }

    const activeMatch = await this.repository.findActive();

    if (activeMatch) {
      throw new CreateMatchError(
        "ACTIVE_MATCH_ALREADY_EXISTS",
        "Já existe uma partida em andamento.",
      );
    }

    const match = MatchFactory.create({
      id: this.idGenerator.generate(),
      opponentName,
      firstServer: input.firstServer,
      startedAt: this.clock.now(),
    });

    await this.repository.create(match);

    return match;
  }

  private normalizeOpponentName(opponentName: string): string {
    return opponentName.trim().replace(/\s+/g, " ");
  }
}
