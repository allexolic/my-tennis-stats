import { Pressable, StyleSheet, Text, View } from "react-native";

import type { PlayerSide } from "@/features/matches/domain/types/PlayerSide";
import { theme } from "@/shared/theme";

type PlayerSideSelectorProps = {
  value: PlayerSide;
  onChange: (value: PlayerSide) => void;
  disabled?: boolean;
};

export function PlayerSideSelector({
  value,
  onChange,
  disabled = false,
}: PlayerSideSelectorProps) {
  return (
    <View style={styles.container}>
      <SelectorOption
        label="Eu"
        selected={value === "PLAYER"}
        disabled={disabled}
        onPress={() => onChange("PLAYER")}
      />

      <SelectorOption
        label="Adversário"
        selected={value === "OPPONENT"}
        disabled={disabled}
        onPress={() => onChange("OPPONENT")}
      />
    </View>
  );
}

type SelectorOptionProps = {
  label: string;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
};

function SelectorOption({
  label,
  selected,
  disabled,
  onPress,
}: SelectorOptionProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{
        checked: selected,
        disabled,
      }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        selected && styles.selectedOption,
        pressed && !disabled && styles.pressedOption,
        disabled && styles.disabledOption,
      ]}
    >
      <Text style={[styles.optionText, selected && styles.selectedOptionText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },

  option: {
    flex: 1,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
  },

  selectedOption: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },

  pressedOption: {
    opacity: 0.8,
  },

  disabledOption: {
    opacity: 0.5,
  },

  optionText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },

  selectedOptionText: {
    color: theme.colors.primaryText,
  },
});
