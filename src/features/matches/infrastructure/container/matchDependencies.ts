import { SystemClock } from "@/shared/infrastructure/SystemClock";
import { UuidGenerator } from "@/shared/infrastructure/UuidGenerator";

import { CreateMatch } from "../../application/use-cases/CreateMatch";
import { GetActiveMatch } from "../../application/use-cases/GetActiveMatch";
import { DrizzleMatchRepository } from "../persistence";

import { GetMatchById } from "../../application/use-cases/GetMatchById";

import { RegisterGame } from "../../application/use-cases/RegisterGame";
import { MatchEngine } from "../../domain/services/MatchEngine";

import { RegisterTieBreak } from "../../application/use-cases/RegisterTieBreak";
import { MatchRecordValidator } from "../../domain/services/MatchRecordValidator";

import { GetMatchSummary } from "../../application/use-cases/GetMatchSummary";

import { StatisticsCalculator } from "../../domain/services/StatisticsCalculator";

import { GetMatchHistory } from "../../application/use-cases/GetMatchHistory";

import { DeleteMatch } from "../../application/use-cases/DeleteMatch";

const matchRepository = new DrizzleMatchRepository();

const clock = new SystemClock();
const idGenerator = new UuidGenerator();
const matchEngine = new MatchEngine();
const matchRecordValidator = new MatchRecordValidator(matchEngine);
const statisticsCalculator = new StatisticsCalculator();

export const matchDependencies = {
  repository: matchRepository,

  createMatch: new CreateMatch(matchRepository, idGenerator, clock),

  getActiveMatch: new GetActiveMatch(matchRepository),

  getMatchById: new GetMatchById(matchRepository, matchEngine),

  registerGame: new RegisterGame(
    matchRepository,
    matchEngine,
    matchRecordValidator,
    idGenerator,
    clock,
  ),

  registerTieBreak: new RegisterTieBreak(
    matchRepository,
    matchEngine,
    matchRecordValidator,
    idGenerator,
    clock,
  ),

  getMatchSummary: new GetMatchSummary(
    matchRepository,
    matchEngine,
    statisticsCalculator,
  ),

  getMatchHistory: new GetMatchHistory(matchRepository, matchEngine),

  deleteMatch: new DeleteMatch(matchRepository),
};
