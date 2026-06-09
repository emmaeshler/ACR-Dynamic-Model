"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { BLUE, ORANGE, GREEN, NAVY } from "./hub-spoke-diagram";
import { WalkthroughDiagram } from "./walkthrough-diagram";

export const TOTAL_BEATS = 6;

interface BeatContent {
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
}

const BEAT_CONTENT: BeatContent[] = [
  {
    badge: "Model Walkthrough",
    badgeColor: NAVY,
    title: "The ML Pricing Model",
    description:
      "Four inputs converge into one deterministic engine — continuously learning from outcomes.",
  },
  {
    badge: "Inputs",
    badgeColor: BLUE,
    title: "What Goes In",
    description: "Every deal starts with four types of data feeding the model.",
  },
  {
    badge: "Engine",
    badgeColor: NAVY,
    title: "The Engine",
    description:
      "One deterministic ML model processes everything — not generative AI, not rules-based. It calculates.",
  },
  {
    badge: "Outputs",
    badgeColor: ORANGE,
    title: "What Comes Out",
    description: "Three actionable outputs on every deal.",
  },
  {
    badge: "Feedback",
    badgeColor: GREEN,
    title: "The Learning Loop",
    description:
      "Every deal outcome feeds back. Win, lose, or negotiate — the model learns and improves.",
  },
  {
    badge: "Complete",
    badgeColor: NAVY,
    title: "The Complete System",
    description: "Now let's walk through each piece.",
  },
];

export const BEAT_LABELS = BEAT_CONTENT.map((c) => c.badge);

export interface NodeDetail {
  id: string;
  label: string;
  color: string;
  summary: string;
  bullets: string[];
}

const NODE_DETAILS: Record<string, NodeDetail> = {
  execution: {
    id: "execution",
    label: "Execution",
    color: BLUE,
    summary: "Every quote, email, and chat response your team sends — captured automatically.",
    bullets: [
      "Email quoting threads parsed for pricing signals",
      "Chat transcripts mined for concession patterns",
      "Configured product/service quotes logged with full line-item detail",
    ],
  },
  data: {
    id: "data",
    label: "Deal History",
    color: NAVY,
    summary: "Win/loss outcomes, margins, and concessions across your entire book of business.",
    bullets: [
      "Historical win/loss outcomes by segment",
      "Margin and discount distributions per product line",
      "Concession sequences that reveal negotiation patterns",
    ],
  },
  market: {
    id: "market",
    label: "Market Signals",
    color: ORANGE,
    summary: "Competitor pricing, commodity indices, and demand shifts flowing in continuously.",
    bullets: [
      "Competitor price movements tracked weekly",
      "Commodity and raw-material index feeds",
      "Demand elasticity signals from order volume trends",
    ],
  },
  expertise: {
    id: "expertise",
    label: "Expertise",
    color: GREEN,
    summary: "Your team's pricing rules and strategic constraints — the model's guardrails.",
    bullets: [
      "Industry-specific pricing heuristics from our consultants",
      "Your internal floor prices and margin targets",
      "Strategic account rules and exception policies",
    ],
  },
  conviction: {
    id: "conviction",
    label: "Conviction",
    color: BLUE,
    summary: "A confidence score — should this deal be approved at this price?",
    bullets: [
      "High-confidence quotes auto-approve instantly",
      "Low-confidence deals flagged for manager review",
      "Confidence drivers shown so reviewers know why",
    ],
  },
  plan: {
    id: "plan",
    label: "Pricing Plan",
    color: ORANGE,
    summary: "Recommended price with the drivers and talking points behind it.",
    bullets: [
      "Target price with upper/lower bounds",
      "Key pricing drivers ranked by impact",
      "Talking points tailored to the customer segment",
    ],
  },
  negotiate: {
    id: "negotiate",
    label: "Negotiate",
    color: GREEN,
    summary: "Floor price, escalation thresholds, and concession guardrails.",
    bullets: [
      "Walk-away floor price the model won't go below",
      "Escalation thresholds that trigger manager approval",
      "Suggested concession sequence for multi-round deals",
    ],
  },
};

interface WalkthroughSlideProps {
  beat: number;
  skipEntrance?: boolean;
}

export function WalkthroughSlide({ beat, skipEntrance }: WalkthroughSlideProps) {
  const content = BEAT_CONTENT[beat] ?? BEAT_CONTENT[0];
  const [activeDetail, setActiveDetail] = useState<NodeDetail | null>(null);

  function handleNodeClick(nodeId: string) {
    const detail = NODE_DETAILS[nodeId];
    if (detail) setActiveDetail(detail);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 pt-4 pb-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={beat}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mb-3 text-center"
        >
          <span
            className="mb-1 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: content.badgeColor }}
          >
            {content.badge}
          </span>
          <h2 className="mt-1.5 text-2xl font-bold tracking-tight">
            {content.title}
          </h2>
          <p className="mx-auto mt-1.5 max-w-2xl text-muted-foreground">
            {content.description}
          </p>
        </motion.div>
      </AnimatePresence>

      <WalkthroughDiagram
        beat={beat}
        skipEntrance={skipEntrance}
        onNodeClick={handleNodeClick}
      />

      <AnimatePresence>
        {activeDetail && (
          <NodeDetailModal
            detail={activeDetail}
            onClose={() => setActiveDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NodeDetailModal({
  detail,
  onClose,
}: {
  detail: NodeDetail;
  onClose: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-x-4 top-[20%] z-50 mx-auto max-w-md rounded-xl border border-border bg-white p-6 shadow-xl sm:inset-x-auto sm:w-[420px]"
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="size-3 rounded-full"
              style={{ backgroundColor: detail.color }}
            />
            <h3 className="text-lg font-semibold">{detail.label}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">{detail.summary}</p>
        <ul className="mt-4 space-y-2">
          {detail.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span
                className="mt-1.5 block size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: detail.color }}
              />
              {b}
            </li>
          ))}
        </ul>
      </motion.div>
    </>
  );
}
