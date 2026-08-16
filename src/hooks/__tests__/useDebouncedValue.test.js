import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useDebouncedValue } from "../useDebouncedValue";

describe("useDebouncedValue", () => {
  afterEach(() => vi.useRealTimers());

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("first", 300));
    expect(result.current).toBe("first");
  });

  it("only updates after the delay elapses with no further changes", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: "first" } }
    );

    rerender({ value: "second" });
    expect(result.current).toBe("first");

    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe("first");

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("second");
  });
});
