export const PlayerSide = {
  PLAYER: "PLAYER",
  OPPONENT: "OPPONENT",
} as const;

export type PlayerSide = (typeof PlayerSide)[keyof typeof PlayerSide];
