import type { Match } from "../entities/Match";
import { MatchStatus } from "../types/MatchStatus";
import type { PlayerSide } from "../types/PlayerSide";

export type CreateMatchData = {
  id: string;
  opponentName: string;
  firstServer: PlayerSide;
  startedAt: Date;
};

export class MatchFactory {
  static create({
    id,
    opponentName,
    firstServer,
    startedAt,
  }: CreateMatchData): Match {
    return {
      id,
      opponentName,
      firstServer,
      status: MatchStatus.IN_PROGRESS,
      startedAt,
      finishedAt: undefined,
      records: [],
    };
  }
}
