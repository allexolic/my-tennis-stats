import { StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../src/shared/theme";

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Configuração concluída</Text>

        <Text style={styles.message}>
          Expo Router, TypeScript e os componentes compartilhados estão
          funcionando.
        </Text>
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
    justifyContent: "center",
    padding: theme.spacing.lg,
  },

  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "700",
  },

  message: {
    marginTop: theme.spacing.md,
    color: theme.colors.secondaryText,
    fontSize: 17,
    lineHeight: 25,
  },
});
