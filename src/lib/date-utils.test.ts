import { describe, it, expect } from "vitest";
import { parseItalianDate } from "./date-utils";

describe("parseItalianDate", () => {
  it("parses valid Italian date with day month year", () => {
    const d = parseItalianDate("15 Giugno 2025");
    expect(d).not.toBeNull();
    expect(d!.getUTCFullYear()).toBe(2025);
    expect(d!.getUTCMonth()).toBe(5);
    expect(d!.getUTCDate()).toBe(15);
  });

  it("parses date with leading zero in day", () => {
    const d = parseItalianDate("1 Maggio 2026");
    expect(d).not.toBeNull();
    expect(d!.getUTCDate()).toBe(1);
    expect(d!.getUTCMonth()).toBe(4);
  });

  it("parses date with extra text before (e.g. weekday)", () => {
    const d = parseItalianDate("Sabato 11 Luglio 2026");
    expect(d).not.toBeNull();
    expect(d!.getUTCDate()).toBe(11);
    expect(d!.getUTCMonth()).toBe(6);
    expect(d!.getUTCFullYear()).toBe(2026);
  });

  it("is case insensitive", () => {
    const d = parseItalianDate("11 LUGLIO 2026");
    expect(d).not.toBeNull();
    expect(d!.getUTCMonth()).toBe(6);
  });

  it("returns null for invalid format", () => {
    expect(parseItalianDate("")).toBeNull();
    expect(parseItalianDate("11/07/2026")).toBeNull();
    expect(parseItalianDate("July 11 2026")).toBeNull();
    expect(parseItalianDate("invalid")).toBeNull();
  });

  it("returns null for invalid month name", () => {
    expect(parseItalianDate("11 Invalid 2026")).toBeNull();
  });

  it("trims whitespace", () => {
    const d = parseItalianDate("  11 Luglio 2026  ");
    expect(d).not.toBeNull();
    expect(d!.getUTCDate()).toBe(11);
  });
});
