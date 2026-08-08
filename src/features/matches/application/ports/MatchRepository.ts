import type { Match } from "@/features/matches/domain/entities/Match";

export interface MatchRepository {
  create(match: Match): Promise<void>;

  findById(id: string): Promise<Match | null>;

  findActive(): Promise<Match | null>;

  listFinished(): Promise<Match[]>;

  save(match: Match): Promise<void>;

  delete(id: string): Promise<void>;
}
