import { useCallback } from "react";

import { router, useFocusEffect } from "expo-router";

import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { ActiveMatchCard } from "@/features/matches/presentation/components/ActiveMatchCard";

import { useActiveMatch } from "@/features/matches/presentation/hooks/useActiveMatch";

import { PrimaryButton } from "@/shared/components";

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
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>Tennis Stats</Text>

          <Text style={styles.subtitle}>
            Estatísticas simples para suas partidas de tênis.
          </Text>
        </View>

        <View style={styles.actions}>
          {isLoading ? (
            <View style={styles.loading}>
              <ActivityIndicator color={theme.colors.primary} />

              <Text style={styles.loadingText}>Verificando partida...</Text>
            </View>
          ) : null}

          {!isLoading && error ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: theme.spacing.lg,
  },

  title: {
    marginTop: theme.spacing.xl,
    color: theme.colors.text,
    fontSize: 36,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: theme.spacing.sm,
    color: theme.colors.secondaryText,
    fontSize: 18,
    lineHeight: 26,
  },

  actions: {
    gap: theme.spacing.md,
  },

  loading: {
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  loadingText: {
    color: theme.colors.secondaryText,
    fontSize: 15,
  },

  errorCard: {
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
  },

  errorText: {
    color: theme.colors.danger,
    fontSize: 15,
    lineHeight: 22,
  },
});
