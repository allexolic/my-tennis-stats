import type { IdGenerator } from "@/features/matches/application/ports/IdGenerator";

export class MockIdGenerator implements IdGenerator {
  constructor(private nextId = "generated-id") {}

  generate(): string {
    return this.nextId;
  }

  setNextId(id: string): void {
    this.nextId = id;
  }
}
