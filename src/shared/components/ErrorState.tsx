import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/shared/theme";

import { PrimaryButton } from "./PrimaryButton";

type ErrorStateProps = {
  title?: string;
  message: string;

  actionLabel?: string;
  onAction?: () => void;
};

export function ErrorState({
  title = "Algo deu errado",
  message,
  actionLabel,
  onAction,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.message}>{message}</Text>

      {actionLabel && onAction ? (
        <PrimaryButton title={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
  },

  title: {
    ...theme.typography.sectionTitle,
    color: theme.colors.text,
    textAlign: "center",
  },

  message: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    textAlign: "center",
  },
});
