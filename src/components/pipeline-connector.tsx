"use client";

import { cn } from "@/lib/utils";

interface PipelineConnectorProps {
  className?: string;
}

export function PipelineConnector({ className }: PipelineConnectorProps) {
  return (
    <div className={cn("flex justify-center", className)}>
      <svg
        width="24"
        height="48"
        viewBox="0 0 24 48"
        fill="none"
        className="text-muted-foreground"
        aria-hidden="true"
      >
        <line
          x1="12"
          y1="0"
          x2="12"
          y2="36"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d="M7 32 L12 40 L17 32"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
