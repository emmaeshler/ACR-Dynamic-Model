"use client";

import { ComponentType } from "react";
import { useDepth } from "@/lib/depth-context";
import { ZoomView } from "@/components/zoom-view";

interface ConceptSectionProps {
  slug: string;
  order: number;
  title: string;
  caption: string;
  low: ComponentType;
  medium: ComponentType;
  high: ComponentType;
  highSummary: string;
}

export function ConceptSection({
  slug,
  order,
  title,
  caption,
  low: Low,
  medium,
  high,
  highSummary,
}: ConceptSectionProps) {
  const { getSection } = useDepth();
  getSection(slug);

  return (
    <section className="mx-auto max-w-5xl px-6">
      {/* Hero: title + high-level image + caption — fills the viewport */}
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center py-10">
        <div className="mb-6 text-center">
          <span className="mb-2 inline-block rounded-full bg-[#00446a]/10 px-3 py-1 text-xs font-semibold text-[#00446a]">
            Step {order}
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{caption}</p>
        </div>

        <Low />
      </div>

      {/* Medium + expert toggle — below the fold */}
      <div className="pb-10">
        <ZoomView slug={slug} medium={medium} high={high} highSummary={highSummary} />
      </div>
    </section>
  );
}
