"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NavGroup {
  label: string;
  slides: { index: number; label: string; subStep?: number }[];
}

interface SlideNavProps {
  current: number;
  currentSubStep?: number;
  total: number;
  groups: NavGroup[];
  onNavigate: (index: number, subStep?: number) => void;
  presentationTitle?: string;
}

export function TopBar({
  groups,
  current,
  currentSubStep,
  onNavigate,
  presentationTitle = "How the Model Works",
}: SlideNavProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const currentGroup =
    groups.find((g) =>
      g.slides.some(
        (s) =>
          s.index === current &&
          (s.subStep === undefined || s.subStep === currentSubStep),
      ),
    ) ?? groups.find((g) => g.slides.some((s) => s.index === current));

  const currentGroupIndex = groups.indexOf(currentGroup!);

  const handleNavigate = useCallback(
    (index: number, subStep?: number) => {
      onNavigate(index, subStep);
      setOpen(false);
    },
    [onNavigate],
  );

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center px-4 py-2.5">
          <button
            onClick={() => onNavigate(0)}
            className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-bold tracking-tight text-foreground transition-colors hover:bg-muted/50"
            aria-label="Go to first slide"
          >
            <svg viewBox="0 0 36 36" className="size-5 shrink-0" aria-hidden="true">
              <rect x="0" y="0" width="15" height="15" rx="2" fill="#EF8B1D" />
              <rect x="19" y="0" width="15" height="15" rx="2" fill="#E56910" />
              <rect x="0" y="19" width="15" height="15" rx="2" fill="#00446A" />
              <rect x="19" y="19" width="15" height="15" rx="2" fill="#E56910" />
            </svg>
            {presentationTitle}
          </button>

          <button
            ref={triggerRef}
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
          >
            {currentGroup?.label ?? ""}
            <ChevronDown
              className={cn(
                "size-3.5 text-muted-foreground transition-transform",
                open && "rotate-180",
              )}
            />
          </button>

          <div className="ml-auto flex items-center gap-1">
            {groups.map((g, gi) => {
              const groupDone = g.slides.every(
                (s) =>
                  s.index < current ||
                  (s.index === current &&
                    s.subStep !== undefined &&
                    currentSubStep !== undefined &&
                    s.subStep < currentSubStep),
              );
              const groupActive = gi === currentGroupIndex;
              return (
                <span
                  key={gi}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    groupActive
                      ? "w-5 bg-[#00446a]"
                      : groupDone
                        ? "w-1.5 bg-[#00446a]/40"
                        : "w-1.5 bg-muted-foreground/25",
                  )}
                />
              );
            })}
          </div>
        </div>
      </header>

      {open && (
        <div
          ref={panelRef}
          className="fixed top-[49px] left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-b-xl border border-t-0 bg-background/95 shadow-lg backdrop-blur-sm"
        >
          <div className="max-h-[60vh] overflow-y-auto p-3">
            {groups.map((group, gi) => {
              const groupDone = group.slides.every(
                (s) =>
                  s.index < current ||
                  (s.index === current &&
                    s.subStep !== undefined &&
                    currentSubStep !== undefined &&
                    s.subStep < currentSubStep),
              );
              const groupActive = gi === currentGroupIndex;

              return (
                <div key={gi} className="mb-1 last:mb-0">
                  <button
                    onClick={() =>
                      handleNavigate(
                        group.slides[0].index,
                        group.slides[0].subStep,
                      )
                    }
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm font-medium transition-colors",
                      groupActive
                        ? "bg-[#00446a]/10 text-[#00446a]"
                        : groupDone
                          ? "text-muted-foreground hover:bg-muted/50"
                          : "text-foreground/70 hover:bg-muted/50",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                        groupActive
                          ? "bg-[#00446a] text-white"
                          : groupDone
                            ? "bg-muted text-muted-foreground"
                            : "bg-muted text-muted-foreground/60",
                      )}
                    >
                      {groupDone ? <Check className="size-3" /> : gi + 1}
                    </span>
                    {group.label}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export function BottomBar({
  current,
  currentSubStep,
  total,
  groups,
  onNavigate,
}: SlideNavProps) {
  const currentGroup =
    groups.find((g) =>
      g.slides.some(
        (s) =>
          s.index === current &&
          (s.subStep === undefined || s.subStep === currentSubStep),
      ),
    ) ?? groups.find((g) => g.slides.some((s) => s.index === current));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate(current - 1)}
          disabled={current === 0}
          className="shrink-0 text-muted-foreground"
        >
          <ChevronLeft className="size-4" />
          Back
        </Button>

        {currentGroup && currentGroup.slides.length > 1 && (
          <div className="flex items-center gap-1 overflow-x-auto px-2">
            {currentGroup.slides.map((slide) => {
              const isActive =
                slide.index === current &&
                (slide.subStep === undefined ||
                  slide.subStep === currentSubStep);
              return (
                <button
                  key={`${slide.index}-${slide.subStep ?? ""}`}
                  onClick={() => onNavigate(slide.index, slide.subStep)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-[#00446a] text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  {slide.label}
                </button>
              );
            })}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate(current + 1)}
          disabled={current === total - 1}
          className="shrink-0 text-muted-foreground"
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
}

// Keep backward-compat export for easy migration
export function SlideNav(props: SlideNavProps) {
  return (
    <>
      <TopBar {...props} />
      <BottomBar {...props} />
    </>
  );
}
