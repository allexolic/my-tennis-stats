import { useCallback, useState } from "react";

import type { MatchSummary } from "@/features/matches/application/dto/MatchSummary";

import { matchDependencies } from "@/features/matches/infrastructure/container/matchDependencies";

type UseMatchSummaryResult = {
  summary: MatchSummary | null;
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
};

export function useMatchSummary(
  matchId: string | undefined,
): UseMatchSummaryResult {
  const [summary, setSummary] = useState<MatchSummary | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!matchId) {
      setSummary(null);
      setError("Partida inválida.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await matchDependencies.getMatchSummary.execute(matchId);

      setSummary(result);
    } catch (error) {
      setSummary(null);

      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar o resumo.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [matchId]);

  return {
    summary,
    isLoading,
    error,
    load,
  };
}
