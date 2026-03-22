import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

if (!globalThis.requestAnimationFrame) {
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => window.setTimeout(() => callback(Date.now()), 0));
}

if (!globalThis.cancelAnimationFrame) {
  vi.stubGlobal("cancelAnimationFrame", (handle: number) => window.clearTimeout(handle));
}
