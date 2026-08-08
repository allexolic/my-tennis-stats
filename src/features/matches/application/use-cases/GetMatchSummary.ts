import type { MatchSummary } from "../dto/MatchSummary";

import { GetMatchSummaryError } from "../errors/GetMatchSummaryError";

import type { MatchRepository } from "../ports/MatchRepository";

import { MatchEngine } from "@/features/matches/domain/services/MatchEngine";

import { StatisticsCalculator } from "@/features/matches/domain/services/StatisticsCalculator";

import { MatchRecordType } from "@/features/matches/domain/types/MatchRecordType";

export class GetMatchSummary {
  constructor(
    private readonly repository: MatchRepository,

    private readonly engine: MatchEngine,

    private readonly statisticsCalculator: StatisticsCalculator,
  ) {}

  async execute(matchId: string): Promise<MatchSummary> {
    const match = await this.repository.findById(matchId);

    if (!match) {
      throw new GetMatchSummaryError(
        "MATCH_NOT_FOUND",
        "A partida não foi encontrada.",
      );
    }

    const progress = this.engine.calculateProgress(match);

    if (!progress.isMatchFinished || !progress.winner || !match.finishedAt) {
      throw new GetMatchSummaryError(
        "MATCH_NOT_FINISHED",
        "A partida ainda não foi finalizada.",
      );
    }

    const statistics = this.statisticsCalculator.calculate(match);

    const tieBreakRecord = [...match.records]
      .reverse()
      .find((record) => record.type === MatchRecordType.SET_TIE_BREAK);

    const durationInMinutes = this.calculateDurationInMinutes(
      match.startedAt,
      match.finishedAt,
    );

    return {
      match,

      winner: progress.winner,

      playerGames: progress.score.playerGames,

      opponentGames: progress.score.opponentGames,

      durationInMinutes,

      statistics,

      tieBreak:
        tieBreakRecord?.type === MatchRecordType.SET_TIE_BREAK
          ? {
              playerPoints: tieBreakRecord.playerPoints,

              opponentPoints: tieBreakRecord.opponentPoints,
            }
          : null,
    };
  }

  private calculateDurationInMinutes(
    startedAt: Date,
    finishedAt: Date,
  ): number {
    const durationInMilliseconds = finishedAt.getTime() - startedAt.getTime();

    return Math.max(0, Math.round(durationInMilliseconds / 60_000));
  }
}
