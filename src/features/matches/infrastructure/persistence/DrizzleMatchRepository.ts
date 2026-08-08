import { asc, desc, eq, ne } from "drizzle-orm";

import { database } from "@/database/client";
import { matchRecords, matches } from "@/database/schema";
import type { MatchRepository } from "@/features/matches/application/ports/MatchRepository";
import type { Match } from "@/features/matches/domain/entities/Match";
import { MatchPersistenceError } from "@/features/matches/domain/errors/MatchPersistenceError";

import { MatchMapper } from "./MatchMapper";

type Database = typeof database;

export class DrizzleMatchRepository implements MatchRepository {
  constructor(private readonly db: Database = database) {}

  async create(match: Match): Promise<void> {
    try {
      const existingMatch = await this.findMatchRowById(match.id);

      if (existingMatch) {
        throw new MatchPersistenceError(
          `Já existe uma partida com o identificador ${match.id}.`,
        );
      }

      await this.assertSingleActiveMatch(match.id, match.status);

      const persistence = MatchMapper.toPersistence(match);

      const now = new Date();

      await this.db.transaction(async (transaction) => {
        await transaction.insert(matches).values({
          ...persistence.match,
          createdAt: now,
          updatedAt: now,
        });

        if (persistence.records.length > 0) {
          await transaction.insert(matchRecords).values(persistence.records);
        }
      });
    } catch (error) {
      this.rethrowPersistenceError(error, "Não foi possível criar a partida.");
    }
  }

  async findById(id: string): Promise<Match | null> {
    try {
      const matchRow = await this.findMatchRowById(id);

      if (!matchRow) {
        return null;
      }

      const recordRows = await this.db
        .select()
        .from(matchRecords)
        .where(eq(matchRecords.matchId, id))
        .orderBy(asc(matchRecords.sequence));

      return MatchMapper.toDomain(matchRow, recordRows);
    } catch (error) {
      this.rethrowPersistenceError(
        error,
        "Não foi possível carregar a partida.",
      );
    }
  }

  async findActive(): Promise<Match | null> {
    try {
      const rows = await this.db
        .select()
        .from(matches)
        .where(eq(matches.status, "IN_PROGRESS"))
        .orderBy(desc(matches.startedAt))
        .limit(1);

      const matchRow = rows[0];

      if (!matchRow) {
        return null;
      }

      const recordRows = await this.db
        .select()
        .from(matchRecords)
        .where(eq(matchRecords.matchId, matchRow.id))
        .orderBy(asc(matchRecords.sequence));

      return MatchMapper.toDomain(matchRow, recordRows);
    } catch (error) {
      this.rethrowPersistenceError(
        error,
        "Não foi possível carregar a partida em andamento.",
      );
    }
  }

  async listFinished(): Promise<Match[]> {
    try {
      const matchRows = await this.db
        .select()
        .from(matches)
        .where(ne(matches.status, "IN_PROGRESS"))
        .orderBy(desc(matches.startedAt));

      const result: Match[] = [];

      for (const matchRow of matchRows) {
        const recordRows = await this.db
          .select()
          .from(matchRecords)
          .where(eq(matchRecords.matchId, matchRow.id))
          .orderBy(asc(matchRecords.sequence));

        result.push(MatchMapper.toDomain(matchRow, recordRows));
      }

      return result;
    } catch (error) {
      this.rethrowPersistenceError(
        error,
        "Não foi possível listar o histórico de partidas.",
      );
    }
  }

  async save(match: Match): Promise<void> {
    try {
      const existingRow = await this.findMatchRowById(match.id);

      if (!existingRow) {
        throw new MatchPersistenceError(`A partida ${match.id} não existe.`);
      }

      await this.assertSingleActiveMatch(match.id, match.status);

      const persistence = MatchMapper.toPersistence(match);

      const now = new Date();

      await this.db.transaction(async (transaction) => {
        await transaction
          .update(matches)
          .set({
            opponentName: persistence.match.opponentName,

            firstServer: persistence.match.firstServer,

            status: persistence.match.status,

            startedAt: persistence.match.startedAt,

            finishedAt: persistence.match.finishedAt,

            updatedAt: now,
          })
          .where(eq(matches.id, match.id));

        await transaction
          .delete(matchRecords)
          .where(eq(matchRecords.matchId, match.id));

        if (persistence.records.length > 0) {
          await transaction.insert(matchRecords).values(persistence.records);
        }
      });
    } catch (error) {
      this.rethrowPersistenceError(error, "Não foi possível salvar a partida.");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.db.delete(matches).where(eq(matches.id, id));
    } catch (error) {
      this.rethrowPersistenceError(
        error,
        "Não foi possível excluir a partida.",
      );
    }
  }

  private async findMatchRowById(id: string) {
    const rows = await this.db
      .select()
      .from(matches)
      .where(eq(matches.id, id))
      .limit(1);

    return rows[0] ?? null;
  }

  private async assertSingleActiveMatch(
    matchId: string,
    status: Match["status"],
  ): Promise<void> {
    if (status !== "IN_PROGRESS") {
      return;
    }

    const activeRows = await this.db
      .select({
        id: matches.id,
      })
      .from(matches)
      .where(eq(matches.status, "IN_PROGRESS"))
      .limit(2);

    const anotherActiveMatch = activeRows.find((row) => row.id !== matchId);

    if (anotherActiveMatch) {
      throw new MatchPersistenceError("Já existe uma partida em andamento.");
    }
  }

  private rethrowPersistenceError(
    error: unknown,
    fallbackMessage: string,
  ): never {
    if (error instanceof MatchPersistenceError) {
      throw error;
    }

    const technicalMessage = error instanceof Error ? ` ${error.message}` : "";

    throw new MatchPersistenceError(`${fallbackMessage}${technicalMessage}`);
  }
}
