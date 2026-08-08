import type { Match } from "@/features/matches/domain/entities/Match";
import type {
  RegularGameRecord,
  SetTieBreakRecord,
} from "@/features/matches/domain/entities/MatchRecord";
import type { PlayerSide } from "@/features/matches/domain/types/PlayerSide";

export class MatchBuilder {
  private match: Match = {
    id: "match-1",
    opponentName: "Adversário",
    firstServer: "PLAYER",
    status: "IN_PROGRESS",
    startedAt: new Date("2026-08-05T18:00:00.000Z"),
    records: [],
  };

  withFirstServer(firstServer: PlayerSide): MatchBuilder {
    this.match.firstServer = firstServer;
    return this;
  }

  withGameWonBy(winner: PlayerSide): MatchBuilder {
    const sequence = this.match.records.length + 1;

    const server = this.calculateServer(sequence);

    const record: RegularGameRecord =
      server === "PLAYER"
        ? {
            id: `game-${sequence}`,
            type: "REGULAR_GAME",
            sequence,
            setNumber: 1,
            server: "PLAYER",
            winner,
            playerServiceStats: {
              validSecondServes: 0,
              doubleFaults: 0,
              pointsLost: 0,
            },
            recordedAt: new Date(),
          }
        : {
            id: `game-${sequence}`,
            type: "REGULAR_GAME",
            sequence,
            setNumber: 1,
            server: "OPPONENT",
            winner,
            playerReturnStats: {
              pointsWon: 0,
            },
            recordedAt: new Date(),
          };

    this.match.records.push(record);

    return this;
  }

  withGamesWonBy(winner: PlayerSide, quantity: number): MatchBuilder {
    for (let index = 0; index < quantity; index += 1) {
      this.withGameWonBy(winner);
    }

    return this;
  }

  withSetTieBreak(
    playerPoints: number,
    opponentPoints: number,
    winner: PlayerSide,
  ): MatchBuilder {
    const sequence = this.match.records.length + 1;

    const record: SetTieBreakRecord = {
      id: `tie-break-${sequence}`,
      type: "SET_TIE_BREAK",
      sequence,
      setNumber: 1,
      winner,
      playerPoints,
      opponentPoints,
      recordedAt: new Date(),
    };

    this.match.records.push(record);

    return this;
  }

  withTiedSetAtSixGames(): MatchBuilder {
    for (let index = 0; index < 6; index += 1) {
      this.withGameWonBy("PLAYER");
      this.withGameWonBy("OPPONENT");
    }

    return this;
  }

  build(): Match {
    return structuredClone(this.match);
  }

  private calculateServer(sequence: number): PlayerSide {
    const isOddGame = sequence % 2 !== 0;

    if (isOddGame) {
      return this.match.firstServer;
    }

    return this.match.firstServer === "PLAYER" ? "OPPONENT" : "PLAYER";
  }
}
