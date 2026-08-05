import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Projeto configurado</Text>

        <Text style={styles.message}>
          O Expo Router e a navegação estão funcionando.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },

  message: {
    fontSize: 17,
    lineHeight: 24,
  },
});
