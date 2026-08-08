import type { Match } from "@/features/matches/domain/entities/Match";
import { MatchEngine } from "@/features/matches/domain/services/MatchEngine";
import { InMemoryMatchRepository } from "@/features/matches/infrastructure/persistence/InMemoryMatchRepository";

import { GetMatchById } from "./GetMatchById";

describe("GetMatchById", () => {
  let repository: InMemoryMatchRepository;

  let useCase: GetMatchById;

  beforeEach(() => {
    repository = new InMemoryMatchRepository();

    useCase = new GetMatchById(repository, new MatchEngine());
  });

  it("returns null when the match does not exist", async () => {
    const result = await useCase.execute("unknown");

    expect(result).toBeNull();
  });

  it("returns the match with its progress", async () => {
    const match = createMatch();

    await repository.create(match);

    const result = await useCase.execute(match.id);

    expect(result?.match).toEqual(match);

    expect(result?.progress.score).toEqual({
      playerGames: 0,
      opponentGames: 0,
      winner: undefined,
    });

    expect(result?.progress.nextServer).toBe("PLAYER");

    expect(result?.progress.nextRecordType).toBe("PLAYER_SERVICE_GAME");
  });

  it("calculates progress from registered games", async () => {
    const match = createMatch();

    match.records.push(
      {
        id: "game-1",
        type: "REGULAR_GAME",
        sequence: 1,
        setNumber: 1,
        server: "PLAYER",
        winner: "PLAYER",

        playerServiceStats: {
          validSecondServes: 2,
          doubleFaults: 0,
          pointsLost: 1,
        },

        recordedAt: new Date(),
      },
      {
        id: "game-2",
        type: "REGULAR_GAME",
        sequence: 2,
        setNumber: 1,
        server: "OPPONENT",
        winner: "OPPONENT",

        playerReturnStats: {
          pointsWon: 2,
        },

        recordedAt: new Date(),
      },
    );

    await repository.create(match);

    const result = await useCase.execute(match.id);

    expect(result?.progress.score.playerGames).toBe(1);

    expect(result?.progress.score.opponentGames).toBe(1);

    expect(result?.progress.nextServer).toBe("PLAYER");
  });
});

function createMatch(): Match {
  return {
    id: "match-1",
    opponentName: "Carlos",
    firstServer: "PLAYER",
    status: "IN_PROGRESS",
    startedAt: new Date("2026-08-07T12:00:00.000Z"),
    records: [],
  };
}
