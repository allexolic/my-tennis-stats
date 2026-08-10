import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/shared/theme";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
};

export function ScreenHeader({ title, subtitle, eyebrow }: ScreenHeaderProps) {
  return (
    <View>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}

      <Text style={styles.title}>{title}</Text>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    ...theme.typography.captionStrong,
    color: theme.colors.secondaryText,
  },

  title: {
    ...theme.typography.screenTitle,
    marginTop: theme.spacing.xs,
    color: theme.colors.text,
  },

  subtitle: {
    ...theme.typography.body,
    marginTop: theme.spacing.sm,
    color: theme.colors.secondaryText,
  },
});
