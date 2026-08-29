import { describe, it, expect, vi, afterEach } from "vitest";
import { parseBackendDate, deriveNewsStatus, formatPublishedAt } from "../newsStatus";

describe("parseBackendDate", () => {
  it("parses a Java array date (1-indexed month)", () => {
    const result = parseBackendDate([2026, 8, 1, 17, 51, 16, 524174000])!;
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(7); // 0-indexed: August
    expect(result.getDate()).toBe(1);
    expect(result.getHours()).toBe(17);
    expect(result.getMinutes()).toBe(51);
  });

  it("parses an ISO string", () => {
    const result = parseBackendDate("2026-08-01T17:51:16")!;
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(7);
    expect(result.getDate()).toBe(1);
  });

  it("returns null for null/undefined", () => {
    expect(parseBackendDate(null)).toBeNull();
    expect(parseBackendDate(undefined)).toBeNull();
  });
});

describe("deriveNewsStatus", () => {
  afterEach(() => vi.useRealTimers());

  it("returns draft when draft is true, regardless of publishedAt", () => {
    expect(deriveNewsStatus({ draft: true, publishedAt: [2020, 1, 1] })).toBe("draft");
    expect(deriveNewsStatus({ draft: true, publishedAt: null })).toBe("draft");
  });

  it("returns scheduled when not draft and publishedAt is in the future", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1));
    expect(deriveNewsStatus({ draft: false, publishedAt: [2026, 6, 1] })).toBe("scheduled");
  });

  it("returns published when not draft and publishedAt is in the past", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 1));
    expect(deriveNewsStatus({ draft: false, publishedAt: [2026, 1, 1] })).toBe("published");
  });

  it("returns published when not draft and publishedAt is null", () => {
    expect(deriveNewsStatus({ draft: false, publishedAt: null })).toBe("published");
  });
});

describe("formatPublishedAt", () => {
  it("formats a Java array date as dd/MM/yyyy", () => {
    expect(formatPublishedAt([2026, 8, 1, 17, 51])).toBe("01/08/2026");
  });

  it("returns 'Não publicado' when publishedAt is null", () => {
    expect(formatPublishedAt(null)).toBe("Não publicado");
  });

  it("falls back to the given fallback date when publishedAt is null", () => {
    expect(formatPublishedAt(null, [2026, 8, 6, 1, 19])).toBe("06/08/2026");
  });

  it("returns 'Não publicado' when both publishedAt and the fallback are null", () => {
    expect(formatPublishedAt(null, null)).toBe("Não publicado");
  });
});
