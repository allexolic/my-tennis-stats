import type { Match } from "@/features/matches/domain/entities/Match";

import { MatchRecordFactory } from "@/features/matches/domain/factories/MatchRecordFactory";

import { MatchEngine } from "@/features/matches/domain/services/MatchEngine";

import { MatchRecordValidator } from "@/features/matches/domain/services/MatchRecordValidator";

import { MatchStatus } from "@/features/matches/domain/types/MatchStatus";

import type { MatchProgress } from "@/features/matches/domain/types/MatchProgress";

import {
    PlayerSide,
    type PlayerSide as PlayerSideType,
} from "@/features/matches/domain/types/PlayerSide";

import type { RegisterTieBreakInput } from "../dto/RegisterTieBreakInput";

import { RegisterTieBreakError } from "../errors/RegisterTieBreakError";

import type { Clock } from "../ports/Clock";

import type { IdGenerator } from "../ports/IdGenerator";

import type { MatchRepository } from "../ports/MatchRepository";

export type RegisterTieBreakResult = {
  match: Match;
  progress: MatchProgress;
};

export class RegisterTieBreak {
  constructor(
    private readonly repository: MatchRepository,

    private readonly engine: MatchEngine,

    private readonly validator: MatchRecordValidator,

    private readonly idGenerator: IdGenerator,

    private readonly clock: Clock,
  ) {}

  async execute(input: RegisterTieBreakInput): Promise<RegisterTieBreakResult> {
    const match = await this.repository.findById(input.matchId);

    if (!match) {
      throw new RegisterTieBreakError(
        "MATCH_NOT_FOUND",
        "A partida não foi encontrada.",
      );
    }

    const progress = this.engine.calculateProgress(match);

    if (progress.isMatchFinished) {
      throw new RegisterTieBreakError(
        "MATCH_FINISHED",
        "A partida já foi finalizada.",
      );
    }

    if (progress.nextRecordType !== "SET_TIE_BREAK") {
      throw new RegisterTieBreakError(
        "TIE_BREAK_NOT_ALLOWED",
        "O tie-break só pode ser registrado em 6 × 6.",
      );
    }

    const winner = this.calculateWinner(
      input.playerPoints,
      input.opponentPoints,
    );

    const recordedAt = this.clock.now();

    const record = MatchRecordFactory.createSetTieBreak({
      id: this.idGenerator.generate(),

      sequence: match.records.length + 1,

      winner,

      playerPoints: input.playerPoints,

      opponentPoints: input.opponentPoints,

      recordedAt,
    });

    try {
      this.validator.validateNextRecord(match, record);
    } catch (error) {
      throw new RegisterTieBreakError(
        "INVALID_TIE_BREAK",
        error instanceof Error
          ? error.message
          : "O placar do tie-break é inválido.",
      );
    }

    const updatedMatch: Match = {
      ...match,
      records: [...match.records, record],
    };

    const updatedProgress = this.engine.calculateProgress(updatedMatch);

    if (!updatedProgress.isMatchFinished) {
      throw new RegisterTieBreakError(
        "INVALID_TIE_BREAK",
        "O tie-break informado não encerrou a partida.",
      );
    }

    updatedMatch.status = MatchStatus.FINISHED;

    updatedMatch.finishedAt = recordedAt;

    await this.repository.save(updatedMatch);

    return {
      match: updatedMatch,
      progress: updatedProgress,
    };
  }

  private calculateWinner(
    playerPoints: number,
    opponentPoints: number,
  ): PlayerSideType {
    return playerPoints > opponentPoints
      ? PlayerSide.PLAYER
      : PlayerSide.OPPONENT;
  }
}
