import { useCallback, useState } from "react";

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { StyleSheet, Text, View } from "react-native";

import { RegisterGameError } from "@/features/matches/application/errors/RegisterGameError";

import {
  PlayerSide,
  type PlayerSide as PlayerSideType,
} from "@/features/matches/domain/types/PlayerSide";

import { matchDependencies } from "@/features/matches/infrastructure/container/matchDependencies";

import {
  ErrorState,
  InlineError,
  LoadingState,
  PrimaryButton,
} from "@/shared/components";

import { theme } from "@/shared/theme";

import { CounterField } from "../components/CounterField";

import { GameResultSelector } from "../components/GameResultSelector";

import { MatchScoreboard } from "../components/MatchScoreboard";

import { ScreenContainer } from "@/shared/components/ScreenContainer";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { useMatch } from "../hooks/useMatch";

type MatchRouteParams = {
  matchId?: string;
};

export function RegisterGameScreen() {
  const { matchId } = useLocalSearchParams<MatchRouteParams>();

  const { match, progress, isLoading, error, load } = useMatch(matchId);

  const [winner, setWinner] = useState<PlayerSideType>(PlayerSide.PLAYER);

  const [validSecondServes, setValidSecondServes] = useState(0);

  const [doubleFaults, setDoubleFaults] = useState(0);

  const [pointsLost, setPointsLost] = useState(0);

  const [pointsWon, setPointsWon] = useState(0);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (isLoading && !match) {
    return (
      <ScreenContainer scroll={false}>
        <LoadingState message="Carregando game..." />
      </ScreenContainer>
    );
  }

  if (error || !match || !progress || !matchId) {
    return (
      <ScreenContainer scroll={false}>
        <ErrorState
          title="Não foi possível registrar o game"
          message={error ?? "A partida não está disponível."}
          actionLabel="Voltar"
          onAction={() => {
            router.back();
          }}
        />
      </ScreenContainer>
    );
  }

  if (progress.isMatchFinished) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.centeredState}>
          <Text style={styles.errorTitle}> Partida finalizada </Text>
          <Text style={styles.stateText}>
            Não é possível registrar novos games.
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

  if (progress.nextRecordType === "SET_TIE_BREAK") {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.centeredState}>
          <Text style={styles.errorTitle}> Tie-break necessário </Text>
          <Text style={styles.stateText}>
            O placar está em 6 × 6. O próximo registro deve ser o tie-break.
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

  const isPlayerServing = progress.nextServer === PlayerSide.PLAYER;
  const currentMatchId = matchId;

  async function submit(): Promise<void> {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      if (isPlayerServing) {
        await matchDependencies.registerGame.execute({
          matchId: currentMatchId,
          winner,
          validSecondServes,
          doubleFaults,
          pointsLost,
        });
      } else {
        await matchDependencies.registerGame.execute({
          matchId: currentMatchId,
          winner,
          pointsWon,
        });
      }

      router.back();
    } catch (error) {
      if (error instanceof RegisterGameError) {
        setSubmitError(error.message);
        return;
      }

      setSubmitError("Não foi possível salvar o game.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenContainer>
      <ScreenHeader
        eyebrow={`Game ${match.records.length + 1}`}
        title={isPlayerServing ? "Seu saque" : "Saque do adversário"}
        subtitle="Registre apenas o que você consegue lembrar ao final do game."
      />
      <MatchScoreboard
        opponentName={match.opponentName}
        playerGames={progress.score.playerGames}
        opponentGames={progress.score.opponentGames}
      />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}> Resultado do game </Text>
        <GameResultSelector
          value={winner}
          disabled={isSubmitting}
          onChange={setWinner}
        />
      </View>
      {isPlayerServing ? (
        <>
          <CounterField
            label="Segundos serviços válidos"
            value={validSecondServes}
            disabled={isSubmitting}
            onChange={setValidSecondServes}
          />
          <CounterField
            label="Duplas faltas"
            value={doubleFaults}
            disabled={isSubmitting}
            onChange={setDoubleFaults}
          />
          <CounterField
            label="Pontos perdidos"
            value={pointsLost}
            disabled={isSubmitting}
            onChange={setPointsLost}
          />
        </>
      ) : (
        <CounterField
          label="Pontos que ganhei"
          value={pointsWon}
          disabled={isSubmitting}
          onChange={setPointsWon}
        />
      )}
      {submitError ? <InlineError message={submitError} /> : null}
      <PrimaryButton
        title="Salvar game"
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
  section: { gap: theme.spacing.sm },
  sectionTitle: { ...theme.typography.bodyStrong, color: theme.colors.text },
  errorCard: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.dangerSurface,
  },
  errorText: { ...theme.typography.body, color: theme.colors.danger },
});
