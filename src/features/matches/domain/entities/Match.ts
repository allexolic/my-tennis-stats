import type { MatchStatus } from "../types/MatchStatus";
import type { PlayerSide } from "../types/PlayerSide";
import type { MatchRecord } from "./MatchRecord";

export type Match = {
  id: string;
  opponentName: string;

  firstServer: PlayerSide;
  status: MatchStatus;

  startedAt: Date;
  finishedAt?: Date;

  records: MatchRecord[];
};
