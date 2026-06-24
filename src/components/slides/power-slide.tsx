"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const NAVY = "#00446A";
const TEAL = "#21A5D5";
const ORANGE = "#E56910";
const GREEN = "#2e7d32";
const PURPLE = "#7B5EA7";
const MUTED = "#5A6A78";
const CARD_BG = "#F5F8FA";
const CARD_BORDER = "#CBD5DE";

export const POWER_TOTAL_STEPS = 2;

/* ─── Narrative text per step ─── */

interface NarrativeSeg {
  text: string;
  bold?: boolean;
  color?: string;
}

const STEP_NARRATIVES: Record<string, NarrativeSeg[]> = {
  0: [
    { text: "A distributor with " },
    { text: "2,400 accounts and 15,000 SKUs", bold: true, color: TEAL },
    { text: " needs optimized pricing across every segment. The model begins by ingesting four categories of data." },
  ],
  1: [
    { text: "The model ingests " },
    { text: "four categories of data", bold: true, color: TEAL },
    { text: " — building a complete picture of transactions, market conditions, customers, and outcomes." },
  ],
  "2-raw": [
    { text: "The " },
    { text: "ML engine", bold: true, color: PURPLE },
    { text: " distills millions of data points into " },
    { text: "dense, actionable pricing signals", bold: true },
    { text: " — precise, but hard to act on without interpretation." },
  ],
  "2-ai": [
    { text: "AI guidance " },
    { text: "builds conviction", bold: true, color: TEAL },
    { text: " behind each recommendation, empowering teams to " },
    { text: "confidently execute in market", bold: true },
    { text: ". The result is a repeatable mechanism for delivering optimized pricing at scale." },
  ],
};

