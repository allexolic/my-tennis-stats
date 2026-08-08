import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/shared/components";
import { theme } from "@/shared/theme";

type NextMatchActionCardProps = {
  nextServerLabel: string;
  actionLabel: string;
  onPress: () => void;
};

export function NextMatchActionCard({
  nextServerLabel,
  actionLabel,
  onPress,
}: NextMatchActionCardProps) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.label}>Próximo saque</Text>

        <Text style={styles.server}>{nextServerLabel}</Text>
      </View>

      <PrimaryButton title={actionLabel} onPress={onPress} />
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

  server: {
    marginTop: theme.spacing.xs,
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "700",
  },
});
