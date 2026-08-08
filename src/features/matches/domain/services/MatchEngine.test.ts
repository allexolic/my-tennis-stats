import type { SetTieBreakRecord } from "@/features/matches/domain/entities/MatchRecord";
import { MatchBuilder } from "@/test/builders/MatchBuilder";

import { MatchEngine } from "./MatchEngine";

describe("MatchEngine", () => {
  const engine = new MatchEngine();

  describe("calculateNextServer", () => {
    it("returns the first server before any game", () => {
      const nextServer = engine.calculateNextServer("PLAYER", 0);

      expect(nextServer).toBe("PLAYER");
    });

    it("alternates the server after one game", () => {
      const nextServer = engine.calculateNextServer("PLAYER", 1);

      expect(nextServer).toBe("OPPONENT");
    });

    it("returns to the first server after two games", () => {
      const nextServer = engine.calculateNextServer("PLAYER", 2);

      expect(nextServer).toBe("PLAYER");
    });

    it("supports the opponent serving first", () => {
      const nextServer = engine.calculateNextServer("OPPONENT", 1);

      expect(nextServer).toBe("PLAYER");
    });
  });

  describe("calculateProgress", () => {
    it("starts the match at zero games", () => {
      const match = new MatchBuilder().build();

      const progress = engine.calculateProgress(match);

      expect(progress.score).toEqual({
        playerGames: 0,
        opponentGames: 0,
        winner: undefined,
      });

      expect(progress.winner).toBeUndefined();
      expect(progress.nextServer).toBe("PLAYER");

      expect(progress.nextRecordType).toBe("PLAYER_SERVICE_GAME");

      expect(progress.isMatchFinished).toBe(false);
    });

    it("calculates the score from registered games", () => {
      const match = new MatchBuilder()
        .withGameWonBy("PLAYER")
        .withGameWonBy("OPPONENT")
        .withGameWonBy("PLAYER")
        .build();

      const progress = engine.calculateProgress(match);

      expect(progress.score.playerGames).toBe(2);
      expect(progress.score.opponentGames).toBe(1);
      expect(progress.isMatchFinished).toBe(false);
    });

    it("returns a return game when the opponent serves next", () => {
      const match = new MatchBuilder()
        .withFirstServer("PLAYER")
        .withGameWonBy("PLAYER")
        .build();

      const progress = engine.calculateProgress(match);

      expect(progress.nextServer).toBe("OPPONENT");

      expect(progress.nextRecordType).toBe("PLAYER_RETURN_GAME");
    });

    it("finishes the match at 6-0", () => {
      const match = new MatchBuilder()
        .withGameWonBy("PLAYER")
        .withGameWonBy("PLAYER")
        .withGameWonBy("PLAYER")
        .withGameWonBy("PLAYER")
        .withGameWonBy("PLAYER")
        .withGameWonBy("PLAYER")
        .build();

      const progress = engine.calculateProgress(match);

      expect(progress.score).toEqual({
        playerGames: 6,
        opponentGames: 0,
        winner: "PLAYER",
      });

      expect(progress.winner).toBe("PLAYER");
      expect(progress.isMatchFinished).toBe(true);

      expect(progress.nextRecordType).toBe("MATCH_FINISHED");

      expect(progress.nextServer).toBeUndefined();
    });

    it("finishes the match at 6-4", () => {
      const match = buildMatchAtSixFour();

      const progress = engine.calculateProgress(match);

      expect(progress.score).toEqual({
        playerGames: 6,
        opponentGames: 4,
        winner: "PLAYER",
      });

      expect(progress.winner).toBe("PLAYER");
      expect(progress.isMatchFinished).toBe(true);

      expect(progress.nextRecordType).toBe("MATCH_FINISHED");

      expect(progress.nextServer).toBeUndefined();
    });

    it("keeps the match open at 6-5", () => {
      const match = buildMatchAtSixFive();

      const progress = engine.calculateProgress(match);

      expect(progress.score).toEqual({
        playerGames: 6,
        opponentGames: 5,
        winner: undefined,
      });

      expect(progress.winner).toBeUndefined();
      expect(progress.isMatchFinished).toBe(false);
    });

    it("finishes the match at 7-5", () => {
      const match = buildMatchAtSevenFive();

      const progress = engine.calculateProgress(match);

      expect(progress.score).toEqual({
        playerGames: 7,
        opponentGames: 5,
        winner: "PLAYER",
      });

      expect(progress.winner).toBe("PLAYER");
      expect(progress.isMatchFinished).toBe(true);
    });

    it("requires a tie-break at 6-6", () => {
      const match = new MatchBuilder().withTiedSetAtSixGames().build();

      const progress = engine.calculateProgress(match);

      expect(progress.score).toEqual({
        playerGames: 6,
        opponentGames: 6,
        winner: undefined,
      });

      expect(progress.nextRecordType).toBe("SET_TIE_BREAK");

      expect(progress.nextServer).toBeUndefined();
      expect(progress.isMatchFinished).toBe(false);
    });

    it("finishes the match at 7-6 after a tie-break", () => {
      const match = new MatchBuilder()
        .withTiedSetAtSixGames()
        .withSetTieBreak(7, 5, "PLAYER")
        .build();

      const progress = engine.calculateProgress(match);

      expect(progress.score).toEqual({
        playerGames: 7,
        opponentGames: 6,

        tieBreak: {
          playerPoints: 7,
          opponentPoints: 5,
        },

        winner: "PLAYER",
      });

      expect(progress.winner).toBe("PLAYER");
      expect(progress.isMatchFinished).toBe(true);

      expect(progress.nextRecordType).toBe("MATCH_FINISHED");
    });

    it("finishes the match when the opponent wins the tie-break", () => {
      const match = new MatchBuilder()
        .withTiedSetAtSixGames()
        .withSetTieBreak(5, 7, "OPPONENT")
        .build();

      const progress = engine.calculateProgress(match);

      expect(progress.score).toEqual({
        playerGames: 6,
        opponentGames: 7,

        tieBreak: {
          playerPoints: 5,
          opponentPoints: 7,
        },

        winner: "OPPONENT",
      });

      expect(progress.winner).toBe("OPPONENT");
      expect(progress.isMatchFinished).toBe(true);
    });
  });

  describe("validateNextRegularGame", () => {
    it("allows a regular game while the match is open", () => {
      const match = new MatchBuilder()
        .withGameWonBy("PLAYER")
        .withGameWonBy("OPPONENT")
        .build();

      expect(() => engine.validateNextRegularGame(match)).not.toThrow();
    });

    it("rejects a regular game at 6-6", () => {
      const match = new MatchBuilder().withTiedSetAtSixGames().build();

      expect(() => engine.validateNextRegularGame(match)).toThrow(
        "Não é possível registrar um game tradicional em 6 × 6.",
      );
    });

    it("rejects a regular game after the match finishes", () => {
      const match = buildMatchAtSixFour();

      expect(() => engine.validateNextRegularGame(match)).toThrow(
        "A partida já foi finalizada.",
      );
    });
  });

  describe("validateSetTieBreak", () => {
    it("accepts a valid tie-break", () => {
      const match = new MatchBuilder().withTiedSetAtSixGames().build();

      const tieBreak = createTieBreak({
        playerPoints: 7,
        opponentPoints: 5,
        winner: "PLAYER",
      });

      expect(() => engine.validateSetTieBreak(match, tieBreak)).not.toThrow();
    });

    it("accepts a long tie-break with a two-point difference", () => {
      const match = new MatchBuilder().withTiedSetAtSixGames().build();

      const tieBreak = createTieBreak({
        playerPoints: 12,
        opponentPoints: 10,
        winner: "PLAYER",
      });

      expect(() => engine.validateSetTieBreak(match, tieBreak)).not.toThrow();
    });

    it("rejects a tie-break without a two-point difference", () => {
      const match = new MatchBuilder().withTiedSetAtSixGames().build();

      const tieBreak = createTieBreak({
        playerPoints: 7,
        opponentPoints: 6,
        winner: "PLAYER",
      });

      expect(() => engine.validateSetTieBreak(match, tieBreak)).toThrow(
        "O placar final do tie-break é inválido.",
      );
    });

    it("rejects a tie-break when the winner does not match the score", () => {
      const match = new MatchBuilder().withTiedSetAtSixGames().build();

      const tieBreak = createTieBreak({
        playerPoints: 7,
        opponentPoints: 5,
        winner: "OPPONENT",
      });

      expect(() => engine.validateSetTieBreak(match, tieBreak)).toThrow(
        "O vencedor informado não corresponde ao placar do tie-break.",
      );
    });

    it("rejects a tie-break before 6-6", () => {
      const match = new MatchBuilder()
        .withGameWonBy("PLAYER")
        .withGameWonBy("OPPONENT")
        .build();

      const tieBreak = createTieBreak({
        playerPoints: 7,
        opponentPoints: 5,
        winner: "PLAYER",
      });

      expect(() => engine.validateSetTieBreak(match, tieBreak)).toThrow(
        "O tie-break só pode ser registrado em 6 × 6.",
      );
    });

    it("rejects another tie-break after the match finishes", () => {
      const match = new MatchBuilder()
        .withTiedSetAtSixGames()
        .withSetTieBreak(7, 5, "PLAYER")
        .build();

      const anotherTieBreak = createTieBreak({
        playerPoints: 7,
        opponentPoints: 4,
        winner: "PLAYER",
      });

      expect(() => engine.validateSetTieBreak(match, anotherTieBreak)).toThrow(
        "A partida já foi finalizada.",
      );
    });

    it.each([
      [7, 0],
      [7, 4],
      [7, 5],
      [8, 6],
      [9, 7],
      [10, 8],
      [12, 10],
    ])(
      "accepts a valid tie-break score %i-%i",
      (playerPoints, opponentPoints) => {
        const match = new MatchBuilder().withTiedSetAtSixGames().build();

        expect(() =>
          engine.validateSetTieBreak(match, {
            id: "tie-break",
            type: "SET_TIE_BREAK",
            sequence: 13,
            setNumber: 1,
            winner: "PLAYER",
            playerPoints,
            opponentPoints,
            recordedAt: new Date(),
          }),
        ).not.toThrow();
      },
    );

    it.each([
      [6, 4],
      [6, 5],
      [7, 6],
      [8, 4],
      [8, 5],
      [9, 6],
      [10, 7],
    ])(
      "rejects an invalid tie-break score %i-%i",
      (playerPoints, opponentPoints) => {
        const match = new MatchBuilder().withTiedSetAtSixGames().build();

        expect(() =>
          engine.validateSetTieBreak(match, {
            id: "tie-break",
            type: "SET_TIE_BREAK",
            sequence: 13,
            setNumber: 1,
            winner: "PLAYER",
            playerPoints,
            opponentPoints,
            recordedAt: new Date(),
          }),
        ).toThrow("O placar final do tie-break é inválido.");
      },
    );

    it("accepts a 6-8 opponent tie-break win", () => {
      const match = new MatchBuilder().withTiedSetAtSixGames().build();

      expect(() =>
        engine.validateSetTieBreak(match, {
          id: "tie-break",
          type: "SET_TIE_BREAK",
          sequence: 13,
          setNumber: 1,
          winner: "OPPONENT",
          playerPoints: 6,
          opponentPoints: 8,
          recordedAt: new Date(),
        }),
      ).not.toThrow();
    });
  });
});

