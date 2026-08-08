import type { Match } from "@/features/matches/domain/entities/Match";
import { InMemoryMatchRepository } from "@/features/matches/infrastructure/persistence/InMemoryMatchRepository";
import { GetActiveMatch } from "./GetActiveMatch";

describe("GetActiveMatch", () => {
  let repository: InMemoryMatchRepository;
  let useCase: GetActiveMatch;

  beforeEach(() => {
    repository = new InMemoryMatchRepository();

    useCase = new GetActiveMatch(repository);
  });

  it("returns null when there is no active match", async () => {
    const result = await useCase.execute();

    expect(result).toBeNull();
  });

  it("returns the active match", async () => {
    const match = createMatch();

    await repository.create(match);

    const result = await useCase.execute();

    expect(result).toEqual(match);
  });
});

function createMatch(): Match {
  return {
    id: "match-1",
    opponentName: "João",
    firstServer: "PLAYER",
    status: "IN_PROGRESS",
    startedAt: new Date("2026-08-06T18:00:00.000Z"),
    records: [],
  };
}
