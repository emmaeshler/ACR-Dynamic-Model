"use client";

import { useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BLUE, ORANGE, GREEN, NAVY } from "./hub-spoke-diagram";
import { WalkthroughDiagram } from "./walkthrough-diagram";
import { AiAccelerationViz } from "./ai-acceleration-viz";

export const TOTAL_BEATS = 7;

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
  {
    badge: "With AI",
    badgeColor: "#E56910",
    title: "What's Next",
    description:
      "Maintain engagement durations, accelerate impact. AI compresses the initial build and enables faster iteration cycles after go-live.",
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

const AI_STEP_CONTENT: BeatContent[] = [
  {
    badge: "With AI",
    badgeColor: "#E56910",
    title: "The Engagement Today",
    description: "A traditional engagement follows a familiar arc — data, modeling, implementation. Each phase is sequential.",
  },
  {
    badge: "With AI",
    badgeColor: "#E56910",
    title: "The Engagement With AI",
    description: "AI compresses the initial build and unlocks faster iteration cycles after go-live.",
  },
  {
    badge: "With AI",
    badgeColor: "#E56910",
    title: "Inside the Model Lifecycle",
    description: "Let's look at what's happening inside — each model iteration follows this lifecycle.",
  },
  {
    badge: "With AI",
    badgeColor: "#E56910",
    title: "AI Accelerates the Model",
    description: "AI compresses or eliminates bottlenecks at every stage. The same lifecycle, dramatically faster.",
  },
  {
    badge: "With AI",
    badgeColor: "#E56910",
    title: "Better Model, Better Outcomes",
    description: "Faster iterations compound — a better model means better prices means better ROI.",
  },
];

const AI_STEP_LABELS = ["Timeline", "With AI", "Model", "Accelerated", "Payoff"];

interface WalkthroughSlideProps {
  beat: number;
  skipEntrance?: boolean;
  aiStep?: number;
  onAiStepChange?: (step: number) => void;
}

export function WalkthroughSlide({ beat, skipEntrance, aiStep = 0, onAiStepChange }: WalkthroughSlideProps) {
  const content = beat === 6 ? AI_STEP_CONTENT[aiStep] ?? AI_STEP_CONTENT[0] : BEAT_CONTENT[beat] ?? BEAT_CONTENT[0];
  const [activeDetail, setActiveDetail] = useState<NodeDetail | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNodeHover = useCallback((nodeId: string) => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    const detail = NODE_DETAILS[nodeId];
    if (detail) setActiveDetail(detail);
  }, []);

  const handleNodeLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => setActiveDetail(null), 200);
  }, []);

  const handleTooltipEnter = useCallback(() => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 pt-4 pb-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${beat}-${aiStep}`}
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

      <div className="relative">
        {beat === 6 ? (
          <AiAccelerationViz step={aiStep} />
        ) : (
          <WalkthroughDiagram
            beat={beat}
            skipEntrance={skipEntrance}
            onNodeHover={handleNodeHover}
            onNodeLeave={handleNodeLeave}
          />
        )}

        <AnimatePresence>
          {activeDetail && (
            <NodeDetailTooltip
              detail={activeDetail}
              onMouseEnter={handleTooltipEnter}
              onMouseLeave={handleNodeLeave}
            />
          )}
        </AnimatePresence>
      </div>

      {beat === 6 && onAiStepChange && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => aiStep > 0 && onAiStepChange(aiStep - 1)}
            disabled={aiStep === 0}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="flex items-center gap-2">
            {AI_STEP_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => onAiStepChange(i)}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className="rounded-full transition-all"
                  style={{
                    width: i === aiStep ? 24 : 8,
                    height: 8,
                    backgroundColor: i === aiStep ? "#E56910" : i < aiStep ? "#E5691060" : "#d1d5db",
                  }}
                />
                <span
                  className="text-[9px] font-medium transition-opacity"
                  style={{
                    color: i === aiStep ? "#E56910" : "#9ca3af",
                    opacity: i === aiStep ? 1 : 0.7,
                  }}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => aiStep < AI_STEP_LABELS.length - 1 && onAiStepChange(aiStep + 1)}
            disabled={aiStep === AI_STEP_LABELS.length - 1}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function NodeDetailTooltip({
  detail,
  onMouseEnter,
  onMouseLeave,
}: {
  detail: NodeDetail;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.15 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute left-4 top-4 z-10 w-72 rounded-lg border border-border bg-white p-4 shadow-lg"
    >
      <div className="mb-2 flex items-center gap-2">
        <div
          className="size-2.5 rounded-full"
          style={{ backgroundColor: detail.color }}
        />
        <h3 className="text-sm font-semibold">{detail.label}</h3>
      </div>
      <p className="text-xs text-muted-foreground">{detail.summary}</p>
      <ul className="mt-2.5 space-y-1.5">
        {detail.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-xs">
            <span
              className="mt-1 block size-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: detail.color }}
            />
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
