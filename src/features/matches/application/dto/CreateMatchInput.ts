import type { PlayerSide } from "../../domain/types";

export interface CreateMatchInput {
  opponentName: string;

  firstServer: PlayerSide;
}
