import { createMatchHistoryViewModel } from "./createMatchHistoryViewModel";

describe("createMatchHistoryViewModel", () => {
  it("maps a player win", () => {
    // ...
  });

  it("maps an opponent win", () => {
    // ...
  });

  it("formats duration", () => {
    // ...
  });

  it("includes tie-break score", () => {
    // ...
  });

  it("returns empty state", () => {
    const result = createMatchHistoryViewModel([]);

    expect(result.isEmpty).toBe(true);

    expect(result.items).toEqual([]);
  });
});
