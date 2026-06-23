"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { makeCurve } from "../visuals/demand-curve";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const TEAL = "#21A5D5";
const GREEN = "#2e7d32";
const RED = "#c62828";
const MUTED = "#8A9AAA";

export const REFINE_TOTAL_STEPS = 6;

type Outcome = "won" | "lost" | "overridden" | "adjusted";

const OUTCOME_COLORS: Record<Outcome, string> = {
  won: GREEN,
  lost: RED,
  overridden: ORANGE,
  adjusted: TEAL,
};

const OUTCOME_LABELS: { outcome: Outcome; label: string; color: string }[] = [
  { outcome: "won", label: "Won", color: GREEN },
  { outcome: "lost", label: "Lost", color: RED },
  { outcome: "overridden", label: "Overridden", color: ORANGE },
  { outcome: "adjusted", label: "Adjusted", color: TEAL },
];

/* ── The three prices from the Execute slide ─────────── */

const ANCHORS = [
  { label: "QuickParts", price: "$22.10", newPrice: "$24.20", t: 0.04, color: ORANGE, refineStep: 3, dx: 14, dy: -18, anchor: "start" as const },
  { label: "Acme", price: "$19.24", newPrice: "$19.80", t: 0.12, color: NAVY, refineStep: 4, dx: 14, dy: -18, anchor: "start" as const },
  { label: "MedSupply", price: "$14.89", newPrice: "$14.50", t: 0.57, color: TEAL, refineStep: 5, dx: 0, dy: -22, anchor: "middle" as const },
];

/* ── Market response dots ────────────────────────────── */

interface MarketDot {
  t: number;
  outcome: Outcome;
  jitterY: number;
  jitterX?: number;
}

const MARKET_DOTS: MarketDot[] = [
  { t: 0.06, outcome: "won", jitterY: -3, jitterX: 2 },
  { t: 0.09, outcome: "won", jitterY: 2 },
  { t: 0.12, outcome: "won", jitterY: -6, jitterX: -2 },
  { t: 0.14, outcome: "won", jitterY: 3 },
  { t: 0.17, outcome: "won", jitterY: -2, jitterX: 1 },
  { t: 0.20, outcome: "overridden", jitterY: 3 },
  { t: 0.23, outcome: "won", jitterY: -1 },
  { t: 0.29, outcome: "won", jitterY: -3 },
  { t: 0.33, outcome: "lost", jitterY: 2 },
  { t: 0.37, outcome: "adjusted", jitterY: -1 },
  { t: 0.40, outcome: "won", jitterY: 2 },
  { t: 0.43, outcome: "overridden", jitterY: -2 },
  { t: 0.47, outcome: "lost", jitterY: 3, jitterX: -3 },
  { t: 0.53, outcome: "lost", jitterY: -2, jitterX: 4 },
  { t: 0.59, outcome: "adjusted", jitterY: 2, jitterX: -2 },
  { t: 0.65, outcome: "lost", jitterY: -3, jitterX: 3 },
  { t: 0.70, outcome: "overridden", jitterY: 1 },
  { t: 0.76, outcome: "won", jitterY: 2, jitterX: -2 },
  { t: 0.80, outcome: "adjusted", jitterY: -2 },
  { t: 0.85, outcome: "lost", jitterY: 3, jitterX: 2 },
  { t: 0.89, outcome: "won", jitterY: -2 },
  { t: 0.93, outcome: "adjusted", jitterY: 1, jitterX: -1 },
];

// Which dots belong to which signal segment
const SEG_WIN = [0, 1, 2, 3, 4, 5, 6];
const SEG_COMP = [12, 13, 14, 15, 16];
const SEG_COST_UP = [17, 18];
const SEG_COST_HOLD = [19, 20, 21];

const CURVE_SLOT = { x: 50, y: 20, w: 460, h: 140 };
const BASE_Y = CURVE_SLOT.y + CURVE_SLOT.h;

