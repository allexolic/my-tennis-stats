export type RegisterGameErrorCode =
  | "MATCH_NOT_FOUND"
  | "MATCH_FINISHED"
  | "TIE_BREAK_REQUIRED"
  | "INVALID_GAME_DATA";

export class RegisterGameError extends Error {
  constructor(
    public readonly code: RegisterGameErrorCode,
    message: string,
  ) {
    super(message);

    this.name = "RegisterGameError";
  }
}
