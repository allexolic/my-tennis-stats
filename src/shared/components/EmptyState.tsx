import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/shared/theme";

import { PrimaryButton } from "./PrimaryButton";

type EmptyStateProps = {
  title: string;
  message?: string;

  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      {actionLabel && onAction ? (
        <PrimaryButton title={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },

  title: {
    ...theme.typography.cardTitle,
    color: theme.colors.text,
    textAlign: "center",
  },

  message: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    textAlign: "center",
  },
});
