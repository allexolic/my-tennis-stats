import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { theme } from "@/shared/theme";

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.disabledButton,
        pressed && !isDisabled && styles.pressedButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.primaryText} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: theme.components.inputHeight,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: theme.spacing.lg,

    borderRadius: theme.radius.md,

    backgroundColor: theme.colors.primary,
  },

  pressedButton: {
    opacity: 0.8,
  },

  disabledButton: {
    opacity: 0.5,
  },

  text: {
    ...theme.typography.bodyStrong,

    color: theme.colors.primaryText,
  },
});
