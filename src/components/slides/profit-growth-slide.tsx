"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Target, ShieldCheck, ArrowDownRight, Zap } from "lucide-react";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const TEAL = "#21A5D5";
const GREEN = "#2e7d32";
const MUTED_NAVY = "#8A9AAA";

/* ── Seeded PRNG ── */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ── Chart constants ── */
const CHART_W = 700;
const CHART_H = 240;
const PAD = 30;
const DOT_COUNT = 140;

function demandCurveY(x: number): number {
  const t = (x - PAD) / (CHART_W - 2 * PAD);
  return PAD + (CHART_H - 2 * PAD) * (0.12 + 0.72 * Math.exp(-2.8 * t));
}

function curvePath(): string {
  const pts: string[] = [];
  for (let px = PAD; px <= CHART_W - PAD; px += 2) {
    pts.push(`${px},${demandCurveY(px)}`);
  }
  return `M ${pts[0]} ${pts.slice(1).map((p) => `L ${p}`).join(" ")}`;
}

const DEMAND_D = curvePath();

interface Dot {
  sqX: number; sqY: number;
  optX: number; optY: number;
  color: string;
}

function generateDots(): Dot[] {
  const rng = seededRandom(42);
  const colors = [NAVY, TEAL, ORANGE, GREEN];
  return Array.from({ length: DOT_COUNT }, (_, i) => {
    const baseX = PAD + 10 + rng() * (CHART_W - 2 * PAD - 20);
    const baseY = demandCurveY(baseX);
    const sqJitter = (rng() - 0.5) * 2 * 60;
    const optJitter = (rng() - 0.5) * 2 * 12;
    return {
      sqX: baseX + (rng() - 0.5) * 16,
      sqY: Math.max(PAD + 4, Math.min(CHART_H - PAD - 4, baseY + sqJitter)),
      optX: baseX,
      optY: Math.max(PAD + 4, Math.min(CHART_H - PAD - 4, baseY + optJitter)),
      color: colors[i % colors.length],
    };
  });
}

const DOTS = generateDots();

/* ── KPI data ── */
const KPIS = [
  { label: "Margin Uplift", before: "28%", after: "34%", icon: TrendingUp, color: GREEN },
  { label: "Win Rate", before: "41%", after: "47%", icon: Target, color: TEAL },
  { label: "Price Consistency", before: "Low", after: "High", icon: ShieldCheck, color: NAVY },
  { label: "Override Rate", before: "38%", after: "12%", icon: ArrowDownRight, color: ORANGE },
  { label: "Quote Speed", before: "3 days", after: "Real-time", icon: Zap, color: TEAL },
];

/* ── Animated counter ── */
function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const p = Math.min((now - start) / 1000 / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return <>{count.toLocaleString()}</>;
}

