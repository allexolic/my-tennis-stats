import type { Clock } from "@/features/matches/application/ports/Clock";

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}
