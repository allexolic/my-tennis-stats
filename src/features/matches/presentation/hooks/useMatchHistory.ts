import { useCallback, useState } from "react";

import type { MatchHistoryItem } from "@/features/matches/application/dto/MatchHistoryItem";

import { matchDependencies } from "@/features/matches/infrastructure/container/matchDependencies";

type UseMatchHistoryResult = {
  history: MatchHistoryItem[];
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
};

export function useMatchHistory(): UseMatchHistoryResult {
  const [history, setHistory] = useState<MatchHistoryItem[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await matchDependencies.getMatchHistory.execute();

      setHistory(result);
    } catch {
      setHistory([]);

      setError("Não foi possível carregar o histórico.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    history,
    isLoading,
    error,
    load,
  };
}
