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

import { StatisticRow } from "../components/StatisticRow";

import { useMatchSummary } from "../hooks/useMatchSummary";

import { createMatchSummaryViewModel } from "../view-models/createMatchSummaryViewModel";

type MatchRouteParams = {
  matchId?: string;
};

export function MatchSummaryScreen() {
  const { matchId } = useLocalSearchParams<MatchRouteParams>();

  const { summary, isLoading, error, load } = useMatchSummary(matchId);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (isLoading && !summary) {
    return (
      <ScreenState>
        <ActivityIndicator size="large" color={theme.colors.primary} />

        <Text style={styles.stateText}>Carregando resumo...</Text>
      </ScreenState>
    );
  }

  if (error || !summary) {
    return (
      <ScreenState>
        <Text style={styles.errorTitle}>Resumo indisponível</Text>

        <Text style={styles.stateText}>
          {error ?? "Não foi possível carregar os dados da partida."}
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

  const viewModel = createMatchSummaryViewModel(summary);

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.eyebrow}>Resumo da partida</Text>

          <Text style={styles.title}>vs. {viewModel.opponentName}</Text>
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.result}>{viewModel.resultLabel}</Text>

          <Text style={styles.winner}>{viewModel.winnerLabel}</Text>

          <Text style={styles.duration}>
            Duração: {viewModel.durationLabel}
          </Text>

          {viewModel.tieBreakLabel ? (
            <Text style={styles.tieBreak}>
              Tie-break: {viewModel.tieBreakLabel}
            </Text>
          ) : null}
        </View>

        <SummarySection title="Saque">
          <StatisticRow
            label="Games de saque"
            value={viewModel.service.gamesPlayed}
          />

          <StatisticRow
            label="Games confirmados"
            value={viewModel.service.gamesWon}
          />

          <StatisticRow
            label="Games perdidos"
            value={viewModel.service.gamesLost}
          />

          <StatisticRow
            label="Aproveitamento"
            value={viewModel.service.holdPercentageLabel}
          />

          <StatisticRow
            label="Segundos serviços válidos"
            value={viewModel.service.validSecondServes}
          />

          <StatisticRow
            label="Duplas faltas"
            value={viewModel.service.doubleFaults}
          />

          <StatisticRow
            label="Pontos perdidos"
            value={viewModel.service.pointsLost}
          />
        </SummarySection>

        <SummarySection title="Devolução">
          <StatisticRow
            label="Games devolvendo"
            value={viewModel.return.gamesPlayed}
          />

          <StatisticRow label="Breaks" value={viewModel.return.breaks} />

          <StatisticRow
            label="Aproveitamento"
            value={viewModel.return.breakPercentageLabel}
          />

          <StatisticRow
            label="Pontos ganhos"
            value={viewModel.return.pointsWon}
          />
        </SummarySection>

        <PrimaryButton
          title="Voltar ao início"
          onPress={() => {
            router.replace("/");
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

type SummarySectionProps = {
  title: string;
  children: React.ReactNode;
};

function SummarySection({ title, children }: SummarySectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.sectionCard}>{children}</View>
    </View>
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

  resultCard: {
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
  },

  result: {
    color: theme.colors.text,
    fontSize: 40,
    fontWeight: "800",
  },

  winner: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
  },

  duration: {
    color: theme.colors.secondaryText,
    fontSize: 15,
  },

  tieBreak: {
    color: theme.colors.secondaryText,
    fontSize: 15,
  },

  section: {
    gap: theme.spacing.sm,
  },

  sectionTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
  },

  sectionCard: {
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
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
