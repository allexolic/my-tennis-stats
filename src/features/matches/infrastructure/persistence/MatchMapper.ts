import type {
  MatchRecordRow,
  MatchRow,
  NewMatchRecordRow,
} from "@/database/schema";
import type { Match } from "@/features/matches/domain/entities/Match";
import type {
  MatchRecord,
  PlayerReturnGameRecord,
  PlayerServiceGameRecord,
  SetTieBreakRecord,
} from "@/features/matches/domain/entities/MatchRecord";
import { MatchPersistenceError } from "@/features/matches/domain/errors/MatchPersistenceError";

export type MatchPersistenceData = {
  match: {
    id: string;
    opponentName: string;
    firstServer: "PLAYER" | "OPPONENT";
    status: "IN_PROGRESS" | "FINISHED" | "INTERRUPTED" | "CANCELLED";
    startedAt: Date;
    finishedAt: Date | null;
  };

  records: NewMatchRecordRow[];
};

export class MatchMapper {
  static toDomain(matchRow: MatchRow, recordRows: MatchRecordRow[]): Match {
    const orderedRows = [...recordRows].sort(
      (left, right) => left.sequence - right.sequence,
    );

    return {
      id: matchRow.id,
      opponentName: matchRow.opponentName,
      firstServer: matchRow.firstServer,
      status: matchRow.status,
      startedAt: matchRow.startedAt,
      finishedAt: matchRow.finishedAt ?? undefined,

      records: orderedRows.map((recordRow) => this.recordToDomain(recordRow)),
    };
  }

  static toPersistence(match: Match): MatchPersistenceData {
    return {
      match: {
        id: match.id,
        opponentName: match.opponentName,
        firstServer: match.firstServer,
        status: match.status,
        startedAt: match.startedAt,
        finishedAt: match.finishedAt ?? null,
      },

      records: match.records.map((record) =>
        this.recordToPersistence(match.id, record),
      ),
    };
  }

  private static recordToDomain(row: MatchRecordRow): MatchRecord {
    if (row.type === "SET_TIE_BREAK") {
      return this.tieBreakToDomain(row);
    }

    if (row.server === "PLAYER") {
      return this.serviceGameToDomain(row);
    }

    if (row.server === "OPPONENT") {
      return this.returnGameToDomain(row);
    }

    throw new MatchPersistenceError(
      `O registro ${row.id} não possui um sacador válido.`,
    );
  }

  private static serviceGameToDomain(
    row: MatchRecordRow,
  ): PlayerServiceGameRecord {
    if (
      row.validSecondServes === null ||
      row.doubleFaults === null ||
      row.pointsLost === null
    ) {
      throw new MatchPersistenceError(
        `O game de serviço ${row.id} possui estatísticas incompletas.`,
      );
    }

    return {
      id: row.id,
      type: "REGULAR_GAME",
      sequence: row.sequence,
      setNumber: row.setNumber,
      server: "PLAYER",
      winner: row.winner,

      playerServiceStats: {
        validSecondServes: row.validSecondServes,

        doubleFaults: row.doubleFaults,
        pointsLost: row.pointsLost,
      },

      recordedAt: row.recordedAt,
      updatedAt: row.updatedAt ?? undefined,
    };
  }

  private static returnGameToDomain(
    row: MatchRecordRow,
  ): PlayerReturnGameRecord {
    if (row.pointsWon === null) {
      throw new MatchPersistenceError(
        `O game de devolução ${row.id} não possui pontos ganhos.`,
      );
    }

    return {
      id: row.id,
      type: "REGULAR_GAME",
      sequence: row.sequence,
      setNumber: row.setNumber,
      server: "OPPONENT",
      winner: row.winner,

      playerReturnStats: {
        pointsWon: row.pointsWon,
      },

      recordedAt: row.recordedAt,
      updatedAt: row.updatedAt ?? undefined,
    };
  }

  private static tieBreakToDomain(row: MatchRecordRow): SetTieBreakRecord {
    if (
      row.playerTieBreakPoints === null ||
      row.opponentTieBreakPoints === null
    ) {
      throw new MatchPersistenceError(
        `O tie-break ${row.id} possui pontuação incompleta.`,
      );
    }

    return {
      id: row.id,
      type: "SET_TIE_BREAK",
      sequence: row.sequence,
      setNumber: row.setNumber,
      winner: row.winner,
      playerPoints: row.playerTieBreakPoints,
      opponentPoints: row.opponentTieBreakPoints,
      recordedAt: row.recordedAt,
      updatedAt: row.updatedAt ?? undefined,
    };
  }

  private static recordToPersistence(
    matchId: string,
    record: MatchRecord,
  ): NewMatchRecordRow {
    if (record.type === "SET_TIE_BREAK") {
      return {
        id: record.id,
        matchId,
        sequence: record.sequence,
        setNumber: record.setNumber,
        type: "SET_TIE_BREAK",
        server: null,
        winner: record.winner,

        validSecondServes: null,
        doubleFaults: null,
        pointsLost: null,
        pointsWon: null,

        playerTieBreakPoints: record.playerPoints,

        opponentTieBreakPoints: record.opponentPoints,

        recordedAt: record.recordedAt,
        updatedAt: record.updatedAt ?? null,
      };
    }

    if (record.server === "PLAYER") {
      return {
        id: record.id,
        matchId,
        sequence: record.sequence,
        setNumber: record.setNumber,
        type: "REGULAR_GAME",
        server: "PLAYER",
        winner: record.winner,

        validSecondServes: record.playerServiceStats.validSecondServes,

        doubleFaults: record.playerServiceStats.doubleFaults,

        pointsLost: record.playerServiceStats.pointsLost,

        pointsWon: null,
        playerTieBreakPoints: null,
        opponentTieBreakPoints: null,

        recordedAt: record.recordedAt,
        updatedAt: record.updatedAt ?? null,
      };
    }

    return {
      id: record.id,
      matchId,
      sequence: record.sequence,
      setNumber: record.setNumber,
      type: "REGULAR_GAME",
      server: "OPPONENT",
      winner: record.winner,

      validSecondServes: null,
      doubleFaults: null,
      pointsLost: null,

      pointsWon: record.playerReturnStats.pointsWon,

      playerTieBreakPoints: null,
      opponentTieBreakPoints: null,

      recordedAt: record.recordedAt,
      updatedAt: record.updatedAt ?? null,
    };
  }
}
