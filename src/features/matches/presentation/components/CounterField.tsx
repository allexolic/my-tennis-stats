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
  const canDecrement = !disabled && value > min;

  const canIncrement = !disabled && value < max;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.counter}>
        <CounterButton
          accessibilityLabel={`Diminuir ${label}`}
          label="−"
          disabled={!canDecrement}
          onPress={() => onChange(value - 1)}
        />

        <Text accessibilityLabel={`${label}: ${value}`} style={styles.value}>
          {value}
        </Text>

        <CounterButton
          accessibilityLabel={`Aumentar ${label}`}
          label="+"
          disabled={!canIncrement}
          onPress={() => onChange(value + 1)}
        />
      </View>
    </View>
  );
}

type CounterButtonProps = {
  label: string;
  accessibilityLabel: string;
  disabled: boolean;
  onPress: () => void;
};

function CounterButton({
  label,
  accessibilityLabel,
  disabled,
  onPress,
}: CounterButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{
        disabled,
      }}
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
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },

  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.lg,
  },

  button: {
    minWidth: 64,
    minHeight: theme.components.inputHeight,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: theme.colors.border,

    borderRadius: theme.radius.md,

    backgroundColor: theme.colors.surface,
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
