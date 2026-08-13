import { MatchEngine } from "@/features/matches/domain/services/MatchEngine";
import { InMemoryMatchRepository } from "@/features/matches/infrastructure/persistence/InMemoryMatchRepository";
import { GetMatchHistory } from "./GetMatchHistory";

describe("GetMatchHistory", () => {
  let repository: InMemoryMatchRepository;

  let useCase: GetMatchHistory;

  beforeEach(() => {
    repository = new InMemoryMatchRepository();

    useCase = new GetMatchHistory(repository, new MatchEngine());
  });

  it("returns an empty list when there are no finished matches", async () => {
    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
