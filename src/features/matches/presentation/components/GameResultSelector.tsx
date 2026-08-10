import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  PlayerSide,
  type PlayerSide as PlayerSideType,
} from "@/features/matches/domain/types/PlayerSide";

import { theme } from "@/shared/theme";

type GameResultSelectorProps = {
  value: PlayerSideType;
  onChange: (value: PlayerSideType) => void;
  disabled?: boolean;
};

export function GameResultSelector({
  value,
  onChange,
  disabled = false,
}: GameResultSelectorProps) {
  return (
    <View accessibilityRole="radiogroup" style={styles.container}>
      <ResultButton
        label="Ganhei"
        selected={value === PlayerSide.PLAYER}
        disabled={disabled}
        onPress={() => onChange(PlayerSide.PLAYER)}
      />

      <ResultButton
        label="Perdi"
        selected={value === PlayerSide.OPPONENT}
        disabled={disabled}
        onPress={() => onChange(PlayerSide.OPPONENT)}
      />
    </View>
  );
}

type ResultButtonProps = {
  label: string;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
};

function ResultButton({
  label,
  selected,
  disabled,
  onPress,
}: ResultButtonProps) {
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
        styles.button,
        selected && styles.selectedButton,
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressedButton,
      ]}
    >
      <Text style={[styles.buttonText, selected && styles.selectedButtonText]}>
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

  button: {
    flex: 1,
    minHeight: theme.components.inputHeight,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: theme.colors.border,

    borderRadius: theme.radius.md,

    backgroundColor: theme.colors.surface,
  },

  selectedButton: {
    borderColor: theme.colors.primary,

    backgroundColor: theme.colors.primary,
  },

  disabledButton: {
    opacity: 0.5,
  },

  pressedButton: {
    opacity: 0.8,
  },

  buttonText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text,
  },

  selectedButtonText: {
    color: theme.colors.primaryText,
  },
});
