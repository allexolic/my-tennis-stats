import type { Match } from "@/features/matches/domain/entities/Match";
import type { MatchProgress } from "@/features/matches/domain/types/MatchProgress";

import { createMatchViewModel } from "./createMatchViewModel";

describe("createMatchViewModel", () => {
  it("maps a regular game state", () => {
    const viewModel = createMatchViewModel(createMatch(), createProgress());

    expect(viewModel).toEqual({
      id: "match-1",
      opponentName: "Carlos",
      playerGames: 2,
      opponentGames: 1,
      nextServerLabel: "Adversário",
      nextActionLabel: "Registrar game",
      winnerLabel: null,
      isTieBreak: false,
      isFinished: false,
    });
  });

  it("maps a tie-break state", () => {
    const progress = createProgress();

    progress.score.playerGames = 6;
    progress.score.opponentGames = 6;
    progress.nextServer = undefined;
    progress.nextRecordType = "SET_TIE_BREAK";

    const viewModel = createMatchViewModel(createMatch(), progress);

    expect(viewModel.nextServerLabel).toBeNull();

    expect(viewModel.nextActionLabel).toBe("Registrar tie-break");

    expect(viewModel.isTieBreak).toBe(true);
  });

  it("maps a finished match", () => {
    const progress = createProgress();

    progress.score = {
      playerGames: 6,
      opponentGames: 3,
      winner: "PLAYER",
    };

    progress.winner = "PLAYER";
    progress.nextServer = undefined;
    progress.nextRecordType = "MATCH_FINISHED";

    progress.isMatchFinished = true;

    const viewModel = createMatchViewModel(createMatch(), progress);

    expect(viewModel.playerGames).toBe(6);
    expect(viewModel.opponentGames).toBe(3);

    expect(viewModel.nextServerLabel).toBeNull();

    expect(viewModel.nextActionLabel).toBe("Ver resumo");

    expect(viewModel.winnerLabel).toBe("Você");

    expect(viewModel.isFinished).toBe(true);
  });

  it("uses the opponent name when the opponent wins", () => {
    const progress = createProgress();

    progress.score = {
      playerGames: 4,
      opponentGames: 6,
      winner: "OPPONENT",
    };

    progress.winner = "OPPONENT";
    progress.nextServer = undefined;
    progress.nextRecordType = "MATCH_FINISHED";

    progress.isMatchFinished = true;

    const viewModel = createMatchViewModel(createMatch(), progress);

    expect(viewModel.winnerLabel).toBe("Carlos");
  });
});

function createMatch(): Match {
  return {
    id: "match-1",
    opponentName: "Carlos",
    firstServer: "PLAYER",
    status: "IN_PROGRESS",
    startedAt: new Date(),
    records: [],
  };
}

function createProgress(): MatchProgress {
  return {
    score: {
      playerGames: 2,
      opponentGames: 1,
      winner: undefined,
    },

    winner: undefined,
    nextServer: "OPPONENT",
    nextRecordType: "PLAYER_RETURN_GAME",

    isMatchFinished: false,
  };
}
