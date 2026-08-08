import type { MatchRecordRow, MatchRow } from "@/database/schema";
import type { Match } from "@/features/matches/domain/entities/Match";

import { MatchMapper } from "./MatchMapper";

describe("MatchMapper", () => {
  const date = new Date("2026-08-06T18:00:00.000Z");

  it("maps a domain match to persistence", () => {
    const match = createDomainMatch();

    const data = MatchMapper.toPersistence(match);

    expect(data.match).toEqual({
      id: "match-1",
      opponentName: "João",
      firstServer: "PLAYER",
      status: "IN_PROGRESS",
      startedAt: date,
      finishedAt: null,
    });

    expect(data.records).toHaveLength(3);

    expect(data.records[0]).toMatchObject({
      id: "game-1",
      server: "PLAYER",
      validSecondServes: 2,
      doubleFaults: 1,
      pointsLost: 2,
      pointsWon: null,
    });

    expect(data.records[1]).toMatchObject({
      id: "game-2",
      server: "OPPONENT",
      pointsWon: 3,
    });

    expect(data.records[2]).toMatchObject({
      id: "tie-break-1",
      type: "SET_TIE_BREAK",
      server: null,
      playerTieBreakPoints: 7,
      opponentTieBreakPoints: 5,
    });
  });

  it("maps persistence rows to domain and orders records", () => {
    const matchRow = createMatchRow();

    const recordRows = [
      createReturnGameRow(),
      createServiceGameRow(),
      createTieBreakRow(),
    ];

    const match = MatchMapper.toDomain(matchRow, recordRows);

    expect(match.records.map((record) => record.sequence)).toEqual([1, 2, 3]);

    expect(match.records[0]).toMatchObject({
      type: "REGULAR_GAME",
      server: "PLAYER",
    });

    expect(match.records[1]).toMatchObject({
      type: "REGULAR_GAME",
      server: "OPPONENT",
    });

    expect(match.records[2]).toMatchObject({
      type: "SET_TIE_BREAK",
      playerPoints: 7,
      opponentPoints: 5,
    });
  });

  it("rejects an incomplete service game", () => {
    const row = createServiceGameRow();
    row.pointsLost = null;

    expect(() => MatchMapper.toDomain(createMatchRow(), [row])).toThrow(
      "possui estatísticas incompletas",
    );
  });
});

function createDomainMatch(): Match {
  return {
    id: "match-1",
    opponentName: "João",
    firstServer: "PLAYER",
    status: "IN_PROGRESS",
    startedAt: new Date("2026-08-06T18:00:00.000Z"),

    records: [
      {
        id: "game-1",
        type: "REGULAR_GAME",
        sequence: 1,
        setNumber: 1,
        server: "PLAYER",
        winner: "PLAYER",

        playerServiceStats: {
          validSecondServes: 2,
          doubleFaults: 1,
          pointsLost: 2,
        },

        recordedAt: new Date("2026-08-06T18:05:00.000Z"),
      },
      {
        id: "game-2",
        type: "REGULAR_GAME",
        sequence: 2,
        setNumber: 1,
        server: "OPPONENT",
        winner: "OPPONENT",

        playerReturnStats: {
          pointsWon: 3,
        },

        recordedAt: new Date("2026-08-06T18:10:00.000Z"),
      },
      {
        id: "tie-break-1",
        type: "SET_TIE_BREAK",
        sequence: 3,
        setNumber: 1,
        winner: "PLAYER",
        playerPoints: 7,
        opponentPoints: 5,

        recordedAt: new Date("2026-08-06T19:00:00.000Z"),
      },
    ],
  };
}

function createMatchRow(): MatchRow {
  return {
    id: "match-1",
    opponentName: "João",
    firstServer: "PLAYER",
    status: "IN_PROGRESS",
    startedAt: new Date("2026-08-06T18:00:00.000Z"),
    finishedAt: null,
    createdAt: new Date("2026-08-06T18:00:00.000Z"),
    updatedAt: new Date("2026-08-06T18:00:00.000Z"),
  };
}

function createServiceGameRow(): MatchRecordRow {
  return {
    id: "game-1",
    matchId: "match-1",
    sequence: 1,
    setNumber: 1,
    type: "REGULAR_GAME",
    server: "PLAYER",
    winner: "PLAYER",
    validSecondServes: 2,
    doubleFaults: 1,
    pointsLost: 2,
    pointsWon: null,
    playerTieBreakPoints: null,
    opponentTieBreakPoints: null,
    recordedAt: new Date(),
    updatedAt: null,
  };
}

function createReturnGameRow(): MatchRecordRow {
  return {
    id: "game-2",
    matchId: "match-1",
    sequence: 2,
    setNumber: 1,
    type: "REGULAR_GAME",
    server: "OPPONENT",
    winner: "OPPONENT",
    validSecondServes: null,
    doubleFaults: null,
    pointsLost: null,
    pointsWon: 3,
    playerTieBreakPoints: null,
    opponentTieBreakPoints: null,
    recordedAt: new Date(),
    updatedAt: null,
  };
}

function createTieBreakRow(): MatchRecordRow {
  return {
    id: "tie-break-1",
    matchId: "match-1",
    sequence: 3,
    setNumber: 1,
    type: "SET_TIE_BREAK",
    server: null,
    winner: "PLAYER",
    validSecondServes: null,
    doubleFaults: null,
    pointsLost: null,
    pointsWon: null,
    playerTieBreakPoints: 7,
    opponentTieBreakPoints: 5,
    recordedAt: new Date(),
    updatedAt: null,
  };
}
