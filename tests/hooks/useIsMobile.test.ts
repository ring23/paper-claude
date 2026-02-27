// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useIsMobile } from "../../src/hooks/useIsMobile";

describe("useIsMobile", () => {
  const originalInnerWidth = window.innerWidth;
  let listeners: Array<() => void> = [];

  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    listeners = [];
    window.matchMedia = vi.fn((query: string) => ({
      matches: window.innerWidth <= 768,
      media: query,
      addEventListener: (_: string, cb: () => void) => listeners.push(cb),
      removeEventListener: (_: string, cb: () => void) => {
        listeners = listeners.filter((l) => l !== cb);
      },
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList));
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", { value: originalInnerWidth, writable: true });
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it("returns false for desktop widths", () => {
    Object.defineProperty(window, "innerWidth", { value: 1440, writable: true });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("returns true for mobile widths", () => {
    Object.defineProperty(window, "innerWidth", { value: 390, writable: true });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
});
