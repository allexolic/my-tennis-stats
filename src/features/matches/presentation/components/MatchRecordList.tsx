import { StyleSheet, Text, View } from "react-native";

import type { MatchRecord } from "@/features/matches/domain/entities/MatchRecord";
import { theme } from "@/shared/theme";

type MatchRecordListProps = {
  records: MatchRecord[];
};

export function MatchRecordList({ records }: MatchRecordListProps) {
  if (records.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>Nenhum game registrado</Text>

        <Text style={styles.emptyText}>
          Ao final de cada game, registre rapidamente o resultado aqui.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Games registrados</Text>

      {records.map((record) => (
        <View key={record.id} style={styles.record}>
          <View>
            <Text style={styles.recordTitle}>
              {record.type === "SET_TIE_BREAK"
                ? "Tie-break"
                : `Game ${record.sequence}`}
            </Text>

            <Text style={styles.recordSubtitle}>
              {getRecordDescription(record)}
            </Text>
          </View>

          <Text style={styles.winner}>
            {record.winner === "PLAYER" ? "Você" : "Adversário"}
          </Text>
        </View>
      ))}
    </View>
  );
}

function getRecordDescription(record: MatchRecord): string {
  if (record.type === "SET_TIE_BREAK") {
    return `${record.playerPoints} × ${record.opponentPoints}`;
  }

  return record.server === "PLAYER" ? "Seu saque" : "Saque do adversário";
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },

  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  emptyCard: {
    gap: theme.spacing.xs,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
  },

  emptyTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "600",
  },

  emptyText: {
    color: theme.colors.secondaryText,
    fontSize: 15,
    lineHeight: 22,
  },

  record: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
  },

  recordTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },

  recordSubtitle: {
    marginTop: theme.spacing.xs,
    color: theme.colors.secondaryText,
    fontSize: 14,
  },

  winner: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
});
