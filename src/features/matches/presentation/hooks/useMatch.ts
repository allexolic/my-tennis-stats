import { useCallback, useState } from "react";

import type { Match } from "@/features/matches/domain/entities/Match";
import type { MatchProgress } from "@/features/matches/domain/types/MatchProgress";
import { matchDependencies } from "@/features/matches/infrastructure/container/matchDependencies";

type UseMatchResult = {
  match: Match | null;
  progress: MatchProgress | null;
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
};

export function useMatch(matchId: string | undefined): UseMatchResult {
  const [match, setMatch] = useState<Match | null>(null);

  const [progress, setProgress] = useState<MatchProgress | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!matchId) {
      setMatch(null);
      setProgress(null);
      setError("Partida inválida.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await matchDependencies.getMatchById.execute(matchId);

      if (!result) {
        setMatch(null);
        setProgress(null);
        setError("A partida não foi encontrada.");
        return;
      }

      setMatch(result.match);
      setProgress(result.progress);
    } catch {
      setMatch(null);
      setProgress(null);
      setError("Não foi possível carregar a partida.");
    } finally {
      setIsLoading(false);
    }
  }, [matchId]);

  return {
    match,
    progress,
    isLoading,
    error,
    load,
  };
}
