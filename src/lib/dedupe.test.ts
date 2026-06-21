import { describe, expect, it } from "vitest";
import { roleDedupeHash } from "./dedupe";

describe("role dedupe", () => {
  it("normalises case and spacing", () => {
    expect(roleDedupeHash("ACME", "IT Buyer", "Paris")).toBe(roleDedupeHash(" acme ", "it buyer", "paris"));
  });
});
