import { StyleSheet, Text, View } from "react-native";

import type { Match } from "@/features/matches/domain/entities/Match";
import { PrimaryButton } from "@/shared/components";
import { theme } from "@/shared/theme";

type ActiveMatchCardProps = {
  match: Match;
  onContinue: () => void;
};

export function ActiveMatchCard({ match, onContinue }: ActiveMatchCardProps) {
  const startedAt = match.startedAt.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.label}>Partida em andamento</Text>

        <Text style={styles.opponent}>vs. {match.opponentName}</Text>

        <Text style={styles.startedAt}>Iniciada às {startedAt}</Text>
      </View>

      <PrimaryButton title="Continuar partida" onPress={onContinue} />
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

  opponent: {
    marginTop: theme.spacing.xs,
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "700",
  },

  startedAt: {
    marginTop: theme.spacing.xs,
    color: theme.colors.secondaryText,
    fontSize: 15,
  },
});