function NarrativeContent({ segs }: { segs: NarrativeSeg[] }) {
  return (
    <>
      {segs.map((seg, i) =>
        seg.bold ? (
          <span key={i} className="font-bold" style={{ color: seg.color }}>
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );
}

function Narrative({ narrativeKey }: { narrativeKey: string }) {
  const segs = STEP_NARRATIVES[narrativeKey] ?? STEP_NARRATIVES["0"];
  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={narrativeKey}
        className="mx-auto max-w-2xl text-center text-[1.05rem] leading-relaxed"
        style={{ color: NAVY }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3 }}
      >
        <NarrativeContent segs={segs} />
      </motion.p>
    </AnimatePresence>
  );
}

/* ─── Data ─── */

const INPUT_FEEDS = [
  {
    label: "Transaction History",
    color: NAVY,
    count: "14,200 records",
    intro: "Pull every historical transaction…",
    chips: ["Acme Corp · $58.20", "Beta Mfg · $42.10", "Coastal · $64.50", "Delta · $31.75"],
  },
  {
    label: "Market Signals",
    color: ORANGE,
    count: "36 features",
    intro: "Layer in real-time market signals…",
    chips: ["Resin ↑ 4.2%", "Comp avg $59.10", "Q3 peak", "+2.8% growth"],
  },
  {
    label: "Customer Attributes",
    color: GREEN,
    count: "2,400 accounts",
    intro: "Map customer profiles & behavior…",
    chips: ["Strategic / Core / Opp", "Volume & contracts", "Tenure 3.2 yrs", "Product mix"],
  },
  {
    label: "Win / Loss Patterns",
    color: PURPLE,
    count: "18 months",
    intro: "Learn from 18 months of outcomes.",
    chips: ["Win rate 87%", "Elasticity −0.34", "Discount 6.2%", "Lost gap $4.20"],
  },
];

const ANALYSIS_STEPS = [
  { label: "Pattern Recognition", detail: "Analyzes 14,200 historical transactions to identify measurable price-outcome relationships", color: NAVY },
  { label: "Feature Extraction", detail: "Weights 36 market signals and customer attributes by predictive power per segment", color: TEAL },
  { label: "Scenario Modeling", detail: "Produces deterministic price recommendations tailored to each customer, product, and market scenario", color: PURPLE },
];

const PRODUCT_OUTPUT = {
  product: "Precision Bearing SKU #A-7200",
  listPrice: "$17.50",
  optimizedPrice: "$19.24",
  confidence: "94%",
  margin: "+9.9%",
  rawStats: [
    "p_opt: $19.24 | conf: 0.94 | list: $17.50",
    "ε_price: −0.34 | elasticity_band: LOW",
    "Δ_margin: +990bps vs. list baseline",
    "feat_wt: cost_idx(0.38), comp_gap(0.28), vol_trend(0.21), seas(0.13)",
    "n_obs: 14,200 txns | 18mo lookback",
    "cost_pass: +$1.12/unit (steel_idx Q3)",
    "comp_avg: $18.90 | headroom: +$0.34",
  ],
  rationale: "The model recommends $19.24 — 10% above list. Steel costs are up $1.12/unit, and the competitive average sits at $18.90, leaving room to price above. Historical transaction data across 14,200 orders confirms low price elasticity in this product category.",
  keyDrivers: ["Steel cost pass-through (+$1.12)", "Competitive headroom ($18.90 avg)", "Low elasticity (14,200 txns)", "Q3 seasonal demand"],
};

/* ─── Sub-components ─── */

function TimelineInputs({ show }: { show: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!show) { setPhase(0); return; }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const delays = [
      400,   // node 0 appears
      1200,  // arrow 0→1 draws
      1500,  // node 1 appears
      2300,  // arrow 1→2 draws
      2600,  // node 2 appears
      3400,  // arrow 2→3 draws
      3700,  // node 3 appears
    ];
    delays.forEach((d, i) => {
      timers.push(setTimeout(() => setPhase(i + 1), d));
    });
    return () => timers.forEach(clearTimeout);
  }, [show]);

  return (
    <div className="flex flex-col gap-0 w-full max-w-3xl mx-auto">
      {INPUT_FEEDS.map((feed, i) => {
        const nodeVisible = phase >= i * 2 + 1;
        const arrowVisible = phase >= i * 2 + 2;
        return (
          <div key={i}>
            {/* Node row */}
            <motion.div
              className="flex items-center gap-3 rounded-lg px-4 py-2"
              style={{
                backgroundColor: nodeVisible ? "white" : "transparent",
                boxShadow: nodeVisible ? `0 2px 12px ${feed.color}12` : "none",
                border: nodeVisible ? `1.5px solid ${feed.color}40` : "1.5px solid transparent",
              }}
              initial={{ opacity: 0, x: -30 }}
              animate={nodeVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.4, type: "spring", damping: 20 }}
            >
              <div
                className="flex size-7 items-center justify-center rounded-lg shrink-0"
                style={{ backgroundColor: `${feed.color}12` }}
              >
                <DataIcon index={i} color={feed.color} size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <motion.p
                  className="text-sm font-semibold leading-snug"
                  style={{ color: feed.color }}
                  initial={{ opacity: 0 }}
                  animate={nodeVisible ? { opacity: 1 } : {}}
                  transition={{ delay: 0.15 }}
                >
                  {feed.intro}
                </motion.p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>{feed.label}</span>
                  <span className="text-[10px]" style={{ color: `${feed.color}80` }}>·</span>
                  <span className="text-[10px] font-medium" style={{ color: `${feed.color}90` }}>{feed.count}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 max-w-[220px] justify-end">
                {feed.chips.map((chip, j) => (
                  <motion.span
                    key={j}
                    className="rounded-full px-2 py-0.5 text-[9px] font-medium whitespace-nowrap"
                    style={{
                      backgroundColor: `${feed.color}08`,
                      color: `${feed.color}BB`,
                      border: `1px solid ${feed.color}20`,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={nodeVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ delay: 0.2 + j * 0.06 }}
                  >
                    {chip}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Arrow connector to next node */}
            {i < INPUT_FEEDS.length - 1 && (
              <div className="flex justify-start pl-7 -my-1">
                <svg width="16" height="14" viewBox="0 0 20 20">
                  <motion.path
                    d="M10 0 L10 14 M6 11 L10 16 L14 11"
                    stroke={TEAL}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={arrowVisible ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CompactInputLabel({ feed, index }: { feed: (typeof INPUT_FEEDS)[number]; index: number }) {
  return (
    <motion.div
      className="flex items-center gap-2 rounded-lg border px-3 py-2"
      style={{ borderColor: CARD_BORDER, backgroundColor: CARD_BG }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: feed.color }} />
      <span className="text-[11px] font-semibold" style={{ color: feed.color }}>{feed.label}</span>
      <span className="ml-auto text-[9px] text-muted-foreground">{feed.count}</span>
    </motion.div>
  );
}

function DigestTransition({ active, view, onViewChange }: { active: boolean; view: "ai" | "raw"; onViewChange: (v: "ai" | "raw") => void }) {
  const p = PRODUCT_OUTPUT;

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-3 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {active && (
        <>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="flex rounded-full p-0.5"
              style={{ backgroundColor: `${NAVY}08`, border: `1px solid ${NAVY}15` }}
            >
              <button
                onClick={() => onViewChange("raw")}
                className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-all duration-200"
                style={{
                  backgroundColor: view === "raw" ? NAVY : "transparent",
                  color: view === "raw" ? "white" : MUTED,
                }}
              >
                Raw Output
              </button>
              <button
                onClick={() => onViewChange("ai")}
                className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-all duration-200"
                style={{
                  backgroundColor: view === "ai" ? TEAL : "transparent",
                  color: view === "ai" ? "white" : MUTED,
                }}
              >
                AI Guidance
              </button>
            </div>
          </motion.div>

          <motion.div
            className="mx-auto w-full max-w-2xl rounded-xl border bg-white"
            style={{ borderColor: `${TEAL}40`, boxShadow: `0 4px 24px ${TEAL}15`, padding: "1.5rem 2rem" }}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", damping: 20 }}
          >
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="text-base font-bold" style={{ color: NAVY }}>{p.product}</span>
                <span className="ml-3 text-xs" style={{ color: MUTED }}>List: {p.listPrice}/unit</span>
              </div>
              <motion.span
                className="rounded-full px-3 py-1 text-xs font-bold"
                style={{ backgroundColor: `${GREEN}12`, color: GREEN }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                {p.confidence} confidence
              </motion.span>
            </div>

            <div className="flex items-baseline gap-3 mb-3 mt-2">
              <motion.span
                className="text-3xl font-bold"
                style={{ color: NAVY }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {p.optimizedPrice}
              </motion.span>
              <span className="text-sm font-semibold" style={{ color: ORANGE }}>{p.margin} margin vs. list</span>
            </div>

            <AnimatePresence mode="wait">
              {view === "ai" ? (
                <motion.div
                  key="ai-view"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="rounded-lg border p-4 text-sm leading-relaxed"
                    style={{ borderColor: `${TEAL}30`, backgroundColor: `${TEAL}04`, color: NAVY }}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: TEAL }} />
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: TEAL }}>AI Rationale</span>
                    </div>
                    {p.rationale}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.keyDrivers.map((d, j) => (
                      <motion.span
                        key={j}
                        className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
                        style={{ backgroundColor: `${NAVY}08`, color: NAVY }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 + j * 0.04 }}
                      >
                        {d}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="raw-view"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="rounded-lg border p-4 font-mono text-xs leading-relaxed"
                    style={{ borderColor: `${NAVY}25`, backgroundColor: `${NAVY}06`, color: NAVY }}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: NAVY }} />
                      <span className="text-[10px] font-bold uppercase tracking-wider font-sans" style={{ color: NAVY }}>Raw Model Output</span>
                    </div>
                    {p.rawStats.map((line, j) => (
                      <motion.div
                        key={j}
                        className="py-0.5"
                        style={{ color: `${NAVY}CC` }}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: j * 0.05 }}
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}


function DataIcon({ index, color, size = 26 }: { index: number; color: string; size?: number }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (index === 0) return (
    <svg {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
  if (index === 1) return (
    <svg {...props}>
      <path d="M3 3v18h18" />
      <path d="M7 16l4-6 4 4 5-8" />
    </svg>
  );
  if (index === 2) return (
    <svg {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
  return (
    <svg {...props}>
      <path d="M12 20V10" />
      <path d="M18 20V4" />
      <path d="M6 20v-4" />
      <circle cx="12" cy="7" r="2" />
      <circle cx="18" cy="2" r="1" />
    </svg>
  );
}

function FlowArrow({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-center px-2">
      <svg width="40" height="24" viewBox="0 0 40 24">
        <motion.path
          d="M4 12 L28 12 M24 6 L32 12 L24 18"
          stroke={TEAL}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          animate={
            active
              ? { strokeOpacity: [0.2, 0.7, 0.2], pathLength: [0.4, 1, 0.4] }
              : { strokeOpacity: 0.15 }
          }
          transition={{ duration: 1.8, repeat: active ? Infinity : 0, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

/* ─── Main slide ─── */

export function PowerSlide({ step = 0 }: { step: number }) {
  const showInputs = step >= 1;

  const narrativeKey = String(step);

  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-6xl flex-col items-center justify-start px-6 pt-4">
      {/* Header */}
      <motion.span
        className="mb-1 inline-block rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{ backgroundColor: `${NAVY}10`, color: NAVY }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Power
      </motion.span>
      <motion.h2
        className="text-center text-2xl font-bold tracking-tight sm:text-3xl"
        style={{ color: NAVY }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        AI-powered pricing guidance
      </motion.h2>

      {/* Narrative — subtext when visuals are active */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            className="flex min-h-[3.5rem] items-center justify-center px-4 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Narrative narrativeKey={narrativeKey} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual area */}
      <div className="relative w-full flex-1 min-h-0 overflow-hidden">
        {/* Step 0: Narrative + data category icons */}
        <AnimatePresence>
          {step === 0 && (
            <motion.div
              key="hero-text"
              className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              transition={{ duration: 0.4 }}
            >
              <motion.p
                className="mx-auto max-w-3xl text-center text-lg leading-relaxed sm:text-xl"
                style={{ color: MUTED }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                A specialty distributor serves
              </motion.p>
              <motion.p
                className="mx-auto max-w-3xl text-center text-3xl font-bold sm:text-4xl"
                style={{ color: NAVY }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <span style={{ color: TEAL }}>2,400 accounts</span> ×{" "}
                <span style={{ color: ORANGE }}>15,000 SKUs</span>
              </motion.p>
              <motion.p
                className="mx-auto max-w-2xl text-center text-lg leading-relaxed sm:text-xl"
                style={{ color: MUTED }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Each combination needs a tailored price. The model ingests four categories of data to produce optimized guidance for every deal.
              </motion.p>

              <motion.div
                className="flex items-center gap-2 mt-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <span className="text-sm font-medium" style={{ color: TEAL }}>
                  See how the model starts
                </span>
                <motion.span
                  style={{ color: TEAL }}
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 1: Input data ingestion */}
        <AnimatePresence>
          {showInputs && (
            <motion.div
              key="data-ingest"
              className="absolute inset-0 flex items-start justify-center pt-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center justify-center flex-1">
                <motion.div
                  className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3"
                  style={{ color: MUTED }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Data Ingestion
                </motion.div>
                <TimelineInputs show={showInputs} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
