import { MatchStatus } from "@/features/matches/domain/types/MatchStatus";

import { InMemoryMatchRepository } from "@/features/matches/infrastructure/persistence/InMemoryMatchRepository";

import { MatchBuilder } from "@/test/builders/MatchBuilder";

import { DeleteMatch } from "./DeleteMatch";

describe("DeleteMatch", () => {
  let repository: InMemoryMatchRepository;

  let useCase: DeleteMatch;

  beforeEach(() => {
    repository = new InMemoryMatchRepository();

    useCase = new DeleteMatch(repository);
  });

  it("deletes a finished match", async () => {
    const match = createFinishedMatch();

    await repository.create(match);

    await useCase.execute(match.id);

    const persisted = await repository.findById(match.id);

    expect(persisted).toBeNull();
  });

  it("rejects an unknown match", async () => {
    await expect(useCase.execute("unknown")).rejects.toMatchObject({
      code: "MATCH_NOT_FOUND",
    });
  });

  it("rejects deleting an active match", async () => {
    const match = new MatchBuilder().build();

    await repository.create(match);

    await expect(useCase.execute(match.id)).rejects.toMatchObject({
      code: "MATCH_NOT_FINISHED",
    });
  });
});

function createFinishedMatch() {
  const match = new MatchBuilder()
    .withGameWonBy("PLAYER")
    .withGameWonBy("PLAYER")
    .withGameWonBy("PLAYER")
    .withGameWonBy("PLAYER")
    .withGameWonBy("PLAYER")
    .withGameWonBy("PLAYER")
    .build();

  match.status = MatchStatus.FINISHED;

  match.finishedAt = new Date();

  return match;
}