function buildMatchAtSixFour() {
  return new MatchBuilder()
    .withGameWonBy("PLAYER")
    .withGameWonBy("OPPONENT")
    .withGameWonBy("PLAYER")
    .withGameWonBy("OPPONENT")
    .withGameWonBy("PLAYER")
    .withGameWonBy("OPPONENT")
    .withGameWonBy("PLAYER")
    .withGameWonBy("OPPONENT")
    .withGameWonBy("PLAYER")
    .withGameWonBy("PLAYER")
    .build();
}

function buildMatchAtSixFive() {
  return new MatchBuilder()
    .withGameWonBy("PLAYER")
    .withGameWonBy("OPPONENT")
    .withGameWonBy("PLAYER")
    .withGameWonBy("OPPONENT")
    .withGameWonBy("PLAYER")
    .withGameWonBy("OPPONENT")
    .withGameWonBy("PLAYER")
    .withGameWonBy("OPPONENT")
    .withGameWonBy("PLAYER")
    .withGameWonBy("OPPONENT")
    .withGameWonBy("PLAYER")
    .build();
}

function buildMatchAtSevenFive() {
  return new MatchBuilder()
    .withGameWonBy("PLAYER")
    .withGameWonBy("OPPONENT")
    .withGameWonBy("PLAYER")
    .withGameWonBy("OPPONENT")
    .withGameWonBy("PLAYER")
    .withGameWonBy("OPPONENT")
    .withGameWonBy("PLAYER")
    .withGameWonBy("OPPONENT")
    .withGameWonBy("PLAYER")
    .withGameWonBy("OPPONENT")
    .withGameWonBy("PLAYER")
    .withGameWonBy("PLAYER")
    .build();
}

type CreateTieBreakInput = {
  playerPoints: number;
  opponentPoints: number;
  winner: "PLAYER" | "OPPONENT";
};

function createTieBreak({
  playerPoints,
  opponentPoints,
  winner,
}: CreateTieBreakInput): SetTieBreakRecord {
  return {
    id: "tie-break-test",
    type: "SET_TIE_BREAK",
    sequence: 13,
    setNumber: 1,
    playerPoints,
    opponentPoints,
    winner,
    recordedAt: new Date("2026-08-06T12:00:00.000Z"),
  };
}
