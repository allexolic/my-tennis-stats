import {
  PlayerSide as PlayerSideValue,
  type PlayerSide,
} from "../types/PlayerSide";

export function oppositePlayer(player: PlayerSide): PlayerSide {
  return player === PlayerSideValue.PLAYER
    ? PlayerSideValue.OPPONENT
    : PlayerSideValue.PLAYER;
}
