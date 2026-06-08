"use client";

import { ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Columns3, Layers } from "lucide-react";
import { useDepth } from "@/lib/depth-context";
import { Button } from "@/components/ui/button";
import { ZoomView } from "@/components/zoom-view";
import { CompareView } from "@/components/compare-view";

interface ConceptSectionProps {
  slug: string;
  order: number;
  title: string;
  caption: string;
  low: ComponentType;
  medium: ComponentType;
  high: ComponentType;
}

export function ConceptSection({
  slug,
  order,
  title,
  caption,
  low,
  medium,
  high,
}: ConceptSectionProps) {
  const { getSection, toggleCompare } = useDepth();
  const { viewMode } = getSection(slug);

  const isZoom = viewMode === "zoom";

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <span className="mb-2 inline-block rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            Step {order}
          </span>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{caption}</p>
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => toggleCompare(slug)}
          aria-label={isZoom ? "Switch to compare view" : "Switch to zoom view"}
        >
          {isZoom ? <Columns3 className="size-4" /> : <Layers className="size-4" />}
        </Button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {isZoom ? (
            <ZoomView slug={slug} low={low} medium={medium} high={high} />
          ) : (
            <CompareView slug={slug} low={low} medium={medium} high={high} />
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
