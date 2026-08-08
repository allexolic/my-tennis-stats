import type { Match } from "@/features/matches/domain/entities/Match";

import { InMemoryMatchRepository } from "./InMemoryMatchRepository";

describe("InMemoryMatchRepository", () => {
  let repository: InMemoryMatchRepository;

  beforeEach(() => {
    repository = new InMemoryMatchRepository();
  });

  it("creates and retrieves a match", async () => {
    const match = createMatch();

    await repository.create(match);

    const result = await repository.findById(match.id);

    expect(result).toEqual(match);
  });

  it("returns null for an unknown match", async () => {
    const result = await repository.findById("unknown");

    expect(result).toBeNull();
  });

  it("finds the active match", async () => {
    await repository.create(createMatch());

    const active = await repository.findActive();

    expect(active?.id).toBe("match-1");
  });

  it("rejects a second active match", async () => {
    await repository.create(createMatch());

    await expect(
      repository.create({
        ...createMatch(),
        id: "match-2",
      }),
    ).rejects.toThrow("Já existe uma partida em andamento.");
  });

  it("saves an existing match", async () => {
    const match = createMatch();

    await repository.create(match);

    await repository.save({
      ...match,
      status: "FINISHED",
      finishedAt: new Date("2026-08-06T19:30:00.000Z"),
    });

    const result = await repository.findById(match.id);

    expect(result?.status).toBe("FINISHED");
    expect(result?.finishedAt).toEqual(new Date("2026-08-06T19:30:00.000Z"));
  });

  it("rejects saving an unknown match", async () => {
    await expect(repository.save(createMatch())).rejects.toThrow(
      "A partida match-1 não existe.",
    );
  });

  it("lists finished matches by most recent start date", async () => {
    await repository.create({
      ...createMatch(),
      id: "finished-older",
      status: "FINISHED",
      startedAt: new Date("2026-08-01T10:00:00.000Z"),
    });

    await repository.create({
      ...createMatch(),
      id: "finished-newer",
      status: "FINISHED",
      startedAt: new Date("2026-08-05T10:00:00.000Z"),
    });

    await repository.create({
      ...createMatch(),
      id: "active",
    });

    const result = await repository.listFinished();

    expect(result.map((match) => match.id)).toEqual([
      "finished-newer",
      "finished-older",
    ]);
  });

  it("deletes a match", async () => {
    const match = createMatch();

    await repository.create(match);
    await repository.delete(match.id);

    expect(await repository.findById(match.id)).toBeNull();
  });

  it("returns defensive copies", async () => {
    const match = createMatch();

    await repository.create(match);

    const result = await repository.findById(match.id);

    if (!result) {
      throw new Error("Match not found");
    }

    result.opponentName = "Alterado";

    const stored = await repository.findById(match.id);

    expect(stored?.opponentName).toBe("João");
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
