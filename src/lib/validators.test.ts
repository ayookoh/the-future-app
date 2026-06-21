import { describe, expect, it } from "vitest";
import { findContractions } from "./validators";

describe("contraction validator", () => {
  it("flags common contractions", () => {
    expect(findContractions("I don't think it is ready.")).toContain("don't");
    expect(findContractions("We are ready.")).toEqual([]);
  });
});
