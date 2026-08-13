import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card } from "@/shared/components";

import { theme } from "@/shared/theme";

import type { MatchHistoryItemViewModel } from "../view-models/MatchHistoryViewModel";

type MatchHistoryCardProps = {
  item: MatchHistoryItemViewModel;

  onPress: () => void;

  onDelete: () => void;
};

export function MatchHistoryCard({
  item,
  onPress,
  onDelete,
}: MatchHistoryCardProps) {
  return (
    <Card>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${item.resultStatusLabel} contra ${item.opponentName}, ${item.resultLabel}`}
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <View style={styles.header}>
          <View style={styles.opponentContainer}>
            <Text numberOfLines={1} style={styles.opponent}>
              {item.opponentName}
            </Text>

            <Text style={styles.date}>{item.dateLabel}</Text>
          </View>

          <Text style={styles.result}>{item.resultLabel}</Text>
        </View>

        <View style={styles.footer}>
          <Text
            style={[
              styles.status,
              item.didPlayerWin ? styles.win : styles.loss,
            ]}
          >
            {item.resultStatusLabel}
          </Text>

          <Text style={styles.metadata}>{item.durationLabel}</Text>
        </View>

        {item.tieBreakLabel ? (
          <Text style={styles.metadata}>Tie-break: {item.tieBreakLabel}</Text>
        ) : null}
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Excluir partida contra ${item.opponentName}`}
          onPress={onDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.deletePressed,
          ]}
        >
          <Text style={styles.deleteText}>Excluir</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.8,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },

  opponentContainer: {
    flex: 1,
  },

  opponent: {
    ...theme.typography.cardTitle,
    color: theme.colors.text,
  },

  date: {
    ...theme.typography.caption,
    marginTop: theme.spacing.xs,
    color: theme.colors.secondaryText,
  },

  result: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "700",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },

  status: {
    ...theme.typography.captionStrong,
  },

  win: {
    color: theme.colors.primary,
  },

  loss: {
    color: theme.colors.danger,
  },

  metadata: {
    ...theme.typography.caption,
    color: theme.colors.secondaryText,
  },

  actions: {
    alignItems: "flex-end",
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  deleteButton: {
    alignSelf: "flex-start",
    minHeight: theme.components.minTouchHeight,

    justifyContent: "center",
  },

  deletePressed: {
    opacity: 0.7,
  },

  deleteText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.danger,
  },
});
