"use client";

import { ComponentType } from "react";
import { ChevronRight, X, Microscope, FlaskConical } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useDepth, type DepthLevel } from "@/lib/depth-context";
import { cn } from "@/lib/utils";

interface ZoomViewProps {
  slug: string;
  medium: ComponentType;
  high: ComponentType;
  highSummary: string;
}

export function ZoomView({
  slug,
  medium: Medium,
  high: High,
  highSummary,
}: ZoomViewProps) {
  const { getSection, setDepth } = useDepth();
  const { depth } = getSection(slug);
  const isExpert = depth >= 2;

  return (
    <div className="flex gap-6">
      <div
        className={cn(
          "min-w-0 space-y-4 transition-all duration-500 ease-in-out",
          isExpert ? "w-[55%] shrink-0" : "w-full",
        )}
      >
        <div className="border-l-2 border-border pl-4">
          <Medium />
        </div>

        <div
          className={cn(
            "flex items-center justify-between rounded-xl border px-4 py-3 transition-colors",
            isExpert
              ? "border-[#D86A1C]/30 bg-[#D86A1C]/8"
              : "border-[#D86A1C]/20 bg-[#D86A1C]/5",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#D86A1C]/15">
              <Microscope className="size-4 text-[#D86A1C]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Dig deeper
              </p>
              <p className="text-xs text-muted-foreground">{highSummary}</p>
            </div>
          </div>
          {!isExpert ? (
            <button
              onClick={() => setDepth(slug, 2 as DepthLevel)}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <ChevronRight className="size-3.5" />
              Expert view
            </button>
          ) : (
            <button
              onClick={() => setDepth(slug, 1 as DepthLevel)}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              <X className="size-3.5" />
              Close
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpert && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "45%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="relative min-w-0 shrink-0 overflow-hidden"
          >
            <div className="rounded-xl border border-[#00446a]/15 bg-[#00446a]/[0.02] p-5">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#D86A1C]/10 px-2.5 py-1 text-xs font-medium text-[#D86A1C]">
                <FlaskConical className="size-3" />
                Expert mode
              </div>
              <div className="prose-sm max-w-none text-sm text-foreground/90">
                <High />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
