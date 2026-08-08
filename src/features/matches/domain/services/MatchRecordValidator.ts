import type { Match } from "../entities/Match";
import type {
    MatchRecord,
    PlayerReturnGameRecord,
    PlayerServiceGameRecord,
    RegularGameRecord,
    SetTieBreakRecord,
} from "../entities/MatchRecord";
import { MatchDomainError } from "../errors/MatchDomainError";
import type { MatchProgress } from "../types/MatchProgress";
import { MatchEngine } from "./MatchEngine";

export class MatchRecordValidator {
  constructor(private readonly engine = new MatchEngine()) {}

  validateNextRecord(match: Match, record: MatchRecord): void {
    this.validateMatchStatus(match);
    this.validateCommonFields(match, record);

    if (record.type === "REGULAR_GAME") {
      this.validateRegularGame(match, record);
      return;
    }

    this.validateTieBreak(match, record);
  }

  validateMatch(match: Match): MatchProgress {
    const replayMatch: Match = {
      ...match,
      status: "IN_PROGRESS",
      records: [],
    };

    for (const record of match.records) {
      this.validateNextRecord(replayMatch, record);

      replayMatch.records.push(record);
    }

    return this.engine.calculateProgress(replayMatch);
  }

  private validateMatchStatus(match: Match): void {
    if (match.status !== "IN_PROGRESS") {
      throw new MatchDomainError(
        "Não é possível adicionar registros a uma partida encerrada.",
      );
    }
  }

  private validateCommonFields(match: Match, record: MatchRecord): void {
    const expectedSequence = match.records.length + 1;

    if (record.sequence !== expectedSequence) {
      throw new MatchDomainError(`A sequência esperada é ${expectedSequence}.`);
    }

    if (record.setNumber !== 1) {
      throw new MatchDomainError(
        "A V1 permite registros apenas no primeiro set.",
      );
    }

    if (record.winner !== "PLAYER" && record.winner !== "OPPONENT") {
      throw new MatchDomainError("O vencedor do registro é inválido.");
    }
  }

  private validateRegularGame(match: Match, record: RegularGameRecord): void {
    this.engine.validateNextRegularGame(match);

    const progress = this.engine.calculateProgress(match);

    if (record.server !== progress.nextServer) {
      throw new MatchDomainError(
        "O sacador informado não corresponde à sequência da partida.",
      );
    }

    if (record.server === "PLAYER") {
      this.validatePlayerServiceGame(record);
      return;
    }

    this.validatePlayerReturnGame(record);
  }

  private validatePlayerServiceGame(record: PlayerServiceGameRecord): void {
    const { validSecondServes, doubleFaults, pointsLost } =
      record.playerServiceStats;

    this.validateNonNegativeInteger(
      validSecondServes,
      "Segundos serviços válidos",
    );

    this.validateNonNegativeInteger(doubleFaults, "Duplas faltas");

    this.validateNonNegativeInteger(pointsLost, "Pontos perdidos");

    if (doubleFaults > pointsLost) {
      throw new MatchDomainError(
        "Duplas faltas não podem superar os pontos perdidos.",
      );
    }
  }

  private validatePlayerReturnGame(record: PlayerReturnGameRecord): void {
    this.validateNonNegativeInteger(
      record.playerReturnStats.pointsWon,
      "Pontos ganhos",
    );
  }

  private validateTieBreak(match: Match, record: SetTieBreakRecord): void {
    this.engine.validateSetTieBreak(match, record);
  }

  private validateNonNegativeInteger(value: number, fieldName: string): void {
    if (!Number.isInteger(value)) {
      throw new MatchDomainError(`${fieldName} deve ser um número inteiro.`);
    }

    if (value < 0) {
      throw new MatchDomainError(`${fieldName} não pode ser negativo.`);
    }
  }
}
