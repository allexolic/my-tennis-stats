export type CreateMatchErrorCode =
  | "OPPONENT_NAME_REQUIRED"
  | "ACTIVE_MATCH_ALREADY_EXISTS";

export class CreateMatchError extends Error {
  constructor(
    public readonly code: CreateMatchErrorCode,
    message: string,
  ) {
    super(message);

    this.name = "CreateMatchError";
  }
}
