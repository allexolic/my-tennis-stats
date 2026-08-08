import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/shared/components";
import { theme } from "@/shared/theme";

type TieBreakActionCardProps = {
  onPress: () => void;
};

export function TieBreakActionCard({ onPress }: TieBreakActionCardProps) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.label}>Placar 6 × 6</Text>

        <Text style={styles.title}>Hora do tie-break</Text>

        <Text style={styles.description}>
          Ao final do tie-break, registre apenas o placar final.
        </Text>
      </View>

      <PrimaryButton title="Registrar tie-break" onPress={onPress} />
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
