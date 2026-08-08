export class MatchDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MatchDomainError";
  }
}
