import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import migrations from "../drizzle/migrations";

import { database } from "@/database/client";
import { theme } from "@/shared/theme";

export default function RootLayout() {
  const { success, error } = useMigrations(database, migrations);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Erro ao inicializar o banco</Text>

        <Text style={styles.errorMessage}>{error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />

        <Text style={styles.loadingText}>Preparando o aplicativo...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerBackTitle: "Voltar",
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "My Tennis Stats",
          }}
        />

        <Stack.Screen
          name="matches/new"
          options={{
            title: "Nova partida",
          }}
        />

        <Stack.Screen
          name="matches/[matchId]/index"
          options={{
            title: "Partida",
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="matches/[matchId]/register-game"
          options={{
            title: "Registrar game",
          }}
        />

        <Stack.Screen
          name="matches/[matchId]/register-tie-break"
          options={{
            title: "Registrar tie-break",
          }}
        />

        <Stack.Screen
          name="matches/[matchId]/summary"
          options={{
            title: "Resumo",
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="matches/history"
          options={{
            title: "Histórico",
          }}
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },

  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.secondaryText,
    fontSize: 16,
  },

  errorTitle: {
    color: theme.colors.danger,
    fontSize: 20,
    fontWeight: "700",
  },

  errorMessage: {
    marginTop: theme.spacing.sm,
    color: theme.colors.secondaryText,
    textAlign: "center",
  },
});
