export const MatchRecordType = {
  REGULAR_GAME: "REGULAR_GAME",
  SET_TIE_BREAK: "SET_TIE_BREAK",
} as const;

export type MatchRecordType =
  (typeof MatchRecordType)[keyof typeof MatchRecordType];
