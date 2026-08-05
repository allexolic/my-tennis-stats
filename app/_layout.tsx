import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Tennis Stats",
        }}
      />

      <Stack.Screen
        name="about"
        options={{
          title: "Sobre",
        }}
      />
    </Stack>
  );
}
