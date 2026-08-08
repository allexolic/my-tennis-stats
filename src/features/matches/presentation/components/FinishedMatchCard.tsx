import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/shared/components";
import { theme } from "@/shared/theme";

type FinishedMatchCardProps = {
  winnerLabel: string;
  onViewSummary: () => void;
};

export function FinishedMatchCard({
  winnerLabel,
  onViewSummary,
}: FinishedMatchCardProps) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.label}>Partida finalizada</Text>

        <Text style={styles.title}>{winnerLabel} venceu</Text>

        <Text style={styles.description}>
          As estatísticas da partida estão prontas para análise.
        </Text>
      </View>

      <PrimaryButton title="Ver resumo" onPress={onViewSummary} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
  },

  label: {
    color: theme.colors.secondaryText,
    fontSize: 14,
    fontWeight: "600",
  },

  title: {
    marginTop: theme.spacing.xs,
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "700",
  },

  description: {
    marginTop: theme.spacing.sm,
    color: theme.colors.secondaryText,
    fontSize: 15,
    lineHeight: 22,
  },
});
