import { MatchEngine } from "@/features/matches/domain/services/MatchEngine";

import { MatchRecordValidator } from "@/features/matches/domain/services/MatchRecordValidator";

import { MatchStatus } from "@/features/matches/domain/types/MatchStatus";

import { PlayerSide } from "@/features/matches/domain/types/PlayerSide";

import { InMemoryMatchRepository } from "@/features/matches/infrastructure/persistence/InMemoryMatchRepository";

import { MatchBuilder } from "@/test/builders/MatchBuilder";

import { MockClock } from "@/test/mocks/MockClock";

import { MockIdGenerator } from "@/test/mocks/MockIdGenerator";

import { RegisterTieBreak } from "./RegisterTieBreak";

describe("RegisterTieBreak", () => {
  const currentDate = new Date("2026-08-07T18:00:00.000Z");

  let repository: InMemoryMatchRepository;

  let useCase: RegisterTieBreak;

  beforeEach(() => {
    repository = new InMemoryMatchRepository();

    const engine = new MatchEngine();

    const validator = new MatchRecordValidator(engine);

    useCase = new RegisterTieBreak(
      repository,
      engine,
      validator,
      new MockIdGenerator("tie-break-1"),
      new MockClock(currentDate),
    );
  });

  it("registers a valid tie-break", async () => {
    await repository.create(new MatchBuilder().withTiedSetAtSixGames().build());

    const result = await useCase.execute({
      matchId: "match-1",
      playerPoints: 7,
      opponentPoints: 5,
    });

    expect(result.match.records.at(-1)).toMatchObject({
      id: "tie-break-1",
      type: "SET_TIE_BREAK",
      winner: PlayerSide.PLAYER,
      playerPoints: 7,
      opponentPoints: 5,
    });

    expect(result.progress.score.playerGames).toBe(7);

    expect(result.progress.score.opponentGames).toBe(6);

    expect(result.progress.isMatchFinished).toBe(true);

    expect(result.match.status).toBe(MatchStatus.FINISHED);

    expect(result.match.finishedAt).toEqual(currentDate);
  });

  it("registers an opponent tie-break win", async () => {
    await repository.create(new MatchBuilder().withTiedSetAtSixGames().build());

    const result = await useCase.execute({
      matchId: "match-1",
      playerPoints: 5,
      opponentPoints: 7,
    });

    expect(result.progress.winner).toBe(PlayerSide.OPPONENT);

    expect(result.progress.score.playerGames).toBe(6);

    expect(result.progress.score.opponentGames).toBe(7);
  });

  it("accepts a long tie-break", async () => {
    await repository.create(new MatchBuilder().withTiedSetAtSixGames().build());

    await expect(
      useCase.execute({
        matchId: "match-1",
        playerPoints: 12,
        opponentPoints: 10,
      }),
    ).resolves.toBeDefined();
  });

  it("rejects 7-6", async () => {
    await repository.create(new MatchBuilder().withTiedSetAtSixGames().build());

    await expect(
      useCase.execute({
        matchId: "match-1",
        playerPoints: 7,
        opponentPoints: 6,
      }),
    ).rejects.toMatchObject({
      code: "INVALID_TIE_BREAK",
    });
  });

  it("rejects a tie-break before 6-6", async () => {
    const match = new MatchBuilder().build();

    await repository.create(match);

    await expect(
      useCase.execute({
        matchId: match.id,
        playerPoints: 7,
        opponentPoints: 5,
      }),
    ).rejects.toMatchObject({
      code: "TIE_BREAK_NOT_ALLOWED",
    });
  });

  it("rejects 8-4 because the tie-break should have ended at 7-4", async () => {
    await repository.create(new MatchBuilder().withTiedSetAtSixGames().build());

    await expect(
      useCase.execute({
        matchId: "match-1",
        playerPoints: 8,
        opponentPoints: 4,
      }),
    ).rejects.toMatchObject({
      code: "INVALID_TIE_BREAK",
    });
  });
});
