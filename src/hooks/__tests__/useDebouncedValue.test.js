import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebouncedValue } from "../useDebouncedValue";

describe("useDebouncedValue", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("a", 400));
    expect(result.current).toBe("a");
  });

  it("does not update before the delay elapses", () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 400), {
      initialProps: { value: "a" },
    });

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(399));

    expect(result.current).toBe("a");
  });

  it("updates to the latest value after the delay elapses", () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 400), {
      initialProps: { value: "a" },
    });

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(400));

    expect(result.current).toBe("b");
  });

  it("resets the timer on rapid successive changes", () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 400), {
      initialProps: { value: "a" },
    });

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(300));
    rerender({ value: "c" });
    act(() => vi.advanceTimersByTime(300));

    expect(result.current).toBe("a");

    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe("c");
  });
});
