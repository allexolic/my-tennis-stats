import { useCallback } from "react";

import { router, useFocusEffect } from "expo-router";

import { Alert, StyleSheet, View } from "react-native";

import {
  EmptyState,
  ErrorState,
  LoadingState,
  ScreenContainer,
  ScreenHeader,
} from "@/shared/components";

import { theme } from "@/shared/theme";

import { MatchHistoryCard } from "../components/MatchHistoryCard";

import { useMatchHistory } from "../hooks/useMatchHistory";

import { createMatchHistoryViewModel } from "../view-models/createMatchHistoryViewModel";

import { matchDependencies } from "@/features/matches/infrastructure/container/matchDependencies";

export function MatchHistoryScreen() {
  const { history, isLoading, error, load } = useMatchHistory();

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  function confirmDelete(matchId: string, opponentName: string): void {
    Alert.alert(
      "Excluir partida?",
      `A partida contra ${opponentName} será excluída permanentemente.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },

        {
          text: "Excluir",
          style: "destructive",

          onPress: () => {
            void deleteMatch(matchId);
          },
        },
      ],
    );
  }

  async function deleteMatch(matchId: string): Promise<void> {
    try {
      await matchDependencies.deleteMatch.execute(matchId);

      await load();
    } catch {
      Alert.alert("Não foi possível excluir", "Tente novamente.");
    }
  }

  if (isLoading && history.length === 0) {
    return (
      <ScreenContainer scroll={false}>
        <LoadingState message="Carregando histórico..." />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer scroll={false}>
        <ErrorState
          title="Histórico indisponível"
          message={error}
          actionLabel="Tentar novamente"
          onAction={() => {
            void load();
          }}
        />
      </ScreenContainer>
    );
  }

  const viewModel = createMatchHistoryViewModel(history);

  function openSummary(matchId: string): void {
    router.push({
      pathname: "/matches/[matchId]/summary",

      params: {
        matchId,
      },
    });
  }

  return (
    <ScreenContainer>
      <ScreenHeader
        eyebrow="Suas partidas"
        title="Histórico"
        subtitle="Veja os resultados das partidas que você já registrou."
      />

      {viewModel.isEmpty ? (
        <EmptyState
          title="Nenhuma partida finalizada"
          message="Quando você concluir sua primeira partida, ela aparecerá aqui."
          actionLabel="Nova partida"
          onAction={() => {
            router.push("/matches/new");
          }}
        />
      ) : (
        <View style={styles.list}>
          {viewModel.items.map((item) => (
            <MatchHistoryCard
              key={item.id}
              item={item}
              onPress={() => {
                openSummary(item.id);
              }}
              onDelete={() => {
                confirmDelete(item.id, item.opponentName);
              }}
            />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.md,
  },
});
