import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/shared/components";
import { theme } from "@/shared/theme";

type MatchRouteParams = {
  matchId?: string;
};
//deprecated
export function MatchCreatedScreen() {
  const { matchId } = useLocalSearchParams<MatchRouteParams>();

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.messageContainer}>
          <Text style={styles.title}>Partida criada</Text>

          <Text style={styles.message}>
            A partida foi salva e está pronta para receber os games.
          </Text>

          <Text style={styles.idLabel}>Identificador</Text>

          <Text style={styles.idValue}>{matchId ?? "Não informado"}</Text>
        </View>

        <PrimaryButton
          title="Voltar ao início"
          onPress={() => {
            router.replace("/");
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: theme.spacing.lg,
  },

  messageContainer: {
    gap: theme.spacing.md,
  },

  title: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: "700",
  },

  message: {
    color: theme.colors.secondaryText,
    fontSize: 17,
    lineHeight: 25,
  },

  idLabel: {
    marginTop: theme.spacing.md,
    color: theme.colors.secondaryText,
    fontSize: 14,
    fontWeight: "600",
  },

  idValue: {
    color: theme.colors.text,
    fontSize: 14,
  },
});
