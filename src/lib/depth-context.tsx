"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type DepthLevel = 0 | 1 | 2;
export type ViewMode = "zoom" | "compare";

export const DEPTH_LABELS = ["Low", "Medium", "High"] as const;

interface SectionState {
  depth: DepthLevel;
  viewMode: ViewMode;
}

interface DepthContextValue {
  getSection: (slug: string) => SectionState;
  zoomIn: (slug: string) => void;
  zoomOut: (slug: string) => void;
  setDepth: (slug: string, level: DepthLevel) => void;
  toggleCompare: (slug: string) => void;
  setViewMode: (slug: string, mode: ViewMode) => void;
}

const DepthContext = createContext<DepthContextValue | null>(null);

const DEFAULT_STATE: SectionState = { depth: 1, viewMode: "zoom" };

export function DepthProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<Record<string, SectionState>>({});

  const getSection = useCallback(
    (slug: string): SectionState => sections[slug] ?? DEFAULT_STATE,
    [sections],
  );

  const update = useCallback(
    (slug: string, fn: (prev: SectionState) => Partial<SectionState>) => {
      setSections((prev) => {
        const current = prev[slug] ?? DEFAULT_STATE;
        return { ...prev, [slug]: { ...current, ...fn(current) } };
      });
    },
    [],
  );

  const zoomIn = useCallback(
    (slug: string) =>
      update(slug, (s) => ({
        depth: Math.min(s.depth + 1, 2) as DepthLevel,
      })),
    [update],
  );

  const zoomOut = useCallback(
    (slug: string) =>
      update(slug, (s) => ({
        depth: Math.max(s.depth - 1, 0) as DepthLevel,
      })),
    [update],
  );

  const setDepth = useCallback(
    (slug: string, level: DepthLevel) => update(slug, () => ({ depth: level })),
    [update],
  );

  const toggleCompare = useCallback(
    (slug: string) =>
      update(slug, (s) => ({
        viewMode: s.viewMode === "zoom" ? "compare" : "zoom",
      })),
    [update],
  );

  const setViewMode = useCallback(
    (slug: string, mode: ViewMode) => update(slug, () => ({ viewMode: mode })),
    [update],
  );

  return (
    <DepthContext.Provider
      value={{ getSection, zoomIn, zoomOut, setDepth, toggleCompare, setViewMode }}
    >
      {children}
    </DepthContext.Provider>
  );
}

export function useDepth() {
  const ctx = useContext(DepthContext);
  if (!ctx) throw new Error("useDepth must be used within DepthProvider");
  return ctx;
}
