import { it, describe, expect } from "vitest";
import { statematch, asyncmatch, fallback, guard } from "./index.ts";

describe("statematch", () => {
  it("should match the first arm that passes", () => {
    const value = statematch([
      [() => false, () => "first"],
      [() => true, () => "second"],
      fallback(() => "fallback"),
    ]);

    expect(value).toBe("second");
  });

  it("should not fall through to later truthy values", () => {
    const value = statematch([
      [() => true, () => "first"],
      [() => true, () => "second"],
      fallback(() => "fallback"),
    ]);

    expect(value).toBe("first");
  });

  it("should fall through to the fallback if none pass", () => {
    const value = statematch([
      [() => false, () => "first"],
      [() => false, () => "second"],
      fallback(() => "fallback"),
    ]);

    expect(value).toBe("fallback");
  });

  it("should allow nested functions that return arms", () => {
    const value = statematch([
      [() => false, () => "first"],
      [() => false, () => "second"],
      () => [
        [() => false, () => "third"],
        [() => true, () => "fourth"],
      ],
      fallback(() => "fallback"),
    ]);

    expect(value).toBe("fourth");
  });

  it("should allow nested functions that return fallbacks", () => {
    const value = statematch([
      [() => false, () => "first"],
      [() => false, () => "second"],
      () => [
        [() => false, () => "third"],
        [() => true, () => "fourth"],
        fallback(() => "fallback"),
      ],
    ]);

    expect(value).toBe("fourth");
  });

  it("should work with guard syntax", () => {
    const value = statematch([
      guard(() => false).run(() => "first"),
      guard(() => false).run(() => "second"),
      () => [
        guard(() => false).run(() => "third"),
        guard(() => true).run(() => "fourth"),
        fallback(() => "fallback"),
      ],
    ]);

    expect(value).toBe("fourth");
  });
});

describe("asyncmatch", () => {
  it("should match the first arm that passes", async () => {
    const value = await asyncmatch([
      [async () => false, () => "first"],
      [async () => true, () => "second"],
      fallback(() => "fallback"),
    ]);

    expect(value).toBe("second");
  });


  it("should not fall through to later truthy values", async () => {
    const value = await asyncmatch([
      [async () => true, () => "first"],
      [async () => true, () => "second"],
      fallback(() => "fallback"),
    ]);

    expect(value).toBe("first");
  });

  it("should fall through to the fallback if none pass", async () => {
    const value = await asyncmatch([
      [async () => false, () => "first"],
      [async () => false, () => "second"],
      fallback(() => "fallback"),
    ]);

    expect(value).toBe("fallback");
  });

  it("should allow async fallbacks", async () => {
    const value = await asyncmatch([
      [async () => false, () => "first"],
      [async () => true, () => "second"],
      fallback(async () => "fallback"),
    ]);

    expect(value).toBe("second");
  });

  it("should allow async arms", async () => {
    const value = await asyncmatch([
      [async () => false, async () => "first"],
      [async () => true, async () => "second"],
      fallback(async () => "fallback"),
    ]);

    expect(value).toBe("second");
  });

  it("should allow nested async functions that return arms", async () => {
    const value = await asyncmatch([
      [async () => false, () => "first"],
      [async () => false, () => "second"],
      async () => [
        [async () => false, () => "third"],
        [async () => true, () => "fourth"],
      ],
      fallback(() => "fallback"),
    ]);

    expect(value).toBe("fourth");
  });

  it("should allow nested non-async functions that return arms", async () => {
    const value = await asyncmatch([
      [async () => false, () => "first"],
      [async () => false, () => "second"],
      () => [
        [async () => false, () => "third"],
        [async () => true, () => "fourth"],
      ],
      fallback(() => "fallback"),
    ]);

    expect(value).toBe("fourth");
  });

  it("should allow nested functions to return fallbacks", async () => {
    const value = await asyncmatch([
      [async () => false, () => "first"],
      [async () => false, () => "second"],
      () => [
        [async () => false, () => "third"],
        [async () => true, () => "fourth"],
        fallback(() => "fallback"),
      ],
    ]);

    expect(value).toBe("fourth");
  });

  it("should work with guard syntax", async () => {
    const value = await asyncmatch([
      guard(async () => false).run(() => "first"),
      guard(async () => false).run(() => "second"),
      () => [
        guard(async () => false).run(() => "third"),
        guard(async () => true).run(() => "fourth"),
        fallback(() => "fallback"),
      ],
    ]);

    expect(value).toBe("fourth");
  });
});
