"use client";

import { ComponentType } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useDepth } from "@/lib/depth-context";
import { Button } from "@/components/ui/button";
import { DepthLayer } from "@/components/depth-layer";

interface ZoomViewProps {
  slug: string;
  low: ComponentType;
  medium: ComponentType;
  high: ComponentType;
}

export function ZoomView({ slug, low: Low, medium: Medium, high: High }: ZoomViewProps) {
  const { getSection, zoomIn, zoomOut } = useDepth();
  const { depth } = getSection(slug);

  return (
    <div className="space-y-4">
      <Low />

      <DepthLayer visible={depth >= 1}>
        <div className="border-l-2 border-border pl-4">
          <Medium />
        </div>
      </DepthLayer>

      <DepthLayer visible={depth >= 2}>
        <div className="border-l-2 border-border pl-4">
          <High />
        </div>
      </DepthLayer>

      <div className="flex items-center gap-2 pt-2">
        {depth < 2 && (
          <button
            onClick={() => zoomIn(slug)}
            className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#00446a]/20 bg-[#00446a]/5 px-4 py-2 text-sm font-medium text-[#00446a] transition-all hover:border-[#00446a]/40 hover:bg-[#00446a]/10"
          >
            <ChevronDown className="size-3.5" />
            Dig Deeper
          </button>
        )}
        {depth > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => zoomOut(slug)}
            className="text-muted-foreground"
          >
            <ChevronUp className="size-3.5" />
            Collapse
          </Button>
        )}
      </div>
    </div>
  );
}
