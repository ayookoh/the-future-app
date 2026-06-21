import { describe, expect, it } from "vitest";
import { parseModelJson } from "./json";

describe("model JSON parser", () => {
  it("parses fenced JSON", () => {
    expect(parseModelJson<{ ok: boolean }>("```json\n{\"ok\":true}\n```").ok).toBe(true);
  });
});
