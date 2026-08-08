import { createMatchSchema } from "./createMatchSchema";

describe("createMatchSchema", () => {
  it("accepts valid data", () => {
    const result = createMatchSchema.safeParse({
      opponentName: "João",
      firstServer: "PLAYER",
    });

    expect(result.success).toBe(true);
  });

  it("trims the opponent name", () => {
    const result = createMatchSchema.parse({
      opponentName: "  João  ",
      firstServer: "OPPONENT",
    });

    expect(result.opponentName).toBe("João");
  });

  it("rejects an empty opponent name", () => {
    const result = createMatchSchema.safeParse({
      opponentName: "   ",
      firstServer: "PLAYER",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid first server", () => {
    const result = createMatchSchema.safeParse({
      opponentName: "João",
      firstServer: "INVALID",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a name longer than 80 characters", () => {
    const result = createMatchSchema.safeParse({
      opponentName: "A".repeat(81),
      firstServer: "PLAYER",
    });

    expect(result.success).toBe(false);
  });
});
