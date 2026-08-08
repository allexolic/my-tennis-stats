import type { Clock } from "@/features/matches/application/ports/Clock";

export class MockClock implements Clock {
  constructor(private currentDate: Date) {}

  now(): Date {
    return new Date(this.currentDate);
  }

  setDate(date: Date): void {
    this.currentDate = date;
  }
}
