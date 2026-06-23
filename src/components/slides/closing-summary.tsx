"use client";

import { motion } from "framer-motion";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const TEAL = "#21A5D5";
const GREEN = "#2e7d32";

const STAGES = [
  {
    number: 1,
    label: "Design",
    color: NAVY,
    takeaway: "Four integrated data sources build the model's foundation",
  },
  {
    number: 2,
    label: "Power",
    color: TEAL,
    takeaway: "ML and AI translate millions of signals into defensible guidance",
  },
  {
    number: 3,
    label: "Execute",
    color: ORANGE,
    takeaway: "Customer context and business rules shape every price",
  },
  {
    number: 4,
    label: "Refine",
    color: NAVY,
    takeaway: "Every market outcome teaches the model to sharpen precision",
  },
  {
    number: 5,
    label: "Profit Growth",
    color: ORANGE,
    takeaway: "Compounding accuracy drives measurable margin uplift",
  },
];

const OUTCOMES = [
  { metric: "Margin Uplift", value: "+6pp", color: GREEN },
  { metric: "Win Rate", value: "+6pp", color: TEAL },
  { metric: "Price Consistency", value: "High", color: NAVY },
  { metric: "Override Rate", value: "−26pp", color: ORANGE },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 14 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.45 },
});

export function ClosingSummarySlide() {
  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-6xl flex-col items-center justify-center gap-3 px-6">
      {/* Header */}
      <motion.div className="text-center" {...fadeUp(0)}>
        <span
          className="mb-1 inline-block rounded-full px-3 py-0.5 text-[10px] font-bold tracking-[0.2em] uppercase"
          style={{ backgroundColor: `${NAVY}10`, color: NAVY }}
        >
          Summary
        </span>
        <h2
          className="mt-1 text-xl font-bold tracking-tight sm:text-2xl"
          style={{ color: NAVY }}
        >
          An evidence-based pricing model, end to end
        </h2>
        <p className="mx-auto mt-1.5 max-w-2xl text-sm text-muted-foreground">
          Five interconnected stages turn raw data into measurable profit — and every cycle makes the next one sharper.
        </p>
      </motion.div>

      {/* Journey recap — 5 connected stages */}
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-5 gap-0">
          {STAGES.map((stage, i) => (
            <motion.div
              key={stage.number}
              className="relative flex flex-col items-center text-center"
              {...fadeUp(0.15 + i * 0.1)}
            >
              {/* Connector line to next stage */}
              {i < STAGES.length - 1 && (
                <motion.div
                  className="absolute top-[18px] h-[2px]"
                  style={{
                    left: "calc(50% + 18px)",
                    right: "calc(-50% + 18px)",
                    backgroundColor: stage.color,
                    opacity: 0.25,
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                />
              )}

              {/* Number circle */}
              <motion.div
                className="relative z-10 flex size-9 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: stage.color }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2 + i * 0.1,
                  duration: 0.35,
                  type: "spring",
                  damping: 14,
                }}
              >
                {stage.number}
              </motion.div>

              {/* Label */}
              <span
                className="mt-2 text-xs font-bold tracking-wide uppercase"
                style={{ color: stage.color }}
              >
                {stage.label}
              </span>

              {/* Takeaway */}
              <p
                className="mt-1.5 max-w-[160px] text-[11px] leading-snug text-muted-foreground"
              >
                {stage.takeaway}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Outcome KPIs */}
      <motion.div className="w-full max-w-3xl" {...fadeUp(0.7)}>
        <div
          className="rounded-xl border px-6 py-3.5"
          style={{ borderColor: `${NAVY}15`, backgroundColor: `${NAVY}04` }}
        >
          <p
            className="mb-2.5 text-center text-xs font-bold uppercase tracking-[0.15em]"
            style={{ color: NAVY }}
          >
            Illustrative Business Impact
          </p>
          <div className="grid grid-cols-4 gap-4">
            {OUTCOMES.map((o, i) => (
              <motion.div
                key={o.metric}
                className="flex flex-col items-center gap-0.5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.08, duration: 0.35 }}
              >
                <span
                  className="text-xl font-bold"
                  style={{ color: o.color }}
                >
                  {o.value}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {o.metric}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Closing line */}
      <motion.p
        className="max-w-xl text-center text-sm leading-relaxed"
        style={{ color: NAVY }}
        {...fadeUp(1)}
      >
        <span className="font-semibold" style={{ color: NAVY }}>
          The model doesn&apos;t just set prices
        </span>
        <span className="text-muted-foreground">
          {" — it learns, adapts, and compounds value with every transaction."}
        </span>
      </motion.p>
    </div>
  );
}
