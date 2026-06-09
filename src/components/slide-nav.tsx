"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NavGroup {
  label: string;
  slides: { index: number; label: string }[];
}

interface SlideNavProps {
  current: number;
  total: number;
  groups: NavGroup[];
  onNavigate: (index: number) => void;
}

export function SlideNav({ current, total, groups, onNavigate }: SlideNavProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const currentGroup = groups.find((g) =>
    g.slides.some((s) => s.index === current),
  );
  const currentGroupIndex = groups.indexOf(currentGroup!);
  const substepIndex = currentGroup
    ? currentGroup.slides.findIndex((s) => s.index === current)
    : 0;

  const handleNavigate = useCallback(
    (index: number) => {
      onNavigate(index);
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
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-14 left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-t-xl border border-b-0 bg-background/95 shadow-lg backdrop-blur-sm"
        >
          <div className="max-h-[60vh] overflow-y-auto p-3">
            {groups.map((group, gi) => {
              const groupDone = group.slides.every(
                (s) => s.index < current,
              );
              const groupActive = gi === currentGroupIndex;

              return (
                <div key={gi} className="mb-1 last:mb-0">
                  <button
                    onClick={() => handleNavigate(group.slides[0].index)}
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
                      {groupDone ? (
                        <Check className="size-3" />
                      ) : (
                        gi + 1
                      )}
                    </span>
                    {group.label}
                  </button>

                  {group.slides.length > 1 && (
                    <div className="ml-6 border-l border-muted pl-3 py-0.5">
                      {group.slides.map((slide) => {
                        const isActive = slide.index === current;
                        const isDone = slide.index < current;
                        return (
                          <button
                            key={slide.index}
                            onClick={() => handleNavigate(slide.index)}
                            className={cn(
                              "flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs transition-colors",
                              isActive
                                ? "bg-[#00446a]/5 font-medium text-[#00446a]"
                                : isDone
                                  ? "text-muted-foreground hover:bg-muted/40"
                                  : "text-foreground/50 hover:bg-muted/40",
                            )}
                          >
                            <span
                              className={cn(
                                "size-1.5 shrink-0 rounded-full",
                                isActive
                                  ? "bg-[#00446a]"
                                  : isDone
                                    ? "bg-muted-foreground/40"
                                    : "bg-foreground/20",
                              )}
                            />
                            {slide.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(current - 1)}
            disabled={current === 0}
            className="text-muted-foreground"
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>

          <button
            ref={triggerRef}
            onClick={() => setOpen(!open)}
            className="flex flex-col items-center gap-1 rounded-md px-4 py-1 transition-colors hover:bg-muted/50"
          >
            <span className="flex items-center gap-1 text-sm font-medium text-foreground">
              {currentGroup?.label ?? ""}
              <ChevronDown
                className={cn(
                  "size-3.5 text-muted-foreground transition-transform",
                  open && "rotate-180",
                )}
              />
            </span>
            {currentGroup && currentGroup.slides.length > 1 && (
              <div className="flex items-center gap-1">
                {currentGroup.slides.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1 rounded-full transition-all",
                      i === substepIndex
                        ? "w-4 bg-[#00446a]"
                        : i < substepIndex
                          ? "w-1.5 bg-[#00446a]/30"
                          : "w-1.5 bg-muted-foreground/25",
                    )}
                  />
                ))}
              </div>
            )}
          </button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(current + 1)}
            disabled={current === total - 1}
            className="text-muted-foreground"
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </nav>
    </>
  );
}
