export type MatchHistoryItemViewModel = {
  id: string;

  opponentName: string;

  resultLabel: string;
  resultStatusLabel: string;

  dateLabel: string;
  durationLabel: string;

  tieBreakLabel: string | null;

  didPlayerWin: boolean;
};

export type MatchHistoryViewModel = {
  items: MatchHistoryItemViewModel[];
  isEmpty: boolean;
};
