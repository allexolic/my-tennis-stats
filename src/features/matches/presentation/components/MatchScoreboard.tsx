import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/shared/theme";

type MatchScoreboardProps = {
  opponentName: string;
  playerGames: number;
  opponentGames: number;
};

export function MatchScoreboard({
  opponentName,
  playerGames,
  opponentGames,
}: MatchScoreboardProps) {
  return (
    <View style={styles.card}>
      <ScoreRow label="Você" score={playerGames} />

      <View style={styles.divider} />

      <ScoreRow label={opponentName} score={opponentGames} />
    </View>
  );
}

type ScoreRowProps = {
  label: string;
  score: number;
};

function ScoreRow({ label, score }: ScoreRowProps) {
  return (
    <View style={styles.row}>
      <Text numberOfLines={1} style={styles.playerName}>
        {label}
      </Text>

      <Text style={styles.score}>{score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
  },

  row: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },

  playerName: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "600",
  },

  score: {
    minWidth: 48,
    color: theme.colors.text,
    fontSize: 36,
    fontWeight: "700",
    textAlign: "right",
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
});
