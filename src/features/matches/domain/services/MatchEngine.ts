import type { Match } from "../entities/Match";
import type {
  RegularGameRecord,
  SetTieBreakRecord,
} from "../entities/MatchRecord";
import { MatchDomainError } from "../errors/MatchDomainError";
import type {
  CurrentSetScore,
  MatchProgress,
  NextRecordType,
} from "../types/MatchProgress";
import { MatchRecordType } from "../types/MatchRecordType";
import { PlayerSide } from "../types/PlayerSide";
import { oppositePlayer } from "../utils/oppositePlayer";
import { validateSetTieBreak } from "../validation/ValidateSetTieBreak";

export class MatchEngine {
  calculateProgress(match: Match): MatchProgress {
    const regularGames = this.getRegularGames(match);
    const tieBreak = this.getSetTieBreak(match);

    const playerGames = regularGames.filter(
      (game) => game.winner === PlayerSide.PLAYER,
    ).length;

    const opponentGames = regularGames.filter(
      (game) => game.winner === PlayerSide.OPPONENT,
    ).length;

    const score = this.calculateScore(playerGames, opponentGames, tieBreak);

    if (score.winner) {
      return {
        score,
        winner: score.winner,
        nextServer: undefined,
        nextRecordType: "MATCH_FINISHED",
        isMatchFinished: true,
      };
    }

    if (playerGames === 6 && opponentGames === 6) {
      return {
        score,
        winner: undefined,
        nextServer: undefined,
        nextRecordType: MatchRecordType.SET_TIE_BREAK,
        isMatchFinished: false,
      };
    }

    const nextServer = this.calculateNextServer(
      match.firstServer,
      regularGames.length,
    );

    return {
      score,
      winner: undefined,
      nextServer,
      nextRecordType: this.calculateNextRecordType(nextServer),
      isMatchFinished: false,
    };
  }

  validateNextRegularGame(match: Match): void {
    const progress = this.calculateProgress(match);

    if (progress.isMatchFinished) {
      throw new MatchDomainError("A partida já foi finalizada.");
    }

    if (progress.nextRecordType === MatchRecordType.SET_TIE_BREAK) {
      throw new MatchDomainError(
        "Não é possível registrar um game tradicional em 6 × 6.",
      );
    }
  }

  validateSetTieBreak(match: Match, tieBreak: SetTieBreakRecord): void {
    const progress = this.calculateProgress(match);

    if (progress.isMatchFinished) {
      throw new MatchDomainError("A partida já foi finalizada.");
    }

    if (progress.nextRecordType !== MatchRecordType.SET_TIE_BREAK) {
      throw new MatchDomainError(
        "O tie-break só pode ser registrado em 6 × 6.",
      );
    }
    if (
      !this.isValidTieBreakScore(tieBreak.playerPoints, tieBreak.opponentPoints)
    ) {
      throw new MatchDomainError("O placar final do tie-break é inválido.");
    }

    validateSetTieBreak({
      playerPoints: tieBreak.playerPoints,
      opponentPoints: tieBreak.opponentPoints,
      winner: tieBreak.winner,
    });
  }

  calculateNextServer(
    firstServer: PlayerSide,
    regularGamesPlayed: number,
  ): PlayerSide {
    if (regularGamesPlayed % 2 === 0) {
      return firstServer;
    }

    return oppositePlayer(firstServer);
  }

  private calculateScore(
    playerGames: number,
    opponentGames: number,
    tieBreak?: SetTieBreakRecord,
  ): CurrentSetScore {
    if (tieBreak) {
      return {
        playerGames: tieBreak.winner === PlayerSide.PLAYER ? 7 : 6,

        opponentGames: tieBreak.winner === PlayerSide.OPPONENT ? 7 : 6,

        tieBreak: {
          playerPoints: tieBreak.playerPoints,
          opponentPoints: tieBreak.opponentPoints,
        },

        winner: tieBreak.winner,
      };
    }

    return {
      playerGames,
      opponentGames,
      winner: this.calculateMatchWinner(playerGames, opponentGames),
    };
  }

  private calculateMatchWinner(
    playerGames: number,
    opponentGames: number,
  ): PlayerSide | undefined {
    const highestScore = Math.max(playerGames, opponentGames);

    const difference = Math.abs(playerGames - opponentGames);

    if (highestScore < 6) {
      return undefined;
    }

    if (playerGames === 6 && opponentGames === 6) {
      return undefined;
    }

    if (difference < 2) {
      return undefined;
    }

    return playerGames > opponentGames
      ? PlayerSide.PLAYER
      : PlayerSide.OPPONENT;
  }

  private getRegularGames(match: Match): RegularGameRecord[] {
    return match.records.filter(
      (record): record is RegularGameRecord =>
        record.type === MatchRecordType.REGULAR_GAME,
    );
  }

  private getSetTieBreak(match: Match): SetTieBreakRecord | undefined {
    return match.records.find(
      (record): record is SetTieBreakRecord =>
        record.type === MatchRecordType.SET_TIE_BREAK,
    );
  }

  private calculateNextRecordType(server: PlayerSide): NextRecordType {
    return server === PlayerSide.PLAYER
      ? "PLAYER_SERVICE_GAME"
      : "PLAYER_RETURN_GAME";
  }

  private isValidTieBreakScore(
    playerPoints: number,
    opponentPoints: number,
  ): boolean {
    const winnerPoints = Math.max(playerPoints, opponentPoints);

    const loserPoints = Math.min(playerPoints, opponentPoints);

    const expectedWinnerPoints = loserPoints < 6 ? 7 : loserPoints + 2;

    return winnerPoints === expectedWinnerPoints;
  }
}
