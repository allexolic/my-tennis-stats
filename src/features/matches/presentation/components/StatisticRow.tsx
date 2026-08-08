import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/shared/theme";

type StatisticRowProps = {
  label: string;
  value: string | number;
};

export function StatisticRow({ label, value }: StatisticRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },

  label: {
    flex: 1,
    color: theme.colors.secondaryText,
    fontSize: 15,
  },

  value: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
});
