import { useCallback } from "react";

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { StyleSheet, Text } from "react-native";

import { ErrorState, LoadingState } from "@/shared/components";

import { theme } from "@/shared/theme";

import { FinishedMatchCard } from "../components/FinishedMatchCard";

import { MatchRecordList } from "../components/MatchRecordList";

import { MatchScoreboard } from "../components/MatchScoreboard";

import { NextMatchActionCard } from "../components/NextMatchActionCard";

import { TieBreakActionCard } from "../components/TieBreakActionCard";

import { useMatch } from "../hooks/useMatch";

import { ScreenContainer } from "@/shared/components/ScreenContainer";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { createMatchViewModel } from "../view-models/createMatchViewModel";

type MatchRouteParams = {
  matchId?: string;
};

export function MatchScreen() {
  const { matchId } = useLocalSearchParams<MatchRouteParams>();

  const { match, progress, isLoading, error, load } = useMatch(matchId);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (isLoading && !match) {
    return (
      <ScreenContainer scroll={false}>
        <LoadingState message="Carregando partida..." />
      </ScreenContainer>
    );
  }

  if (error || !match || !progress) {
    return (
      <ScreenContainer scroll={false}>
        <ErrorState
          title="Não foi possível abrir a partida"
          message={error ?? "A partida não está disponível."}
          actionLabel="Voltar ao início"
          onAction={() => {
            router.replace("/");
          }}
        />
      </ScreenContainer>
    );
  }

  const currentMatch = match;

  const viewModel = createMatchViewModel(currentMatch, progress);

  function handleNextAction(): void {
    if (viewModel.isFinished) {
      return;
    }

    if (viewModel.isTieBreak) {
      router.push({
        pathname: "/matches/[matchId]/register-tie-break",

        params: {
          matchId: currentMatch.id,
        },
      });

      return;
    }

    router.push({
      pathname: "/matches/[matchId]/register-game",

      params: {
        matchId: currentMatch.id,
      },
    });
  }

  function handleViewSummary(): void {
    router.replace({
      pathname: "/matches/[matchId]/summary",

      params: {
        matchId: currentMatch.id,
      },
    });
  }

  return (
    <ScreenContainer>
      <ScreenHeader
        eyebrow={
          viewModel.isFinished ? "Partida finalizada" : "Partida em andamento"
        }
        title={`vs. ${viewModel.opponentName}`}
      />

      <MatchScoreboard
        opponentName={viewModel.opponentName}
        playerGames={viewModel.playerGames}
        opponentGames={viewModel.opponentGames}
      />

      {viewModel.isFinished && viewModel.winnerLabel ? (
        <FinishedMatchCard
          winnerLabel={viewModel.winnerLabel}
          onViewSummary={handleViewSummary}
        />
      ) : viewModel.isTieBreak ? (
        <TieBreakActionCard onPress={handleNextAction} />
      ) : (
        <NextMatchActionCard
          nextServerLabel={viewModel.nextServerLabel ?? ""}
          actionLabel={viewModel.nextActionLabel}
          onPress={handleNextAction}
        />
      )}

      <MatchRecordList records={currentMatch.records} />

      {isLoading ? <Text style={styles.refreshing}>Atualizando...</Text> : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centeredState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
  },

  stateText: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    textAlign: "center",
  },

  errorTitle: {
    ...theme.typography.sectionTitle,
    color: theme.colors.text,
    textAlign: "center",
  },

  refreshing: {
    ...theme.typography.caption,
    color: theme.colors.secondaryText,
    textAlign: "center",
  },
});
