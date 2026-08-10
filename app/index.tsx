import { useCallback } from "react";

import { router, useFocusEffect } from "expo-router";

import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { ActiveMatchCard } from "@/features/matches/presentation/components/ActiveMatchCard";

import { useActiveMatch } from "@/features/matches/presentation/hooks/useActiveMatch";

import { PrimaryButton } from "@/shared/components";

import { ScreenContainer } from "@/shared/components/ScreenContainer";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { theme } from "@/shared/theme";

export default function HomeScreen() {
  const { match, isLoading, error, load } = useActiveMatch();

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  function continueMatch(): void {
    if (!match) {
      return;
    }

    router.push({
      pathname: "/matches/[matchId]",
      params: {
        matchId: match.id,
      },
    });
  }

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.layout}>
        <ScreenHeader
          title="Tennis Stats"
          subtitle="Estatísticas simples para suas partidas de tênis."
        />
        <View style={styles.actions}>
          {isLoading ? (
            <View style={styles.loading}>
              <ActivityIndicator color={theme.colors.primary} />
              <Text style={styles.loadingText}>Verificando partida...</Text>
            </View>
          ) : null}
          {!isLoading && error ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}> {error} </Text>
              <PrimaryButton
                title="Tentar novamente"
                onPress={() => {
                  void load();
                }}
              />
            </View>
          ) : null}
          {!isLoading && !error && match ? (
            <ActiveMatchCard match={match} onContinue={continueMatch} />
          ) : null}
          {!isLoading && !error && !match ? (
            <PrimaryButton
              title="Nova partida"
              onPress={() => {
                router.push("/matches/new");
              }}
            />
          ) : null}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  layout: { flex: 1, justifyContent: "space-between" },
  actions: { gap: theme.spacing.md },
  loading: { alignItems: "center", gap: theme.spacing.sm },
  loadingText: {
    ...theme.typography.caption,
    color: theme.colors.secondaryText,
  },
  errorCard: {
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
  },
  errorText: { ...theme.typography.body, color: theme.colors.danger },
});