/*
  Step 0: Three anchor dots — "Prices from Execute are in market"
  Step 1: Market dots flood in
  Step 2: All segments highlighted + labeled — model detects patterns
  Step 3: Zoom into QuickParts (cost pressure)
  Step 4: Zoom into Acme (win rate)
  Step 5: Zoom into MedSupply (competitor)
*/

export function RefineSlide({ step }: { step: number }) {
  const curve = useMemo(() => makeCurve(CURVE_SLOT, 5), []);

  // Segment region coordinates
  const seg1Start = curve.sampleAt(0.04);
  const seg1End = curve.sampleAt(0.25);
  const seg2Start = curve.sampleAt(0.44);
  const seg2End = curve.sampleAt(0.73);
  const seg3UpStart = curve.sampleAt(0.74);
  const seg3UpEnd = curve.sampleAt(0.82);
  const seg3HoldStart = curve.sampleAt(0.83);
  const seg3HoldEnd = curve.sampleAt(0.95);

  // Dot opacity logic
  const getDotOpacity = () => {
    if (step === 2) return 0.25;
    if (step <= 1) return step === 1 ? 0.8 : 0.6;
    return step >= 3 ? 0.15 : 0.6;
  };

  // Segment region visibility and emphasis
  const getSegOpacity = (seg: "win" | "comp" | "costUp" | "costHold") => {
    if (step === 2) return 0.12;
    if (step === 3 && (seg === "costUp" || seg === "costHold")) return 0.1;
    if (step === 4 && seg === "win") return 0.1;
    if (step === 5 && seg === "comp") return 0.1;
    if (step >= 3) return 0.03;
    return 0;
  };


  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-5xl flex-col items-center justify-center gap-2 px-6 pt-8">
      <motion.span
        className="mb-1 inline-block rounded-full px-3 py-0.5 text-[10px] font-bold tracking-[0.2em] uppercase"
        style={{ backgroundColor: `${TEAL}12`, color: TEAL }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Refine
      </motion.span>
      <motion.h2
        className="text-center text-2xl font-bold tracking-tight sm:text-3xl"
        style={{ color: NAVY }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Detect patterns, refine pricing guidance
      </motion.h2>

      {/* Legend — visible once market dots appear */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            className="flex items-center gap-5"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {OUTCOME_LABELS.map((o) => (
              <div key={o.outcome} className="flex items-center gap-1.5">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: o.color }}
                />
                <span
                  className="text-[11px] font-medium"
                  style={{ color: NAVY }}
                >
                  {o.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to keep layout stable when legend/narrative aren't shown */}
      {step < 1 && <div className="h-5" />}

      <div className="h-10" />

      <div className="flex w-full flex-1 items-center">
        <div className="relative min-w-0 flex-1">
          <motion.div className="rounded-xl border bg-card p-4">
            <svg
              viewBox={`0 0 ${CURVE_SLOT.x + CURVE_SLOT.w + 40} ${BASE_Y + 45}`}
              className="w-full"
            >
              {/* Axes */}
              <line
                x1={CURVE_SLOT.x}
                y1={BASE_Y}
                x2={CURVE_SLOT.x + CURVE_SLOT.w}
                y2={BASE_Y}
                stroke="#E0E4E8"
                strokeWidth={1}
              />
              <line
                x1={CURVE_SLOT.x}
                y1={CURVE_SLOT.y}
                x2={CURVE_SLOT.x}
                y2={BASE_Y}
                stroke="#E0E4E8"
                strokeWidth={1}
              />
              <text
                x={30}
                y={CURVE_SLOT.y + CURVE_SLOT.h / 2}
                fontSize="10"
                fill={MUTED}
                textAnchor="middle"
                transform={`rotate(-90, 30, ${CURVE_SLOT.y + CURVE_SLOT.h / 2})`}
              >
                Price
              </text>
              <text
                x={CURVE_SLOT.x + CURVE_SLOT.w / 2}
                y={BASE_Y + 22}
                fontSize="10"
                fill={MUTED}
                textAnchor="middle"
              >
                Volume
              </text>

              {/* Segment highlight regions */}
              <AnimatePresence>
                {step >= 2 && (
                  <>
                    <motion.rect
                      key="seg-win"
                      x={seg1Start.x - 6}
                      y={CURVE_SLOT.y - 4}
                      width={seg1End.x - seg1Start.x + 12}
                      height={CURVE_SLOT.h + 12}
                      rx={6}
                      fill={GREEN}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: getSegOpacity("win") }}
                      transition={{ duration: 0.5 }}
                    />
                    <motion.rect
                      key="seg-comp"
                      x={seg2Start.x - 6}
                      y={CURVE_SLOT.y - 4}
                      width={seg2End.x - seg2Start.x + 12}
                      height={CURVE_SLOT.h + 12}
                      rx={6}
                      fill={RED}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: getSegOpacity("comp") }}
                      transition={{
                        duration: 0.5,
                        delay: step === 2 ? 0.15 : 0,
                      }}
                    />
                    <motion.rect
                      key="seg-costup"
                      x={seg3UpStart.x - 6}
                      y={CURVE_SLOT.y - 4}
                      width={seg3UpEnd.x - seg3UpStart.x + 12}
                      height={CURVE_SLOT.h + 12}
                      rx={6}
                      fill={ORANGE}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: getSegOpacity("costUp") }}
                      transition={{
                        duration: 0.5,
                        delay: step === 2 ? 0.3 : 0,
                      }}
                    />
                    <motion.rect
                      key="seg-costhold"
                      x={seg3HoldStart.x - 6}
                      y={CURVE_SLOT.y - 4}
                      width={seg3HoldEnd.x - seg3HoldStart.x + 12}
                      height={CURVE_SLOT.h + 12}
                      rx={6}
                      fill={TEAL}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: getSegOpacity("costHold") }}
                      transition={{
                        duration: 0.5,
                        delay: step === 2 ? 0.35 : 0,
                      }}
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Segment labels — only visible at step 2 overview */}
              {step === 2 && (
                <>
                  <motion.text
                    x={(seg1Start.x + seg1End.x) / 2}
                    y={CURVE_SLOT.y + 14}
                    fontSize="9"
                    fontWeight="700"
                    fill={GREEN}
                    textAnchor="middle"
                    style={{
                      stroke: "white",
                      strokeWidth: 3,
                      paintOrder: "stroke" as const,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    High win rate
                  </motion.text>
                  <motion.text
                    x={(seg2Start.x + seg2End.x) / 2}
                    y={CURVE_SLOT.y + 14}
                    fontSize="9"
                    fontWeight="700"
                    fill={RED}
                    textAnchor="middle"
                    style={{
                      stroke: "white",
                      strokeWidth: 3,
                      paintOrder: "stroke" as const,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    Competitive pressure
                  </motion.text>
                  <motion.text
                    x={(seg3UpStart.x + seg3UpEnd.x) / 2}
                    y={CURVE_SLOT.y + 14}
                    fontSize="9"
                    fontWeight="700"
                    fill={ORANGE}
                    textAnchor="middle"
                    style={{
                      stroke: "white",
                      strokeWidth: 3,
                      paintOrder: "stroke" as const,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    Cost ↑
                  </motion.text>
                  <motion.text
                    x={(seg3HoldStart.x + seg3HoldEnd.x) / 2}
                    y={CURVE_SLOT.y + 14}
                    fontSize="9"
                    fontWeight="700"
                    fill={TEAL}
                    textAnchor="middle"
                    style={{
                      stroke: "white",
                      strokeWidth: 3,
                      paintOrder: "stroke" as const,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45, duration: 0.4 }}
                  >
                    Price sensitive
                  </motion.text>
                </>
              )}

              {/* Demand curve */}
              <motion.path
                d={curve.d}
                fill="none"
                stroke={NAVY}
                strokeWidth={2}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: step === 2 ? 0.2 : 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />

              {/* Market response dots — visible from step 1 */}
              {step >= 1 &&
                MARKET_DOTS.map((dot, i) => {
                  const pt = curve.sampleAt(dot.t);
                  const cx = pt.x + (dot.jitterX ?? 0);
                  const cy = pt.y + dot.jitterY;
                  const dotColor = OUTCOME_COLORS[dot.outcome];

                  return (
                    <motion.circle
                      key={`dot-${i}`}
                      cx={cx}
                      cy={cy}
                      r={4.5}
                      fill={dotColor}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: getDotOpacity(), scale: 1 }}
                      transition={{
                        delay: step === 1 ? 0.4 + i * 0.04 : 0.1,
                        duration: 0.3,
                        type: "spring",
                        stiffness: 300,
                      }}
                    />
                  );
                })}

              {/* ── Execute price anchors ─────────────────── */}
              {ANCHORS.map((anchor, ai) => {
                const pt = curve.sampleAt(anchor.t);
                const refined = step >= anchor.refineStep;
                const isBeingRefined = step === anchor.refineStep;
                const showText = step <= 1 || isBeingRefined;
                const anchorOpacity =
                  step === 2
                    ? 0
                    : step <= 1
                      ? 1
                      : isBeingRefined
                        ? 1
                        : 0.35;
                const textOpacity = showText ? anchorOpacity : 0;
                const textX = pt.x + anchor.dx;
                const haloStyle = {
                  stroke: "white",
                  strokeWidth: 4,
                  paintOrder: "stroke" as const,
                };

                return (
                  <motion.g key={anchor.label}>
                    {isBeingRefined && (
                      <motion.circle
                        cx={pt.x}
                        cy={pt.y}
                        r={20}
                        fill="none"
                        stroke={anchor.color}
                        strokeWidth={1.5}
                        strokeDasharray="4 3"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                          opacity: [0, 0.5, 0.25],
                          scale: [0.5, 1, 1],
                        }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                      />
                    )}

                    <motion.circle
                      cx={pt.x}
                      cy={pt.y}
                      r={7}
                      fill="white"
                      stroke={anchor.color}
                      strokeWidth={2.5}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: anchorOpacity, scale: 1 }}
                      transition={{
                        delay: ai * 0.2 + 0.15,
                        type: "spring",
                        stiffness: 200,
                      }}
                    />

                    <motion.text
                      x={textX}
                      y={pt.y + anchor.dy}
                      fontSize="9"
                      fontWeight="700"
                      fill={anchor.color}
                      textAnchor={anchor.anchor}
                      style={haloStyle}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: textOpacity }}
                      transition={{ delay: ai * 0.2 + 0.3 }}
                    >
                      {anchor.label}
                    </motion.text>

                    <motion.text
                      x={textX}
                      y={pt.y + anchor.dy + 12}
                      fontSize="11"
                      fontWeight="800"
                      textAnchor={anchor.anchor}
                      style={haloStyle}
                      fill={anchor.color}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: textOpacity }}
                      transition={{ delay: ai * 0.2 + 0.4 }}
                    >
                      {isBeingRefined ? anchor.newPrice : anchor.price}
                    </motion.text>
                  </motion.g>
                );
              })}
            </svg>
          </motion.div>

          {/* Context / signal panels — upper right */}
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="ctx-0"
                className="absolute right-6 top-6 z-10 w-60 rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur-sm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <p
                  className="text-lg font-bold leading-snug"
                  style={{ color: NAVY }}
                >
                  Recommendations from Execute are in market
                </p>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: NAVY, opacity: 0.7 }}
                >
                  Each customer got a model-driven price. Now the model watches
                  how the market responds.
                </p>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div
                key="ctx-1"
                className="absolute right-6 top-6 z-10 w-60 rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur-sm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: 0, duration: 0.25 }}
              >
                <p
                  className="text-lg font-bold leading-snug"
                  style={{ color: NAVY }}
                >
                  Market data flows in
                </p>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: NAVY, opacity: 0.7 }}
                >
                  Every deal outcome is a signal — the model separates noise
                  from patterns worth acting on.
                </p>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="ctx-2"
                className="absolute bottom-8 left-6 z-10 w-64 rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur-sm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <p
                  className="text-lg font-bold leading-snug"
                  style={{ color: NAVY }}
                >
                  The model detects market segmentation
                </p>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: NAVY, opacity: 0.7 }}
                >
                  Patterns emerge in specific segments — each signals a
                  different refinement.
                </p>
              </motion.div>
            )}

            {/* Zoom step signal panels — consolidated with model refinement */}
            {step === 3 && (
              <motion.div
                key="s-cost"
                className="absolute right-6 top-6 z-10 w-60 rounded-xl border bg-white/95 p-4 shadow-lg backdrop-blur-sm"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="flex size-6 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: ORANGE }}
                  >
                    $
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: NAVY }}
                  >
                    Signal: Cost pressure
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: NAVY, opacity: 0.8 }}
                >
                  Few alternatives in this niche — cost increase passes through
                  to price.
                </p>
                <motion.div
                  className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2"
                  style={{ backgroundColor: `${NAVY}0A` }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <span className="text-lg font-bold" style={{ color: ORANGE }}>+$2.10</span>
                  <span className="text-xs" style={{ color: MUTED }}>No competition in niche</span>
                </motion.div>
                <motion.div
                  className="mt-2 flex items-center justify-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <span className="text-sm" style={{ color: NAVY }}>$22.10</span>
                  <span className="text-xs" style={{ color: MUTED }}>→</span>
                  <span className="text-sm" style={{ color: NAVY }}>$24.20</span>
                </motion.div>
              </motion.div>
            )}
            {step === 4 && (
              <motion.div
                key="s-win"
                className="absolute right-6 top-6 z-10 w-60 rounded-xl border bg-white/95 p-4 shadow-lg backdrop-blur-sm"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="flex size-6 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: GREEN }}
                  >
                    ↑
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: NAVY }}
                  >
                    Signal: Win rate up
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: NAVY, opacity: 0.8 }}
                >
                  Win rate climbing — pattern, not noise. Opportunity to price
                  higher.
                </p>
                <motion.div
                  className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2"
                  style={{ backgroundColor: `${NAVY}0A` }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <span className="text-lg font-bold" style={{ color: GREEN }}>+$0.56</span>
                  <span className="text-xs" style={{ color: MUTED }}>Winning more than expected</span>
                </motion.div>
                <motion.div
                  className="mt-2 flex items-center justify-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <span className="text-sm" style={{ color: NAVY }}>$19.24</span>
                  <span className="text-xs" style={{ color: MUTED }}>→</span>
                  <span className="text-sm" style={{ color: NAVY }}>$19.80</span>
                </motion.div>
              </motion.div>
            )}
            {step === 5 && (
              <motion.div
                key="s-comp"
                className="absolute right-6 top-6 z-10 w-60 rounded-xl border bg-white/95 p-4 shadow-lg backdrop-blur-sm"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="flex size-6 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: RED }}
                  >
                    ↓
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: NAVY }}
                  >
                    Signal: Competitor
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: NAVY, opacity: 0.8 }}
                >
                  New competitor lowering willingness to pay in specific
                  regions.
                </p>
                <motion.div
                  className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2"
                  style={{ backgroundColor: `${NAVY}0A` }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <span className="whitespace-nowrap text-lg font-bold" style={{ color: RED }}>–$0.39</span>
                  <span className="text-xs" style={{ color: MUTED }}>New entrant undercutting</span>
                </motion.div>
                <motion.div
                  className="mt-2 flex items-center justify-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <span className="text-sm" style={{ color: NAVY }}>$14.89</span>
                  <span className="text-xs" style={{ color: MUTED }}>→</span>
                  <span className="text-sm" style={{ color: NAVY }}>$14.50</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
