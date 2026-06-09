"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BLUE, ORANGE, GREEN, NAVY } from "./hub-spoke-diagram";
import { WalkthroughDiagram } from "./walkthrough-diagram";

export const TOTAL_BEATS = 6;

const BEAT_CONTENT = [
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
    description:
      "Every deal starts with data. Execution history, deal outcomes, market signals, and human expertise flow into the model.",
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
    description:
      "Three actionable outputs: a conviction level, a pricing plan, and negotiation guardrails.",
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
    description: "Now let’s walk through each piece.",
  },
];

export const BEAT_LABELS = BEAT_CONTENT.map((c) => c.badge);

interface WalkthroughSlideProps {
  beat: number;
  skipEntrance?: boolean;
}

export function WalkthroughSlide({ beat, skipEntrance }: WalkthroughSlideProps) {
  const content = BEAT_CONTENT[beat] ?? BEAT_CONTENT[0];

  return (
    <div className="mx-auto max-w-5xl px-6 pt-6 pb-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={beat}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mb-4 text-center"
        >
          <span
            className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: content.badgeColor }}
          >
            {content.badge}
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            {content.title}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            {content.description}
          </p>
        </motion.div>
      </AnimatePresence>

      <WalkthroughDiagram beat={beat} skipEntrance={skipEntrance} />
    </div>
  );
}
