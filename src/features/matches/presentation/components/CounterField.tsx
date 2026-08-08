import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/shared/theme";

type CounterFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
};

export function CounterField({
  label,
  value,
  onChange,
  disabled = false,
  min = 0,
  max = 99,
}: CounterFieldProps) {
  function decrement(): void {
    if (disabled || value <= min) {
      return;
    }

    onChange(value - 1);
  }

  function increment(): void {
    if (disabled || value >= max) {
      return;
    }

    onChange(value + 1);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.counter}>
        <CounterButton
          label="−"
          disabled={disabled || value <= min}
          onPress={decrement}
        />

        <Text style={styles.value}>{value}</Text>

        <CounterButton
          label="+"
          disabled={disabled || value >= max}
          onPress={increment}
        />
      </View>
    </View>
  );
}

type CounterButtonProps = {
  label: string;
  disabled: boolean;
  onPress: () => void;
};

function CounterButton({ label, disabled, onPress }: CounterButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },

  label: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },

  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.lg,
  },

  button: {
    width: 64,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  buttonDisabled: {
    opacity: 0.35,
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonText: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: "600",
  },

  value: {
    minWidth: 60,
    color: theme.colors.text,
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
  },
});
