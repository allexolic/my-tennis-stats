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

import { RegisterGameError } from "@/features/matches/application/errors/RegisterGameError";

import {
    PlayerSide,
    type PlayerSide as PlayerSideType,
} from "@/features/matches/domain/types/PlayerSide";

import { matchDependencies } from "@/features/matches/infrastructure/container/matchDependencies";

import { PrimaryButton } from "@/shared/components";

import { theme } from "@/shared/theme";

import { CounterField } from "../components/CounterField";

import { GameResultSelector } from "../components/GameResultSelector";

import { MatchScoreboard } from "../components/MatchScoreboard";

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
      <ScreenState>
        <ActivityIndicator size="large" color={theme.colors.primary} />

        <Text style={styles.stateText}>Carregando game...</Text>
      </ScreenState>
    );
  }

  if (error || !match || !progress || !matchId) {
    return (
      <ScreenState>
        <Text style={styles.errorTitle}>Não foi possível registrar o game</Text>

        <Text style={styles.stateText}>
          {error ?? "A partida não está disponível."}
        </Text>

        <PrimaryButton
          title="Voltar"
          onPress={() => {
            router.back();
          }}
        />
      </ScreenState>
    );
  }

  if (progress.isMatchFinished) {
    return (
      <ScreenState>
        <Text style={styles.errorTitle}>Partida finalizada</Text>

        <Text style={styles.stateText}>
          Não é possível registrar novos games.
        </Text>

        <PrimaryButton
          title="Voltar para a partida"
          onPress={() => {
            router.back();
          }}
        />
      </ScreenState>
    );
  }

  if (progress.nextRecordType === "SET_TIE_BREAK") {
    return (
      <ScreenState>
        <Text style={styles.errorTitle}>Tie-break necessário</Text>

        <Text style={styles.stateText}>
          O placar está em 6 × 6. O próximo registro deve ser o tie-break.
        </Text>

        <PrimaryButton
          title="Voltar para a partida"
          onPress={() => {
            router.back();
          }}
        />
      </ScreenState>
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
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.eyebrow}>Game {match.records.length + 1}</Text>

          <Text style={styles.title}>
            {isPlayerServing ? "Seu saque" : "Saque do adversário"}
          </Text>

          <Text style={styles.subtitle}>
            Registre apenas o que você consegue lembrar ao final do game.
          </Text>
        </View>

        <MatchScoreboard
          opponentName={match.opponentName}
          playerGames={progress.score.playerGames}
          opponentGames={progress.score.opponentGames}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resultado do game</Text>

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

        {submitError ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{submitError}</Text>
          </View>
        ) : null}

        <PrimaryButton
          title="Salvar game"
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

  section: {
    gap: theme.spacing.sm,
  },

  sectionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },

  errorCard: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: "#FEE2E2",
  },

  errorText: {
    color: theme.colors.danger,
    fontSize: 15,
    lineHeight: 22,
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
