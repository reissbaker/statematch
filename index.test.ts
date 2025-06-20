import { it, describe, expect } from "vitest";
import { statematch, asyncmatch } from "./index.ts";

describe("statematch", () => {
  it("should match the first arm that passes", () => {
    const value = statematch([
      [() => false, () => "first"],
      [() => true, () => "second"],
    ], () => "fallback");

    expect(value).toBe("second");
  });

  it("should not fall through to later truthy values", () => {
    const value = statematch([
      [() => true, () => "first"],
      [() => true, () => "second"],
    ], () => "fallback");

    expect(value).toBe("first");
  });

  it("should fall through to the fallback if none pass", () => {
    const value = statematch([
      [() => false, () => "first"],
      [() => false, () => "second"],
    ], () => "fallback");

    expect(value).toBe("fallback");
  });
});

describe("asyncmatch", () => {
  it("should match the first arm that passes", async () => {
    const value = await asyncmatch([
      [async () => false, () => "first"],
      [async () => true, () => "second"],
    ], () => "fallback");

    expect(value).toBe("second");
  });

  it("should not fall through to later truthy values", async () => {
    const value = await asyncmatch([
      [async () => true, () => "first"],
      [async () => true, () => "second"],
    ], () => "fallback");

    expect(value).toBe("first");
  });

  it("should fall through to the fallback if none pass", async () => {
    const value = await asyncmatch([
      [async () => false, () => "first"],
      [async () => false, () => "second"],
    ], () => "fallback");

    expect(value).toBe("fallback");
  });

  it("should allow async arms", async () => {
    const value = await asyncmatch([
      [async () => false, async () => "first"],
      [async () => true, async () => "second"],
    ], async () => "fallback");

    expect(value).toBe("second");
  });
});
