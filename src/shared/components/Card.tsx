import type { ReactNode } from "react";

import { StyleSheet, View } from "react-native";

import { theme } from "@/shared/theme";

type CardProps = {
  children: ReactNode;
};

export function Card({ children }: CardProps) {
  return <View style={styles.card}>{children}</View>;
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
});
