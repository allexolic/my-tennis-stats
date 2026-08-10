import { useCallback, useState } from "react";

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { StyleSheet, Text, View } from "react-native";

import { RegisterTieBreakError } from "@/features/matches/application/errors/RegisterTieBreakError";

import { matchDependencies } from "@/features/matches/infrastructure/container/matchDependencies";

import {
  ErrorState,
  InlineError,
  LoadingState,
  PrimaryButton,
} from "@/shared/components";

import { theme } from "@/shared/theme";

import { CounterField } from "../components/CounterField";

import { MatchScoreboard } from "../components/MatchScoreboard";

import { ScreenContainer } from "@/shared/components/ScreenContainer";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
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
      <ScreenContainer scroll={false}>
        <LoadingState message="Carregando tie-break..." />
      </ScreenContainer>
    );
  }

  if (error || !match || !progress || !matchId) {
    return (
      <ScreenContainer scroll={false}>
        <ErrorState
          title="Tie-break indisponível"
          message="A partida não está disponível"
          actionLabel="Voltar"
          onAction={() => router.back()}
        />
      </ScreenContainer>
    );
  }

  const currentMatchId = matchId;

  if (progress.nextRecordType !== "SET_TIE_BREAK") {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.centeredState}>
          <Text style={styles.errorTitle}> Tie-break não permitido </Text>
          <Text style={styles.stateText}>
            O placar da partida não está em 6 × 6.
          </Text>
          <PrimaryButton
            title="Voltar para a partida"
            onPress={() => {
              router.back();
            }}
          />
        </View>
      </ScreenContainer>
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
    <ScreenContainer>
      <ScreenHeader
        eyebrow="Placar 6 × 6"
        title="Resultado do tie-break"
        subtitle="Informe apenas o placar final."
      />
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
      {submitError ? <InlineError message={submitError} /> : null}
      <PrimaryButton
        title="Salvar tie-break"
        loading={isSubmitting}
        onPress={() => {
          void submit();
        }}
      />
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
  errorCard: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.dangerSurface,
  },
  errorText: { ...theme.typography.body, color: theme.colors.danger },
});
