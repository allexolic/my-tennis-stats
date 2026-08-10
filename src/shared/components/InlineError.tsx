import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/shared/theme";

type InlineErrorProps = {
  message: string;
};

export function InlineError({ message }: InlineErrorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,

    borderRadius: theme.radius.md,

    backgroundColor: theme.colors.dangerSurface,
  },

  text: {
    ...theme.typography.body,
    color: theme.colors.danger,
  },
});
