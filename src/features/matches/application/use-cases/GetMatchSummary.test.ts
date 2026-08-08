import { MatchEngine } from "@/features/matches/domain/services/MatchEngine";

import { StatisticsCalculator } from "@/features/matches/domain/services/StatisticsCalculator";

import { MatchStatus } from "@/features/matches/domain/types/MatchStatus";

import { PlayerSide } from "@/features/matches/domain/types/PlayerSide";

import { InMemoryMatchRepository } from "@/features/matches/infrastructure/persistence/InMemoryMatchRepository";

import { MatchBuilder } from "@/test/builders/MatchBuilder";

import { GetMatchSummary } from "./GetMatchSummary";

describe("GetMatchSummary", () => {
  let repository: InMemoryMatchRepository;

  let useCase: GetMatchSummary;

  beforeEach(() => {
    repository = new InMemoryMatchRepository();

    useCase = new GetMatchSummary(
      repository,
      new MatchEngine(),
      new StatisticsCalculator(),
    );
  });

  it("rejects an unknown match", async () => {
    await expect(useCase.execute("unknown")).rejects.toMatchObject({
      code: "MATCH_NOT_FOUND",
    });
  });

  it("rejects a match that is not finished", async () => {
    const match = new MatchBuilder().build();

    await repository.create(match);

    await expect(useCase.execute(match.id)).rejects.toMatchObject({
      code: "MATCH_NOT_FINISHED",
    });
  });

  it("returns a finished match summary", async () => {
    const startedAt = new Date("2026-08-07T15:00:00.000Z");

    const finishedAt = new Date("2026-08-07T16:12:00.000Z");

    const match = new MatchBuilder()
      .withGameWonBy("PLAYER")
      .withGameWonBy("OPPONENT")
      .withGameWonBy("PLAYER")
      .withGameWonBy("PLAYER")
      .withGameWonBy("PLAYER")
      .withGameWonBy("PLAYER")
      .withGameWonBy("PLAYER")
      .build();

    match.status = MatchStatus.FINISHED;

    match.startedAt = startedAt;

    match.finishedAt = finishedAt;

    await repository.create(match);

    const result = await useCase.execute(match.id);

    expect(result.winner).toBe(PlayerSide.PLAYER);

    expect(result.playerGames).toBe(6);

    expect(result.opponentGames).toBe(1);

    expect(result.durationInMinutes).toBe(72);

    expect(result.statistics).toBeDefined();

    expect(result.tieBreak).toBeNull();
  });

  it("includes the tie-break score in the summary", async () => {
    const match = new MatchBuilder()
      .withTiedSetAtSixGames()
      .withSetTieBreak(7, 5, "PLAYER")
      .build();

    match.status = MatchStatus.FINISHED;

    match.finishedAt = new Date(match.startedAt.getTime() + 60 * 60 * 1000);

    await repository.create(match);

    const result = await useCase.execute(match.id);

    expect(result.tieBreak).toEqual({
      playerPoints: 7,
      opponentPoints: 5,
    });

    expect(result.playerGames).toBe(7);

    expect(result.opponentGames).toBe(6);
  });
});
