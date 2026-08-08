export type RegisterTieBreakErrorCode =
  | "MATCH_NOT_FOUND"
  | "MATCH_FINISHED"
  | "TIE_BREAK_NOT_ALLOWED"
  | "INVALID_TIE_BREAK";

export class RegisterTieBreakError extends Error {
  constructor(
    public readonly code: RegisterTieBreakErrorCode,
    message: string,
  ) {
    super(message);

    this.name = "RegisterTieBreakError";
  }
}
