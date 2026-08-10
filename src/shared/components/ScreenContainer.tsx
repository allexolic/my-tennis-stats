import type { ReactNode } from "react";

import { ScrollView, StyleSheet, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/shared/theme";

type ScreenContainerProps = {
  children: ReactNode;
  scroll?: boolean;
};

export function ScreenContainer({
  children,
  scroll = true,
}: ScreenContainerProps) {
  if (!scroll) {
    return (
      <SafeAreaView edges={["left", "right", "bottom"]} style={styles.safeArea}>
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.safeArea}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },

  scrollContent: {
    flexGrow: 1,
    gap: theme.spacing.lg,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
});
