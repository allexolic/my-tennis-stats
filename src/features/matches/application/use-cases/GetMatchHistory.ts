import type { MatchHistoryItem } from "../dto/MatchHistoryItem";

import type { MatchRepository } from "../ports/MatchRepository";

import { MatchEngine } from "@/features/matches/domain/services/MatchEngine";

import { MatchRecordType } from "@/features/matches/domain/types/MatchRecordType";

export class GetMatchHistory {
  constructor(
    private readonly repository: MatchRepository,

    private readonly engine: MatchEngine,
  ) {}

  async execute(): Promise<MatchHistoryItem[]> {
    const matches = await this.repository.listFinished();

    return matches.map((match) => {
      const progress = this.engine.calculateProgress(match);

      if (!progress.winner || !match.finishedAt) {
        throw new Error(`Finished match ${match.id} has invalid state.`);
      }

      const tieBreakRecord = [...match.records]
        .reverse()
        .find((record) => record.type === MatchRecordType.SET_TIE_BREAK);

      return {
        id: match.id,
        opponentName: match.opponentName,

        startedAt: match.startedAt,

        finishedAt: match.finishedAt,

        winner: progress.winner,

        playerGames: progress.score.playerGames,

        opponentGames: progress.score.opponentGames,

        durationInMinutes: this.calculateDuration(
          match.startedAt,
          match.finishedAt,
        ),

        tieBreak:
          tieBreakRecord?.type === MatchRecordType.SET_TIE_BREAK
            ? {
                playerPoints: tieBreakRecord.playerPoints,

                opponentPoints: tieBreakRecord.opponentPoints,
              }
            : null,
      };
    });
  }

  private calculateDuration(startedAt: Date, finishedAt: Date): number {
    return Math.max(
      0,
      Math.round((finishedAt.getTime() - startedAt.getTime()) / 60_000),
    );
  }
}
