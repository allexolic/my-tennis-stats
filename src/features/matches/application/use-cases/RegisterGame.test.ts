import type { Match } from "@/features/matches/domain/entities/Match";

import { MatchEngine } from "@/features/matches/domain/services/MatchEngine";

import { MatchRecordValidator } from "@/features/matches/domain/services/MatchRecordValidator";

import { MatchStatus } from "@/features/matches/domain/types/MatchStatus";

import { PlayerSide } from "@/features/matches/domain/types/PlayerSide";

import { InMemoryMatchRepository } from "@/features/matches/infrastructure/persistence/InMemoryMatchRepository";

import { MockClock } from "@/test/mocks/MockClock";

import { MockIdGenerator } from "@/test/mocks/MockIdGenerator";

import { RegisterGame } from "./RegisterGame";

import { MatchBuilder } from "@/test/builders/MatchBuilder";

describe("RegisterGame", () => {
  const currentDate = new Date("2026-08-07T15:00:00.000Z");

  let repository: InMemoryMatchRepository;

  let engine: MatchEngine;

  let validator: MatchRecordValidator;

  let idGenerator: MockIdGenerator;

  let clock: MockClock;

  let useCase: RegisterGame;

  beforeEach(() => {
    repository = new InMemoryMatchRepository();

    engine = new MatchEngine();

    validator = new MatchRecordValidator(engine);

    idGenerator = new MockIdGenerator("record-1");

    clock = new MockClock(currentDate);

    useCase = new RegisterGame(
      repository,
      engine,
      validator,
      idGenerator,
      clock,
    );
  });

  it("registers a player service game", async () => {
    await repository.create(createMatch());

    const result = await useCase.execute({
      matchId: "match-1",

      winner: PlayerSide.PLAYER,

      validSecondServes: 2,
      doubleFaults: 1,
      pointsLost: 3,
    });

    expect(result.match.records).toHaveLength(1);

    expect(result.match.records[0]).toMatchObject({
      id: "record-1",
      sequence: 1,
      server: "PLAYER",
      winner: "PLAYER",
    });

    expect(result.progress.score.playerGames).toBe(1);

    expect(result.progress.nextServer).toBe(PlayerSide.OPPONENT);
  });

  it("registers a return game", async () => {
    await repository.create({
      ...createMatch(),
      firstServer: PlayerSide.OPPONENT,
    });

    const result = await useCase.execute({
      matchId: "match-1",

      winner: PlayerSide.PLAYER,

      pointsWon: 4,
    });

    expect(result.match.records[0]).toMatchObject({
      server: "OPPONENT",
      winner: "PLAYER",

      playerReturnStats: {
        pointsWon: 4,
      },
    });

    expect(result.progress.score.playerGames).toBe(1);
  });

  it("persists the updated match", async () => {
    await repository.create(createMatch());

    await useCase.execute({
      matchId: "match-1",
      winner: PlayerSide.PLAYER,
      validSecondServes: 1,
      doubleFaults: 0,
      pointsLost: 2,
    });

    const persisted = await repository.findById("match-1");

    expect(persisted?.records).toHaveLength(1);
  });

  it("rejects an unknown match", async () => {
    await expect(
      useCase.execute({
        matchId: "unknown",
        winner: PlayerSide.PLAYER,
        validSecondServes: 1,
        doubleFaults: 0,
        pointsLost: 2,
      }),
    ).rejects.toMatchObject({
      code: "MATCH_NOT_FOUND",
    });
  });

  it("rejects invalid service statistics", async () => {
    await repository.create(createMatch());

    await expect(
      useCase.execute({
        matchId: "match-1",
        winner: PlayerSide.OPPONENT,

        validSecondServes: 1,
        doubleFaults: 3,
        pointsLost: 2,
      }),
    ).rejects.toMatchObject({
      code: "INVALID_GAME_DATA",
    });
  });

  it("rejects a regular game when tie-break is required", async () => {
    const match = createTiedMatch();

    await repository.create(match);

    await expect(
      useCase.execute({
        matchId: "match-1",
        winner: PlayerSide.PLAYER,
        validSecondServes: 1,
        doubleFaults: 0,
        pointsLost: 1,
      }),
    ).rejects.toMatchObject({
      code: "TIE_BREAK_REQUIRED",
    });
  });

  it("finishes the match when the winning game completes the set", async () => {
    const match = createFiveThreeMatch();

    await repository.create(match);

    const result = await useCase.execute({
      matchId: "match-1",
      winner: PlayerSide.PLAYER,

      validSecondServes: 2,
      doubleFaults: 0,
      pointsLost: 1,
    });

    expect(result.progress.isMatchFinished).toBe(true);

    expect(result.match.status).toBe(MatchStatus.FINISHED);

    expect(result.match.finishedAt).toEqual(currentDate);

    expect(result.progress.score.playerGames).toBe(6);

    expect(result.progress.score.opponentGames).toBe(3);
  });

  it("rejects return stats when player is serving", async () => {
    await repository.create(createMatch());

    await expect(
      useCase.execute({
        matchId: "match-1",
        winner: PlayerSide.PLAYER,
        pointsWon: 4,
      }),
    ).rejects.toMatchObject({
      code: "INVALID_GAME_DATA",
    });
  });

  it("rejects service stats when opponent is serving", async () => {
    await repository.create({
      ...createMatch(),
      firstServer: PlayerSide.OPPONENT,
    });

    await expect(
      useCase.execute({
        matchId: "match-1",
        winner: PlayerSide.PLAYER,

        validSecondServes: 1,
        doubleFaults: 0,
        pointsLost: 1,
      }),
    ).rejects.toMatchObject({
      code: "INVALID_GAME_DATA",
    });
  });
});

function createMatch(): Match {
  return {
    id: "match-1",
    opponentName: "Carlos",

    firstServer: PlayerSide.PLAYER,

    status: MatchStatus.IN_PROGRESS,

    startedAt: new Date("2026-08-07T14:00:00.000Z"),

    records: [],
  };
}

function createTiedMatch(): Match {
  return new MatchBuilder().withTiedSetAtSixGames().build();
}

function createFiveThreeMatch(): Match {
  return new MatchBuilder()
    .withGameWonBy("PLAYER")
    .withGameWonBy("OPPONENT")
    .withGameWonBy("PLAYER")
    .withGameWonBy("OPPONENT")
    .withGameWonBy("PLAYER")
    .withGameWonBy("OPPONENT")
    .withGameWonBy("PLAYER")
    .withGameWonBy("PLAYER")
    .build();
}
