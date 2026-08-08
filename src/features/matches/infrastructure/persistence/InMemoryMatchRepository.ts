import type { MatchRepository } from "@/features/matches/application/ports/MatchRepository";
import type { Match } from "@/features/matches/domain/entities/Match";
import { MatchPersistenceError } from "@/features/matches/domain/errors/MatchPersistenceError";

export class InMemoryMatchRepository implements MatchRepository {
  private readonly matches = new Map<string, Match>();

  async create(match: Match): Promise<void> {
    if (this.matches.has(match.id)) {
      throw new MatchPersistenceError(
        `Já existe uma partida com o identificador ${match.id}.`,
      );
    }

    this.assertSingleActiveMatch(match);

    this.matches.set(match.id, this.clone(match));
  }

  async findById(id: string): Promise<Match | null> {
    const match = this.matches.get(id);

    return match ? this.clone(match) : null;
  }

  async findActive(): Promise<Match | null> {
    const activeMatch = [...this.matches.values()].find(
      (match) => match.status === "IN_PROGRESS",
    );

    return activeMatch ? this.clone(activeMatch) : null;
  }

  async listFinished(): Promise<Match[]> {
    return [...this.matches.values()]
      .filter((match) => match.status !== "IN_PROGRESS")
      .sort(
        (left, right) => right.startedAt.getTime() - left.startedAt.getTime(),
      )
      .map((match) => this.clone(match));
  }

  async save(match: Match): Promise<void> {
    if (!this.matches.has(match.id)) {
      throw new MatchPersistenceError(`A partida ${match.id} não existe.`);
    }

    this.assertSingleActiveMatch(match);

    this.matches.set(match.id, this.clone(match));
  }

  async delete(id: string): Promise<void> {
    this.matches.delete(id);
  }

  clear(): void {
    this.matches.clear();
  }

  private assertSingleActiveMatch(matchToSave: Match): void {
    if (matchToSave.status !== "IN_PROGRESS") {
      return;
    }

    const anotherActiveMatch = [...this.matches.values()].find(
      (match) => match.status === "IN_PROGRESS" && match.id !== matchToSave.id,
    );

    if (anotherActiveMatch) {
      throw new MatchPersistenceError("Já existe uma partida em andamento.");
    }
  }

  private clone(match: Match): Match {
    return {
      ...match,
      startedAt: new Date(match.startedAt),

      finishedAt: match.finishedAt ? new Date(match.finishedAt) : undefined,

      records: match.records.map((record) => ({
        ...record,
        recordedAt: new Date(record.recordedAt),

        updatedAt: record.updatedAt ? new Date(record.updatedAt) : undefined,

        ...(record.type === "REGULAR_GAME"
          ? record.server === "PLAYER"
            ? {
                playerServiceStats: {
                  ...record.playerServiceStats,
                },
              }
            : {
                playerReturnStats: {
                  ...record.playerReturnStats,
                },
              }
          : {}),
      })),
    } as Match;
  }
}
