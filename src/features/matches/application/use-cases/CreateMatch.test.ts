import type { Match } from "@/features/matches/domain/entities/Match";
import { InMemoryMatchRepository } from "@/features/matches/infrastructure/persistence/InMemoryMatchRepository";
import { MockClock } from "@/test/mocks/MockClock";
import { MockIdGenerator } from "@/test/mocks/MockIdGenerator";

import { CreateMatchError } from "../errors/CreateMatchError";
import { CreateMatch } from "./CreateMatch";

describe("CreateMatch", () => {
  const currentDate = new Date("2026-08-06T18:00:00.000Z");

  let repository: InMemoryMatchRepository;
  let idGenerator: MockIdGenerator;
  let clock: MockClock;
  let useCase: CreateMatch;

  beforeEach(() => {
    repository = new InMemoryMatchRepository();

    idGenerator = new MockIdGenerator("match-generated");

    clock = new MockClock(currentDate);

    useCase = new CreateMatch(repository, idGenerator, clock);
  });

  it("creates and persists a match", async () => {
    const result = await useCase.execute({
      opponentName: "João",
      firstServer: "PLAYER",
    });

    expect(result).toEqual({
      id: "match-generated",
      opponentName: "João",
      firstServer: "PLAYER",
      status: "IN_PROGRESS",
      startedAt: currentDate,
      finishedAt: undefined,
      records: [],
    });

    const persisted = await repository.findById("match-generated");

    expect(persisted).toEqual(result);
  });

  it("normalizes spaces in the opponent name", async () => {
    const result = await useCase.execute({
      opponentName: "   João    da   Silva   ",
      firstServer: "OPPONENT",
    });

    expect(result.opponentName).toBe("João da Silva");
  });

  it("uses the selected first server", async () => {
    const result = await useCase.execute({
      opponentName: "João",
      firstServer: "OPPONENT",
    });

    expect(result.firstServer).toBe("OPPONENT");
  });

  it("uses the injected id generator", async () => {
    idGenerator.setNextId("custom-id");

    const result = await useCase.execute({
      opponentName: "João",
      firstServer: "PLAYER",
    });

    expect(result.id).toBe("custom-id");
  });

  it("uses the injected clock", async () => {
    const anotherDate = new Date("2026-08-07T10:30:00.000Z");

    clock.setDate(anotherDate);

    const result = await useCase.execute({
      opponentName: "João",
      firstServer: "PLAYER",
    });

    expect(result.startedAt).toEqual(anotherDate);
  });

  it("rejects an empty opponent name", async () => {
    await expect(
      useCase.execute({
        opponentName: "   ",
        firstServer: "PLAYER",
      }),
    ).rejects.toMatchObject({
      name: "CreateMatchError",
      code: "OPPONENT_NAME_REQUIRED",
      message: "Informe o nome do adversário.",
    });
  });

  it("rejects creating a second active match", async () => {
    await repository.create(createActiveMatch());

    await expect(
      useCase.execute({
        opponentName: "Pedro",
        firstServer: "PLAYER",
      }),
    ).rejects.toMatchObject({
      name: "CreateMatchError",
      code: "ACTIVE_MATCH_ALREADY_EXISTS",
      message: "Já existe uma partida em andamento.",
    });
  });

  it("throws CreateMatchError for invalid input", async () => {
    try {
      await useCase.execute({
        opponentName: "",
        firstServer: "PLAYER",
      });

      throw new Error("Expected the use case to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(CreateMatchError);
    }
  });
});

function createActiveMatch(): Match {
  return {
    id: "active-match",
    opponentName: "Carlos",
    firstServer: "PLAYER",
    status: "IN_PROGRESS",
    startedAt: new Date("2026-08-06T17:00:00.000Z"),
    records: [],
  };
}
