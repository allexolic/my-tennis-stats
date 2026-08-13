export type DeleteMatchErrorCode = "MATCH_NOT_FOUND" | "MATCH_NOT_FINISHED";

export class DeleteMatchError extends Error {
  constructor(
    public readonly code: DeleteMatchErrorCode,
    message: string,
  ) {
    super(message);

    this.name = "DeleteMatchError";
  }
}
