import { useCallback } from "react";

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/shared/components";
import { theme } from "@/shared/theme";

import { MatchRecordList } from "../components/MatchRecordList";
import { MatchScoreboard } from "../components/MatchScoreboard";
import { NextMatchActionCard } from "../components/NextMatchActionCard";
import { useMatch } from "../hooks/useMatch";
import { createMatchViewModel } from "../view-models/createMatchViewModel";

import { FinishedMatchCard } from "../components/FinishedMatchCard";

import { TieBreakActionCard } from "../components/TieBreakActionCard";

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
      <ScreenState>
        <ActivityIndicator size="large" color={theme.colors.primary} />

        <Text style={styles.stateText}>Carregando partida...</Text>
      </ScreenState>
    );
  }

  if (error || !match || !progress) {
    return (
      <ScreenState>
        <Text style={styles.errorTitle}>Não foi possível abrir a partida</Text>

        <Text style={styles.stateText}>
          {error ?? "A partida não está disponível."}
        </Text>

        <PrimaryButton
          title="Voltar ao início"
          onPress={() => {
            router.replace("/");
          }}
        />
      </ScreenState>
    );
  }

  const viewModel = createMatchViewModel(match, progress);
  const currentMatch = match;

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

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.eyebrow}>Partida em andamento</Text>

          <Text style={styles.title}>vs. {viewModel.opponentName}</Text>
        </View>

        <MatchScoreboard
          opponentName={viewModel.opponentName}
          playerGames={viewModel.playerGames}
          opponentGames={viewModel.opponentGames}
        />

        {viewModel.isFinished && viewModel.winnerLabel ? (
          <FinishedMatchCard
            winnerLabel={viewModel.winnerLabel}
            onViewSummary={() => {
              router.replace({
                pathname: "/matches/[matchId]/summary",
                params: {
                  matchId: currentMatch.id,
                },
              });
            }}
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

        <MatchRecordList records={match.records} />

        {isLoading ? (
          <Text style={styles.refreshing}>Atualizando...</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

type ScreenStateProps = {
  children: React.ReactNode;
};

function ScreenState({ children }: ScreenStateProps) {
  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
      <View style={styles.stateContainer}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    gap: theme.spacing.lg,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },

  eyebrow: {
    color: theme.colors.secondaryText,
    fontSize: 14,
    fontWeight: "600",
  },

  title: {
    marginTop: theme.spacing.xs,
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: "700",
  },

  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },

  stateText: {
    color: theme.colors.secondaryText,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },

  errorTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  refreshing: {
    color: theme.colors.secondaryText,
    fontSize: 13,
    textAlign: "center",
  },
});
