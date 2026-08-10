import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  PlayerSide,
  type PlayerSide as PlayerSideType,
} from "@/features/matches/domain/types/PlayerSide";

import { theme } from "@/shared/theme";

type PlayerSideSelectorProps = {
  value: PlayerSideType;
  onChange: (value: PlayerSideType) => void;
  disabled?: boolean;
};

export function PlayerSideSelector({
  value,
  onChange,
  disabled = false,
}: PlayerSideSelectorProps) {
  return (
    <View accessibilityRole="radiogroup" style={styles.container}>
      <SelectorOption
        label="Eu"
        selected={value === PlayerSide.PLAYER}
        disabled={disabled}
        onPress={() => onChange(PlayerSide.PLAYER)}
      />

      <SelectorOption
        label="Adversário"
        selected={value === PlayerSide.OPPONENT}
        disabled={disabled}
        onPress={() => onChange(PlayerSide.OPPONENT)}
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
      accessibilityLabel={label}
      accessibilityState={{
        checked: selected,
        disabled,
      }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        selected && styles.selectedOption,
        disabled && styles.disabledOption,
        pressed && !disabled && styles.pressedOption,
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
    minHeight: theme.components.inputHeight,

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

  disabledOption: {
    opacity: 0.5,
  },

  pressedOption: {
    opacity: 0.8,
  },

  optionText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },

  selectedOptionText: {
    color: theme.colors.primaryText,
  },
});
