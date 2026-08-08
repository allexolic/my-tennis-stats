import { useCallback, useState } from "react";

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { RegisterTieBreakError } from "@/features/matches/application/errors/RegisterTieBreakError";

import { matchDependencies } from "@/features/matches/infrastructure/container/matchDependencies";

import { PrimaryButton } from "@/shared/components";

import { theme } from "@/shared/theme";

import { CounterField } from "../components/CounterField";

import { MatchScoreboard } from "../components/MatchScoreboard";

import { useMatch } from "../hooks/useMatch";

type MatchRouteParams = {
  matchId?: string;
};

export function RegisterTieBreakScreen() {
  const { matchId } = useLocalSearchParams<MatchRouteParams>();

  const { match, progress, isLoading, error, load } = useMatch(matchId);

  const [playerPoints, setPlayerPoints] = useState(0);

  const [opponentPoints, setOpponentPoints] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (isLoading && !match) {
    return (
      <ScreenState>
        <ActivityIndicator size="large" color={theme.colors.primary} />

        <Text style={styles.stateText}>Carregando tie-break...</Text>
      </ScreenState>
    );
  }

  if (error || !match || !progress || !matchId) {
    return (
      <ScreenState>
        <Text style={styles.errorTitle}>Tie-break indisponível</Text>

        <Text style={styles.stateText}>
          {error ?? "A partida não está disponível."}
        </Text>

        <PrimaryButton title="Voltar" onPress={() => router.back()} />
      </ScreenState>
    );
  }

  const currentMatchId = matchId;

  if (progress.nextRecordType !== "SET_TIE_BREAK") {
    return (
      <ScreenState>
        <Text style={styles.errorTitle}>Tie-break não permitido</Text>

        <Text style={styles.stateText}>
          O placar da partida não está em 6 × 6.
        </Text>

        <PrimaryButton
          title="Voltar para a partida"
          onPress={() => router.back()}
        />
      </ScreenState>
    );
  }

  async function submit(): Promise<void> {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await matchDependencies.registerTieBreak.execute({
        matchId: currentMatchId,
        playerPoints,
        opponentPoints,
      });

      router.back();
    } catch (error) {
      if (error instanceof RegisterTieBreakError) {
        setSubmitError(error.message);
        return;
      }

      setSubmitError("Não foi possível salvar o tie-break.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.eyebrow}>Placar 6 × 6</Text>

          <Text style={styles.title}>Resultado do tie-break</Text>

          <Text style={styles.subtitle}>Informe apenas o placar final.</Text>
        </View>

        <MatchScoreboard
          opponentName={match.opponentName}
          playerGames={progress.score.playerGames}
          opponentGames={progress.score.opponentGames}
        />

        <CounterField
          label="Você"
          value={playerPoints}
          disabled={isSubmitting}
          onChange={setPlayerPoints}
        />

        <CounterField
          label={match.opponentName}
          value={opponentPoints}
          disabled={isSubmitting}
          onChange={setOpponentPoints}
        />

        {submitError ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{submitError}</Text>
          </View>
        ) : null}

        <PrimaryButton
          title="Salvar tie-break"
          loading={isSubmitting}
          onPress={() => {
            void submit();
          }}
        />
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

  subtitle: {
    marginTop: theme.spacing.sm,
    color: theme.colors.secondaryText,
    fontSize: 16,
    lineHeight: 24,
  },

  errorCard: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: "#FEE2E2",
  },

  errorText: {
    color: theme.colors.danger,
    fontSize: 15,
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
});
