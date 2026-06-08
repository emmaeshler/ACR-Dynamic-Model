"use client";

import { ComponentType } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useDepth } from "@/lib/depth-context";
import { cn } from "@/lib/utils";
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
      <div
        className={cn(
          "transition-all duration-300",
          depth >= 1 && "text-sm text-muted-foreground",
        )}
      >
        <Low />
      </div>

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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => zoomIn(slug)}
            className="text-muted-foreground"
          >
            <ChevronDown className="size-3.5" />
            Look closer
          </Button>
        )}
        {depth > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => zoomOut(slug)}
            className="text-muted-foreground"
          >
            <ChevronUp className="size-3.5" />
            Zoom out
          </Button>
        )}
      </div>
    </div>
  );
}
