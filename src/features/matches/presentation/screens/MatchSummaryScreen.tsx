import { useCallback } from "react";

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/shared/components";

import { theme } from "@/shared/theme";

import { StatisticRow } from "../components/StatisticRow";

import { useMatchSummary } from "../hooks/useMatchSummary";

import { Card } from "@/shared/components/Card";
import { ScreenContainer } from "@/shared/components/ScreenContainer";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
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
      <ScreenContainer scroll={false}>
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={theme.colors.primary} />

          <Text style={styles.stateText}>Carregando resumo...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (error || !summary) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.centeredState}>
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
        </View>
      </ScreenContainer>
    );
  }

  const viewModel = createMatchSummaryViewModel(summary);

  return (
    <ScreenContainer>
      <ScreenHeader
        eyebrow="Resumo da partida"
        title={`vs. ${viewModel.opponentName}`}
      />

      <Card>
        <View style={styles.resultContent}>
          <Text style={styles.result}>{viewModel.resultLabel}</Text>

          <Text style={styles.winner}>{viewModel.winnerLabel}</Text>

          <Text style={styles.secondaryText}>
            Duração: {viewModel.durationLabel}
          </Text>

          {viewModel.tieBreakLabel ? (
            <Text style={styles.secondaryText}>
              Tie-break: {viewModel.tieBreakLabel}
            </Text>
          ) : null}
        </View>
      </Card>

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

        <StatisticRow
          label="Média de segundos serviços"
          value={viewModel.service.averageValidSecondServesPerGameLabel}
        />

        <StatisticRow
          label="Média de duplas faltas"
          value={viewModel.service.averageDoubleFaultsPerGameLabel}
        />

        <StatisticRow
          label="Média de pontos perdidos"
          value={viewModel.service.averagePointsLostPerGameLabel}
        />
      </SummarySection>

      <SummarySection title="Devolução">
        <StatisticRow
          label="Games devolvendo"
          value={viewModel.return.gamesPlayed}
        />

        <StatisticRow label="Games ganhos" value={viewModel.return.gamesWon} />

        <StatisticRow
          label="Games perdidos"
          value={viewModel.return.gamesLost}
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

        <StatisticRow
          label="Média de pontos ganhos"
          value={viewModel.return.averagePointsWonPerGameLabel}
        />
      </SummarySection>

      <PrimaryButton
        title="Voltar ao início"
        onPress={() => {
          router.replace("/");
        }}
      />
    </ScreenContainer>
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

      <Card>{children}</Card>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
  },

  resultContent: {
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  result: {
    color: theme.colors.text,
    fontSize: 40,
    fontWeight: "800",
  },

  winner: {
    ...theme.typography.sectionTitle,
    color: theme.colors.text,
  },

  secondaryText: {
    ...theme.typography.caption,
    color: theme.colors.secondaryText,
  },

  section: {
    gap: theme.spacing.sm,
  },

  sectionTitle: {
    ...theme.typography.sectionTitle,
    color: theme.colors.text,
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
});
