import { MatchStatus } from "@/features/matches/domain/types/MatchStatus";
import { PlayerSide } from "@/features/matches/domain/types/PlayerSide";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const matches = sqliteTable(
  "matches",
  {
    id: text("id").primaryKey(),

    opponentName: text("opponent_name").notNull(),

    firstServer: text("first_server", {
      enum: [PlayerSide.PLAYER, PlayerSide.OPPONENT],
    }).notNull(),

    status: text("status", {
      enum: [
        MatchStatus.IN_PROGRESS,
        MatchStatus.FINISHED,
        MatchStatus.INTERRUPTED,
        MatchStatus.CANCELLED,
      ],
    }).notNull(),

    startedAt: integer("started_at", {
      mode: "timestamp_ms",
    }).notNull(),

    finishedAt: integer("finished_at", {
      mode: "timestamp_ms",
    }),

    createdAt: integer("created_at", {
      mode: "timestamp_ms",
    }).notNull(),

    updatedAt: integer("updated_at", {
      mode: "timestamp_ms",
    }).notNull(),
  },
  (table) => [
    index("matches_status_idx").on(table.status),
    index("matches_started_at_idx").on(table.startedAt),
  ],
);

export const matchRecords = sqliteTable(
  "match_records",
  {
    id: text("id").primaryKey(),

    matchId: text("match_id")
      .notNull()
      .references(() => matches.id, {
        onDelete: "cascade",
      }),

    sequence: integer("sequence").notNull(),

    setNumber: integer("set_number").notNull().default(1),

    type: text("type", {
      enum: ["REGULAR_GAME", "SET_TIE_BREAK"],
    }).notNull(),

    server: text("server", {
      enum: [PlayerSide.PLAYER, PlayerSide.OPPONENT],
    }),

    winner: text("winner", {
      enum: [PlayerSide.PLAYER, PlayerSide.OPPONENT],
    }).notNull(),

    validSecondServes: integer("valid_second_serves"),

    doubleFaults: integer("double_faults"),

    pointsLost: integer("points_lost"),

    pointsWon: integer("points_won"),

    playerTieBreakPoints: integer("player_tie_break_points"),

    opponentTieBreakPoints: integer("opponent_tie_break_points"),

    recordedAt: integer("recorded_at", {
      mode: "timestamp_ms",
    }).notNull(),

    updatedAt: integer("updated_at", {
      mode: "timestamp_ms",
    }),
  },
  (table) => [
    index("match_records_match_id_idx").on(table.matchId),

    uniqueIndex("match_records_match_sequence_uq").on(
      table.matchId,
      table.sequence,
    ),
  ],
);

export type MatchRow = typeof matches.$inferSelect;

export type NewMatchRow = typeof matches.$inferInsert;

export type MatchRecordRow = typeof matchRecords.$inferSelect;

export type NewMatchRecordRow = typeof matchRecords.$inferInsert;
