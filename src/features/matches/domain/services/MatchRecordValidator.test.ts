import type { Match } from "@/features/matches/domain/entities/Match";
import type {
    PlayerReturnGameRecord,
    PlayerServiceGameRecord,
} from "@/features/matches/domain/entities/MatchRecord";
import { MatchBuilder } from "@/test/builders/MatchBuilder";

import { MatchRecordValidator } from "./MatchRecordValidator";

describe("MatchRecordValidator", () => {
  const validator = new MatchRecordValidator();

  it("accepts a valid player service game", () => {
    const match = new MatchBuilder().withFirstServer("PLAYER").build();

    const record = createPlayerServiceGame({
      sequence: 1,
      server: "PLAYER",
      winner: "PLAYER",
      validSecondServes: 2,
      doubleFaults: 1,
      pointsLost: 3,
    });

    expect(() => validator.validateNextRecord(match, record)).not.toThrow();
  });

  it("accepts a valid return game", () => {
    const match = new MatchBuilder().withFirstServer("OPPONENT").build();

    const record = createPlayerReturnGame({
      sequence: 1,
      server: "OPPONENT",
      winner: "PLAYER",
      pointsWon: 4,
    });

    expect(() => validator.validateNextRecord(match, record)).not.toThrow();
  });

  it("rejects an invalid sequence", () => {
    const match = new MatchBuilder().build();

    const record = createPlayerServiceGame({
      sequence: 2,
      server: "PLAYER",
      winner: "PLAYER",
      validSecondServes: 0,
      doubleFaults: 0,
      pointsLost: 0,
    });

    expect(() => validator.validateNextRecord(match, record)).toThrow(
      "A sequência esperada é 1.",
    );
  });

  it("rejects a record outside the first set", () => {
    const match = new MatchBuilder().build();

    const record = createPlayerServiceGame({
      sequence: 1,
      server: "PLAYER",
      winner: "PLAYER",
      validSecondServes: 0,
      doubleFaults: 0,
      pointsLost: 0,
    });

    record.setNumber = 2;

    expect(() => validator.validateNextRecord(match, record)).toThrow(
      "A V1 permite registros apenas no primeiro set.",
    );
  });

  it("rejects the wrong server", () => {
    const match = new MatchBuilder().withFirstServer("PLAYER").build();

    const record = createPlayerReturnGame({
      sequence: 1,
      server: "OPPONENT",
      winner: "PLAYER",
      pointsWon: 4,
    });

    expect(() => validator.validateNextRecord(match, record)).toThrow(
      "O sacador informado não corresponde à sequência da partida.",
    );
  });

  it("rejects negative values", () => {
    const match = new MatchBuilder().build();

    const record = createPlayerServiceGame({
      sequence: 1,
      server: "PLAYER",
      winner: "PLAYER",
      validSecondServes: -1,
      doubleFaults: 0,
      pointsLost: 0,
    });

    expect(() => validator.validateNextRecord(match, record)).toThrow(
      "Segundos serviços válidos não pode ser negativo.",
    );
  });

  it("rejects decimal values", () => {
    const match = new MatchBuilder().build();

    const record = createPlayerServiceGame({
      sequence: 1,
      server: "PLAYER",
      winner: "PLAYER",
      validSecondServes: 1.5,
      doubleFaults: 0,
      pointsLost: 0,
    });

    expect(() => validator.validateNextRecord(match, record)).toThrow(
      "Segundos serviços válidos deve ser um número inteiro.",
    );
  });

  it("rejects double faults greater than lost points", () => {
    const match = new MatchBuilder().build();

    const record = createPlayerServiceGame({
      sequence: 1,
      server: "PLAYER",
      winner: "OPPONENT",
      validSecondServes: 1,
      doubleFaults: 3,
      pointsLost: 2,
    });

    expect(() => validator.validateNextRecord(match, record)).toThrow(
      "Duplas faltas não podem superar os pontos perdidos.",
    );
  });

  it("rejects records in a finished match", () => {
    const match: Match = {
      ...new MatchBuilder().build(),
      status: "FINISHED",
    };

    const record = createPlayerServiceGame({
      sequence: 1,
      server: "PLAYER",
      winner: "PLAYER",
      validSecondServes: 0,
      doubleFaults: 0,
      pointsLost: 0,
    });

    expect(() => validator.validateNextRecord(match, record)).toThrow(
      "Não é possível adicionar registros a uma partida encerrada.",
    );
  });

  it("replays and validates a complete match", () => {
    const match = new MatchBuilder()
      .withGameWonBy("PLAYER")
      .withGameWonBy("OPPONENT")
      .withGameWonBy("PLAYER")
      .build();

    expect(() => validator.validateMatch(match)).not.toThrow();

    const progress = validator.validateMatch(match);

    expect(progress.score.playerGames).toBe(2);
    expect(progress.score.opponentGames).toBe(1);
  });

  it("detects an invalid sequence during replay", () => {
    const match = new MatchBuilder()
      .withGameWonBy("PLAYER")
      .withGameWonBy("OPPONENT")
      .build();

    match.records[1].sequence = 3;

    expect(() => validator.validateMatch(match)).toThrow(
      "A sequência esperada é 2.",
    );
  });
});

type ServiceGameInput = {
  sequence: number;
  server: "PLAYER";
  winner: "PLAYER" | "OPPONENT";
  validSecondServes: number;
  doubleFaults: number;
  pointsLost: number;
};

function createPlayerServiceGame({
  sequence,
  server,
  winner,
  validSecondServes,
  doubleFaults,
  pointsLost,
}: ServiceGameInput): PlayerServiceGameRecord {
  return {
    id: `game-${sequence}`,
    type: "REGULAR_GAME",
    sequence,
    setNumber: 1,
    server,
    winner,

    playerServiceStats: {
      validSecondServes,
      doubleFaults,
      pointsLost,
    },

    recordedAt: new Date("2026-08-06T12:00:00.000Z"),
  };
}

type ReturnGameInput = {
  sequence: number;
  server: "OPPONENT";
  winner: "PLAYER" | "OPPONENT";
  pointsWon: number;
};

function createPlayerReturnGame({
  sequence,
  server,
  winner,
  pointsWon,
}: ReturnGameInput): PlayerReturnGameRecord {
  return {
    id: `game-${sequence}`,
    type: "REGULAR_GAME",
    sequence,
    setNumber: 1,
    server,
    winner,

    playerReturnStats: {
      pointsWon,
    },

    recordedAt: new Date("2026-08-06T12:00:00.000Z"),
  };
}
