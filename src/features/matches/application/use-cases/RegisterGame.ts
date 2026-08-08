import type { Match } from "@/features/matches/domain/entities/Match";

import { MatchRecordFactory } from "@/features/matches/domain/factories/MatchRecordFactory";

import { MatchEngine } from "@/features/matches/domain/services/MatchEngine";

import { MatchRecordValidator } from "@/features/matches/domain/services/MatchRecordValidator";

import { MatchStatus } from "@/features/matches/domain/types/MatchStatus";

import type { MatchProgress } from "@/features/matches/domain/types/MatchProgress";

import { PlayerSide } from "@/features/matches/domain/types/PlayerSide";

import type { RegisterGameInput } from "../dto/RegisterGameInput";

import { RegisterGameError } from "../errors/RegisterGameError";

import type { Clock } from "../ports/Clock";

import type { IdGenerator } from "../ports/IdGenerator";

import { MatchRecordType } from "../../domain/types/MatchRecordType";
import type { MatchRepository } from "../ports/MatchRepository";

export type RegisterGameResult = {
  match: Match;
  progress: MatchProgress;
};

export class RegisterGame {
  constructor(
    private readonly repository: MatchRepository,

    private readonly engine: MatchEngine,

    private readonly validator: MatchRecordValidator,

    private readonly idGenerator: IdGenerator,

    private readonly clock: Clock,
  ) {}

  async execute(input: RegisterGameInput): Promise<RegisterGameResult> {
    const match = await this.repository.findById(input.matchId);

    if (!match) {
      throw new RegisterGameError(
        "MATCH_NOT_FOUND",
        "A partida não foi encontrada.",
      );
    }

    const progress = this.engine.calculateProgress(match);

    if (progress.isMatchFinished) {
      throw new RegisterGameError(
        "MATCH_FINISHED",
        "A partida já foi finalizada.",
      );
    }

    if (progress.nextRecordType === MatchRecordType.SET_TIE_BREAK) {
      throw new RegisterGameError(
        "TIE_BREAK_REQUIRED",
        "O próximo registro deve ser o tie-break.",
      );
    }

    const sequence = match.records.length + 1;

    const recordedAt = this.clock.now();

    const record =
      progress.nextServer === PlayerSide.PLAYER
        ? this.createServiceGame(input, sequence, recordedAt)
        : this.createReturnGame(input, sequence, recordedAt);

    try {
      this.validator.validateNextRecord(match, record);
    } catch (error) {
      throw new RegisterGameError(
        "INVALID_GAME_DATA",
        error instanceof Error
          ? error.message
          : "Os dados do game são inválidos.",
      );
    }

    const updatedMatch: Match = {
      ...match,
      records: [...match.records, record],
    };

    const updatedProgress = this.engine.calculateProgress(updatedMatch);

    if (updatedProgress.isMatchFinished) {
      updatedMatch.status = MatchStatus.FINISHED;

      updatedMatch.finishedAt = recordedAt;
    }

    await this.repository.save(updatedMatch);

    return {
      match: updatedMatch,
      progress: updatedProgress,
    };
  }

  private createServiceGame(
    input: RegisterGameInput,
    sequence: number,
    recordedAt: Date,
  ) {
    if (
      !("validSecondServes" in input) ||
      !("doubleFaults" in input) ||
      !("pointsLost" in input)
    ) {
      throw new RegisterGameError(
        "INVALID_GAME_DATA",
        "Informe as estatísticas do seu game de serviço.",
      );
    }

    return MatchRecordFactory.createPlayerServiceGame({
      id: this.idGenerator.generate(),
      sequence,
      winner: input.winner,

      validSecondServes: input.validSecondServes,

      doubleFaults: input.doubleFaults,

      pointsLost: input.pointsLost,

      recordedAt,
    });
  }

  private createReturnGame(
    input: RegisterGameInput,
    sequence: number,
    recordedAt: Date,
  ) {
    if (!("pointsWon" in input)) {
      throw new RegisterGameError(
        "INVALID_GAME_DATA",
        "Informe quantos pontos você ganhou no game.",
      );
    }

    return MatchRecordFactory.createPlayerReturnGame({
      id: this.idGenerator.generate(),
      sequence,
      winner: input.winner,
      pointsWon: input.pointsWon,
      recordedAt,
    });
  }
}
