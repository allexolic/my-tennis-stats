export type GetMatchSummaryErrorCode = "MATCH_NOT_FOUND" | "MATCH_NOT_FINISHED";

export class GetMatchSummaryError extends Error {
  constructor(
    public readonly code: GetMatchSummaryErrorCode,
    message: string,
  ) {
    super(message);

    this.name = "GetMatchSummaryError";
  }
}
