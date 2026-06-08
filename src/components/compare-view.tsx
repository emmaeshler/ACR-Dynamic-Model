"use client";

import { ComponentType } from "react";
import { DEPTH_LABELS } from "@/lib/depth-context";
import { cn } from "@/lib/utils";

interface CompareViewProps {
  slug: string;
  low: ComponentType;
  medium: ComponentType;
  high: ComponentType;
}

export function CompareView({ slug: _slug, low: Low, medium: Medium, high: High }: CompareViewProps) {
  const columns = [
    { label: DEPTH_LABELS[0], Content: Low, bordered: false },
    { label: DEPTH_LABELS[1], Content: Medium, bordered: true },
    { label: DEPTH_LABELS[2], Content: High, bordered: true },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {columns.map(({ label, Content, bordered }) => (
        <div
          key={label}
          className={cn(
            "min-w-0",
            bordered && "border-l-0 md:border-l md:border-border md:pl-6",
          )}
        >
          <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <Content />
        </div>
      ))}
    </div>
  );
}
