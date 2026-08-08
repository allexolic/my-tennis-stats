import * as Crypto from "expo-crypto";

import type { IdGenerator } from "@/features/matches/application/ports/IdGenerator";

export class UuidGenerator implements IdGenerator {
  generate(): string {
    return Crypto.randomUUID();
  }
}
