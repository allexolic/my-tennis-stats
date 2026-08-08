import { useCallback, useState } from "react";

import type { Match } from "@/features/matches/domain/entities/Match";
import { matchDependencies } from "@/features/matches/infrastructure/container/matchDependencies";

type UseActiveMatchResult = {
  match: Match | null;
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
};

export function useActiveMatch(): UseActiveMatchResult {
  const [match, setMatch] = useState<Match | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const activeMatch = await matchDependencies.getActiveMatch.execute();

      setMatch(activeMatch);
    } catch {
      setError("Não foi possível carregar a partida em andamento.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    match,
    isLoading,
    error,
    load,
  };
}
