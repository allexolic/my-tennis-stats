export const MatchStatus = {
  IN_PROGRESS: "IN_PROGRESS",
  FINISHED: "FINISHED",
  INTERRUPTED: "INTERRUPTED",
  CANCELLED: "CANCELLED",
} as const;

export type MatchStatus = (typeof MatchStatus)[keyof typeof MatchStatus];
