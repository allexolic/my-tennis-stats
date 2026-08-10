import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { theme } from "@/shared/theme";

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "Carregando..." }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />

      <Text style={styles.message}>{message}</Text>
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

  message: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    textAlign: "center",
  },
});