/* ── Highlight groups for status-quo scanning animation ── */
const HIGHLIGHT_BATCH_SIZE = 3;
const HIGHLIGHT_CYCLE_MS = 2200;
const HIGHLIGHT_GROUPS: number[][] = [];
{
  const rng = seededRandom(99);
  const indices = Array.from({ length: DOT_COUNT }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  for (let i = 0; i < indices.length; i += HIGHLIGHT_BATCH_SIZE) {
    HIGHLIGHT_GROUPS.push(indices.slice(i, i + HIGHLIGHT_BATCH_SIZE));
  }
}

const REVIEW_LABELS = [
  "Priced 12% below floor",
  "Margin override approved",
  "Stale quote sent to customer",
  "Discount exceeded threshold",
  "Missed price increase window",
  "Inconsistent regional pricing",
  "Manual exception — no audit trail",
  "Competitor intel ignored",
];

const LEAKAGE_PER_CYCLE = [
  4200, 3800, 5100, 2900, 6300, 4700, 3400, 5600,
  4100, 3200, 5900, 2700, 4500, 6100, 3600, 5300,
  4800, 3100, 5700, 2500, 4400, 6200, 3900, 5400,
];

/* ── Model scan: clusters analyzed on status-quo positions before sweep ── */
const MODEL_SCAN_BATCH_SIZE = 20;
const MODEL_SCAN_CYCLE_MS = 1000;
const MODEL_SCAN_GROUPS: number[][] = [];
{
  const sorted = Array.from({ length: DOT_COUNT }, (_, i) => i)
    .sort((a, b) => DOTS[a].sqX - DOTS[b].sqX);
  for (let i = 0; i < sorted.length; i += MODEL_SCAN_BATCH_SIZE) {
    MODEL_SCAN_GROUPS.push(sorted.slice(i, i + MODEL_SCAN_BATCH_SIZE));
  }
}

const MODEL_SCAN_LABELS = [
  "Analyzing segment elasticity…",
  "Optimizing price points…",
  "Calibrating margin targets…",
  "Applying competitive intel…",
  "Cross-referencing accounts…",
  "Validating constraints…",
  "Scoring risk profiles…",
  "Finalizing recommendations…",
];

/* ── Sweep timing: stagger for snap to curve after scan ── */
const SWEEP_DURATION = 2.2;
const DOT_SWEEP_DELAY = DOTS.map(
  (d) => ((d.sqX - PAD) / (CHART_W - 2 * PAD)) * SWEEP_DURATION
);

/* ── Step narratives ── */
const STEP_NARRATIVES = [
  "The model now manages 14,200 prices × 2,400 accounts — let's see the impact with vs. without it.",
  "Each manual review introduces errors and inconsistency — margin leaks with every decision.",
  "The Dynamic Pricing Model optimizes every price point simultaneously.",
  "The model analyzes segment elasticity, margins, and competitive position across every combination.",
  "Prices snap to model-optimized positions — tighter to the demand curve, less leakage.",
];

/* ── Main slide ── */
export const PROFIT_GROWTH_TOTAL_STEPS = 5;

export function ProfitGrowthSlide({ step = 0, onAutoAdvance }: { step: number; onAutoAdvance?: () => void }) {
  const showChart = step >= 1;
  const announcing = step === 2;
  const showScan = step >= 3;
  const showSweep = step >= 4;
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [leakage, setLeakage] = useState(0);
  const [modelScanIdx, setModelScanIdx] = useState(-1);
  const [sweepStarted, setSweepStarted] = useState(false);
  const scanning = showScan && !showSweep && modelScanIdx >= 0;

  useEffect(() => {
    if (step !== 1) return;
    let cycle = 0;
    const timer = setInterval(() => {
      cycle++;
      if (cycle >= 3) {
        clearInterval(timer);
        onAutoAdvance?.();
        return;
      }
      setHighlightIdx((prev) => {
        const next = (prev + 1) % HIGHLIGHT_GROUPS.length;
        setLeakage((l) => l + LEAKAGE_PER_CYCLE[next % LEAKAGE_PER_CYCLE.length]);
        return next;
      });
    }, HIGHLIGHT_CYCLE_MS);
    return () => clearInterval(timer);
  }, [step, onAutoAdvance]);

  useEffect(() => {
    if (!showScan || showSweep) {
      setModelScanIdx(-1);
      return;
    }
    let cycle = 0;
    setModelScanIdx(0);
    const timer = setInterval(() => {
      cycle++;
      if (cycle >= MODEL_SCAN_GROUPS.length) {
        cycle = 0;
      }
      if (cycle === 7) {
        clearInterval(timer);
        onAutoAdvance?.();
        return;
      }
      setModelScanIdx(cycle);
    }, MODEL_SCAN_CYCLE_MS);
    return () => clearInterval(timer);
  }, [showScan, showSweep, onAutoAdvance]);

  useEffect(() => {
    if (!announcing) return;
    const timer = setTimeout(() => onAutoAdvance?.(), 2500);
    return () => clearTimeout(timer);
  }, [announcing, onAutoAdvance]);

  useEffect(() => {
    if (!showSweep) {
      setSweepStarted(false);
      return;
    }
    setSweepStarted(true);
  }, [showSweep]);

  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-6xl flex-col items-center justify-center px-6 pt-8">
      <motion.span
        className="mb-1 inline-block rounded-full px-3 py-0.5 text-[10px] font-bold tracking-[0.2em] uppercase"
        style={{ backgroundColor: `${NAVY}10`, color: NAVY }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Profit Growth
      </motion.span>
      <motion.h2
        className="text-center text-2xl font-bold tracking-tight sm:text-3xl"
        style={{ color: NAVY }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        Smarter pricing decisions for profit growth
      </motion.h2>

      <div className="flex min-h-[3rem] items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            className="max-w-2xl text-center text-[1.05rem] leading-relaxed"
            style={{ color: NAVY }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {STEP_NARRATIVES[step]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="relative w-full flex-1 min-h-0 overflow-hidden">
        <AnimatePresence>
          {step === 0 && (
            <motion.div
              key="hero-stats"
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              transition={{ duration: 0.4 }}
            >
              <motion.p
                className="text-3xl font-bold sm:text-4xl"
                style={{ color: NAVY }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 150, damping: 15 }}
              >
                <span style={{ color: TEAL }}><AnimatedCounter target={14200} duration={2.5} /> prices</span>
                {" "}×{" "}
                <span style={{ color: ORANGE }}><AnimatedCounter target={2400} duration={2} /> accounts</span>
              </motion.p>
              <motion.p
                className="text-sm font-medium"
                style={{ color: MUTED_NAVY }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                optimized continuously
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 1: Chart visual */}
        <AnimatePresence>
          {showChart && (
            <motion.div
              key="chart-view"
              className="absolute inset-0 flex flex-row gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* KPIs — vertical stack on the left (after sweep) */}
              <AnimatePresence>
                {sweepStarted && (
                  <motion.div
                    className="flex w-48 shrink-0 flex-col gap-2 pt-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: SWEEP_DURATION + 0.2 }}
                  >
                    {KPIS.map((kpi, i) => {
                      const Icon = kpi.icon;
                      return (
                        <motion.div
                          key={kpi.label}
                          className="rounded-xl border bg-card px-3 py-2"
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: SWEEP_DURATION + 0.3 + i * 0.1, duration: 0.4 }}
                        >
                          <div className="mb-0.5 flex items-center gap-1.5">
                            <div
                              className="flex size-5 items-center justify-center rounded-md"
                              style={{ backgroundColor: `${kpi.color}12` }}
                            >
                              <Icon size={11} style={{ color: kpi.color }} />
                            </div>
                            <span className="text-[11px] font-semibold" style={{ color: NAVY }}>
                              {kpi.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-light text-muted-foreground line-through decoration-1">
                              {kpi.before}
                            </span>
                            <span className="text-[10px] text-muted-foreground">→</span>
                            <motion.span
                              className="text-base font-bold"
                              style={{ color: kpi.color }}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: SWEEP_DURATION + 0.5 + i * 0.1, type: "spring" }}
                            >
                              {kpi.after}
                            </motion.span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Morphing chart */}
              <motion.div
                className="relative min-h-0 flex-1 rounded-xl border bg-card p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
                  <line x1={PAD} y1={CHART_H - PAD} x2={CHART_W - PAD} y2={CHART_H - PAD} stroke="#e2e8f0" strokeWidth={0.8} />
                  <line x1={PAD} y1={PAD} x2={PAD} y2={CHART_H - PAD} stroke="#e2e8f0" strokeWidth={0.8} />
                  <text x={CHART_W / 2} y={CHART_H - 8} fontSize="9" fill="#94a3b8" textAnchor="middle">Volume →</text>
                  <text x={12} y={CHART_H / 2} fontSize="9" fill="#94a3b8" textAnchor="middle" transform={`rotate(-90, 12, ${CHART_H / 2})`}>Price →</text>

                  <motion.path
                    d={DEMAND_D}
                    fill="none"
                    strokeWidth={2}
                    strokeLinecap="round"
                    animate={{
                      stroke: sweepStarted ? GREEN : MUTED_NAVY,
                      opacity: sweepStarted ? 0.6 : 0.25,
                    }}
                    transition={{ duration: 0.8 }}
                  />

                  {DOTS.map((dot, i) => {
                    const isManualHL = step === 1 && HIGHLIGHT_GROUPS[highlightIdx]?.includes(i);
                    const isModelHL = scanning && MODEL_SCAN_GROUPS[modelScanIdx]?.includes(i);
                    const sweepDelay = DOT_SWEEP_DELAY[i];

                    let opacity = 0.15;
                    let scale = 1;
                    let fill = "#B0BEC5";
                    let cx = dot.sqX;
                    let cy = dot.sqY;

                    if (sweepStarted) {
                      opacity = 0.85;
                      scale = 1;
                      fill = dot.color;
                      cx = dot.optX;
                      cy = dot.optY;
                    } else if (scanning) {
                      opacity = isModelHL ? 1 : 0.12;
                      scale = isModelHL ? 1.5 : 1;
                      fill = isModelHL ? GREEN : "#C0C8D0";
                    } else if (isManualHL) {
                      opacity = 1;
                      scale = 1.5;
                      fill = dot.color;
                    }

                    return (
                      <motion.circle
                        key={i}
                        r={2.8}
                        initial={{ opacity: 0, scale: 0, cx: dot.sqX, cy: dot.sqY }}
                        animate={{ opacity, scale, fill, cx, cy }}
                        transition={{
                          opacity: { delay: sweepStarted ? sweepDelay : step === 1 ? 0.3 + i * 0.005 : 0, duration: 0.3 },
                          fill: { delay: sweepStarted ? sweepDelay : 0, duration: 0.3 },
                          scale: { duration: 0.3 },
                          cx: { delay: sweepStarted ? sweepDelay : 0, duration: sweepStarted ? 0.8 : 0, ease: "easeOut" },
                          cy: { delay: sweepStarted ? sweepDelay : 0, duration: sweepStarted ? 0.8 : 0, ease: "easeOut" },
                        }}
                      />
                    );
                  })}

                  {/* Model scan rings — green highlights on status-quo positions */}
                  {scanning &&
                    MODEL_SCAN_GROUPS[modelScanIdx]?.map((di) => {
                      const dot = DOTS[di];
                      return (
                        <motion.circle
                          key={`mscan-${di}`}
                          cx={dot.sqX}
                          cy={dot.sqY}
                          r={6}
                          fill="none"
                          stroke={GREEN}
                          strokeWidth={1.2}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: [0, 0.9, 0.4], scale: [0.5, 1.2, 1.05] }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      );
                    })}

                  {/* Model scan label — top-left, mirrors the manual review label */}
                  {scanning && (
                    <AnimatePresence mode="wait">
                      <motion.g
                        key={`mscan-label-${modelScanIdx}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <rect
                          x={PAD + 12}
                          y={PAD + 4}
                          width={200}
                          height={26}
                          rx={6}
                          fill={GREEN}
                          opacity={0.92}
                        />
                        <text
                          x={PAD + 112}
                          y={PAD + 21}
                          fontSize="11"
                          fontWeight="600"
                          fill="white"
                          textAnchor="middle"
                        >
                          {MODEL_SCAN_LABELS[modelScanIdx % MODEL_SCAN_LABELS.length]}
                        </text>
                      </motion.g>
                    </AnimatePresence>
                  )}


                  {/* Sweep line — fires after model scan, dots snap to curve */}
                  {sweepStarted && (
                    <motion.line
                      x1={PAD}
                      y1={PAD - 4}
                      x2={PAD}
                      y2={CHART_H - PAD + 4}
                      stroke={GREEN}
                      strokeWidth={2}
                      strokeLinecap="round"
                      initial={{ x1: PAD, x2: PAD, opacity: 0.9 }}
                      animate={{
                        x1: CHART_W - PAD,
                        x2: CHART_W - PAD,
                        opacity: [0.9, 0.9, 0],
                      }}
                      transition={{
                        x1: { duration: SWEEP_DURATION, ease: "linear" },
                        x2: { duration: SWEEP_DURATION, ease: "linear" },
                        opacity: { duration: SWEEP_DURATION + 0.2, times: [0, 0.85, 1] },
                      }}
                    />
                  )}
                  {sweepStarted && (
                    <motion.line
                      x1={PAD}
                      y1={PAD - 4}
                      x2={PAD}
                      y2={CHART_H - PAD + 4}
                      stroke={GREEN}
                      strokeWidth={8}
                      strokeLinecap="round"
                      initial={{ x1: PAD, x2: PAD, opacity: 0.15 }}
                      animate={{
                        x1: CHART_W - PAD,
                        x2: CHART_W - PAD,
                        opacity: [0.15, 0.15, 0],
                      }}
                      transition={{
                        x1: { duration: SWEEP_DURATION, ease: "linear" },
                        x2: { duration: SWEEP_DURATION, ease: "linear" },
                        opacity: { duration: SWEEP_DURATION + 0.2, times: [0, 0.85, 1] },
                      }}
                    />
                  )}

                  {/* Sweep label — fixed at top center of chart */}
                  {sweepStarted && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 1, 0] }}
                      transition={{ duration: SWEEP_DURATION + 0.4, times: [0, 0.08, 0.75, 1] }}
                    >
                      <rect
                        x={CHART_W / 2 - 130}
                        y={PAD - 4}
                        width={260}
                        height={28}
                        rx={5}
                        fill={GREEN}
                        opacity={0.92}
                      />
                      <text
                        x={CHART_W / 2}
                        y={PAD + 15}
                        fontSize="14"
                        fontWeight="700"
                        fill="white"
                        textAnchor="middle"
                      >
                        Adjusting to model-optimized prices
                      </text>
                    </motion.g>
                  )}

                  {/* Highlight rings on reviewed dots */}
                  {step === 1 &&
                    HIGHLIGHT_GROUPS[highlightIdx]?.map((di) => {
                      const dot = DOTS[di];
                      return (
                        <motion.circle
                          key={`ring-${di}`}
                          cx={dot.sqX}
                          cy={dot.sqY}
                          r={8}
                          fill="none"
                          stroke={ORANGE}
                          strokeWidth={1.2}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: [0, 0.7, 0.4], scale: [0.5, 1.2, 1.1] }}
                          transition={{ duration: 2.8, ease: "easeOut" }}
                        />
                      );
                    })}

                </svg>

              </motion.div>

              {/* Announcement overlay — clean card style */}
              <AnimatePresence>
                {announcing && (
                  <motion.div
                    key="announce-overlay"
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-white/95"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.4 } }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.span
                      className="mb-3 text-xs font-bold uppercase tracking-[0.3em]"
                      style={{ color: MUTED_NAVY }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      Now with Insights
                    </motion.span>

                    <div className="flex items-center gap-3">
                      {["Dynamic", "Pricing", "Model"].map((word, i) => (
                        <motion.span
                          key={word}
                          className="text-3xl font-extrabold tracking-tight sm:text-4xl"
                          style={{ color: i === 0 ? GREEN : NAVY }}
                          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{ delay: 0.4 + i * 0.18, duration: 0.5, ease: "easeOut" }}
                        >
                          {word}
                        </motion.span>
                      ))}
                    </div>

                    <motion.div
                      className="mt-4 h-[2px] rounded-full"
                      style={{ backgroundColor: GREEN }}
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 180, opacity: 1 }}
                      transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
                    />

                    <motion.p
                      className="mt-3 text-sm font-medium"
                      style={{ color: MUTED_NAVY }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3, duration: 0.5 }}
                    >
                      Optimizing every price point simultaneously
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Side panel — sits next to the chart */}
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="ctx-sq"
                    className="relative flex w-64 shrink-0 flex-col justify-center"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    {/* Left-pointing connector */}
                    <div
                      className="absolute -left-2 top-1/3"
                      style={{
                        width: 0, height: 0,
                        borderTop: "8px solid transparent",
                        borderBottom: "8px solid transparent",
                        borderRight: `8px solid ${ORANGE}25`,
                      }}
                    />
                    <div className="rounded-xl border p-4" style={{ borderColor: `${ORANGE}30`, backgroundColor: `${ORANGE}12` }}>
                      <p className="text-base font-bold leading-snug" style={{ color: NAVY }}>
                        Status Quo
                      </p>
                      <p className="mt-1 text-xs leading-relaxed" style={{ color: NAVY, opacity: 0.65 }}>
                        Each manual review introduces errors and inconsistency.
                      </p>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={highlightIdx}
                          className="mt-2.5 rounded-lg px-3 py-2"
                          style={{ backgroundColor: `${ORANGE}10`, border: `1px solid ${ORANGE}25` }}
                          initial={{ opacity: 0, x: 6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.25 }}
                        >
                          <p className="text-xs font-semibold" style={{ color: ORANGE }}>
                            {REVIEW_LABELS[highlightIdx % REVIEW_LABELS.length]}
                          </p>
                          <p className="mt-0.5 text-sm font-bold" style={{ color: ORANGE }}>
                            −${LEAKAGE_PER_CYCLE[highlightIdx % LEAKAGE_PER_CYCLE.length].toLocaleString()} margin lost
                          </p>
                        </motion.div>
                      </AnimatePresence>

                      <div className="mt-2.5 border-t pt-2.5" style={{ borderColor: `${ORANGE}15` }}>
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: NAVY, opacity: 0.5 }}>
                          Total left on the table
                        </span>
                        <motion.p
                          className="text-xl font-bold tabular-nums"
                          style={{ color: ORANGE }}
                          key={leakage}
                          initial={{ scale: 1.08 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          ${leakage.toLocaleString()}
                        </motion.p>
                        <span className="text-[10px]" style={{ color: MUTED_NAVY }}>
                          …and counting
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ) : announcing ? (
                  <motion.div
                    key="ctx-announce"
                    className="flex w-64 shrink-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0 }}
                  />
                ) : scanning ? (
                  <motion.div
                    key="ctx-scan"
                    className="relative flex w-64 shrink-0 flex-col justify-center"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div
                      className="absolute -left-2 top-1/3"
                      style={{
                        width: 0, height: 0,
                        borderTop: "8px solid transparent",
                        borderBottom: "8px solid transparent",
                        borderRight: `8px solid ${GREEN}25`,
                      }}
                    />
                    <div className="rounded-xl border p-4" style={{ borderColor: `${GREEN}20`, backgroundColor: `${GREEN}04` }}>
                      <p className="text-base font-bold leading-snug" style={{ color: GREEN }}>
                        Dynamic Model
                      </p>
                      <p className="mt-1 text-xs leading-relaxed" style={{ color: NAVY, opacity: 0.65 }}>
                        Analyzing every price point simultaneously — evaluating elasticity, margins, and competitive position.
                      </p>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={modelScanIdx}
                          className="mt-2.5 rounded-lg px-3 py-2"
                          style={{ backgroundColor: `${GREEN}10`, border: `1px solid ${GREEN}25` }}
                          initial={{ opacity: 0, x: 6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-xs font-semibold" style={{ color: GREEN }}>
                            {MODEL_SCAN_LABELS[modelScanIdx % MODEL_SCAN_LABELS.length]}
                          </p>
                          <p className="mt-0.5 text-[11px]" style={{ color: NAVY, opacity: 0.6 }}>
                            Cluster {modelScanIdx + 1} of {MODEL_SCAN_GROUPS.length}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="ctx-opt"
                    className="flex w-64 shrink-0 flex-col justify-center"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ delay: SWEEP_DURATION + 0.2, duration: 0.4 }}
                  >
                    <div className="rounded-xl border p-4" style={{ borderColor: `${GREEN}20`, backgroundColor: `${GREEN}04` }}>
                      <p className="text-base font-bold leading-snug" style={{ color: GREEN }}>
                        Model-Optimized
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed" style={{ color: NAVY, opacity: 0.65 }}>
                        The model generates precise, scenario-specific guidance automatically across every combination.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
