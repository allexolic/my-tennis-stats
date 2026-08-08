import { MatchFactory } from "./MatchFactory";

describe("MatchFactory", () => {
  it("creates a new match in progress", () => {
    const startedAt = new Date("2026-08-06T18:00:00.000Z");

    const match = MatchFactory.create({
      id: "match-1",
      opponentName: "João",
      firstServer: "PLAYER",
      startedAt,
    });

    expect(match).toEqual({
      id: "match-1",
      opponentName: "João",
      firstServer: "PLAYER",
      status: "IN_PROGRESS",
      startedAt,
      finishedAt: undefined,
      records: [],
    });
  });
});
