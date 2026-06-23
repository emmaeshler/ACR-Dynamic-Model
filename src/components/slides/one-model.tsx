"use client";

import { Fragment, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const TEAL = "#21A5D5";
const GREEN = "#2e7d32";
const FEEDBACK = "#8A9AAA";
const PURPLE = "#7B5EA7";

// Steps: 0=all-inputs, 1=outputs
export const ONE_MODEL_TOTAL_STEPS = 2;

interface NarrativeSegment {
  text: string;
  bold?: boolean;
  color?: string;
  underline?: boolean;
}

const STEP_NARRATIVES: Record<number, NarrativeSegment[]> = {
  0: [{ text: "We intentionally integrate " }, { text: "four core components", bold: true, underline: true, color: NAVY }, { text: "." }],
  1: [{ text: "The model produces " }, { text: "evidence-based pricing guidance", bold: true, underline: true, color: PURPLE }, { text: "." }],
  2: [{ text: "Outcomes " }, { text: "feed back", bold: true, underline: true, color: FEEDBACK }, { text: " — the model " }, { text: "learns and refines", bold: true, color: NAVY }, { text: ", tightening precision with every cycle." }],
};

const DIMMED_STEPS = new Set<number>();
const PROMINENT_TEXT_STEPS = new Set([0, 1, 2]);

/* ── Narrative with animated highlight ───────────────────── */

function HighlightNarrative({ segments, isActive }: { segments: NarrativeSegment[]; isActive: boolean }) {
  return (
    <span>
      {segments.map((seg, si) => {
        if (!seg.bold) {
          return <span key={si}>{seg.text}</span>;
        }
        return (
          <span key={si} className="relative inline">
            <span style={{ fontWeight: 700, color: seg.color || NAVY }}>
              {seg.text}
            </span>
            {seg.underline && isActive && (
              <motion.span
                className="absolute bottom-0 left-0 h-[2px] rounded-full"
                style={{ backgroundColor: seg.color || NAVY }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              />
            )}
          </span>
        );
      })}
    </span>
  );
}

/* ── Layout constants ──────────────────────────────────── */

const SVG_W = 1000;
const SVG_H = 430;

const MODEL_X = 420;
const MODEL_Y = 110;
const MODEL_W = 200;
const MODEL_H = 160;
const MODEL_CX = MODEL_X + MODEL_W / 2;
const MODEL_CY = MODEL_Y + MODEL_H / 2;
const CONVERGE_X = MODEL_X - 6;
const DIVERGE_X = MODEL_X + MODEL_W + 6;

/* ── Input cards ─────────────────────────────────────── */

const INPUT_CARD_W = 280;
const INPUT_CARD_H = 68;
const INPUT_CARD_X = 10;

interface StreamConfig {
  label: string;
  subtitle: string;
  color: string;
  startY: number;
}

const INPUTS: StreamConfig[] = [
  { label: "Internal Historical Data", subtitle: "Transaction, customer, and offering history for an empirical foundation", color: NAVY, startY: 22 },
  { label: "External Environmental Data", subtitle: "Market sentiment, macro signals, and externally observed evidence", color: TEAL, startY: 112 },
  { label: "Industry Expertise", subtitle: "Benchmarks, key drivers, and paradigms that guide strategic architecture", color: ORANGE, startY: 202 },
  { label: "In-House Knowledge", subtitle: "Grounded in business realities and objectives to shape purposeful outcomes", color: GREEN, startY: 292 },
];

/* ── Output cards ────────────────────────────────────── */

const OUTPUT_CARD_W = 200;
const OUTPUT_CARD_H = 52;
const OUTPUT_CARD_X = 760;

interface OutputConfig {
  label: string;
  subtitle: string;
  color: string;
  endY: number;
}

const OUTPUTS: OutputConfig[] = [
  { label: "Optimal Price", subtitle: "Scenario-specific guidance", color: PURPLE, endY: 30 },
  { label: "Win Probability", subtitle: "Likelihood at recommended price", color: PURPLE, endY: 120 },
  { label: "Margin Impact", subtitle: "Projected uplift vs. current", color: PURPLE, endY: 210 },
  { label: "Confidence Score", subtitle: "Statistical certainty range", color: PURPLE, endY: 300 },
];

const OUTPUT_STAGGER_DELAY = 0.7;
const OUTPUT_BASE_DELAY = 0.3;

/* ── Bezier helpers ────────────────────────────────────── */

function inputCurvePath(startY: number): string {
  const sx = INPUT_CARD_X + INPUT_CARD_W + 2;
  const sy = startY + INPUT_CARD_H / 2;
  return `M ${sx} ${sy} C ${sx + 80} ${sy}, ${CONVERGE_X - 60} ${MODEL_CY}, ${CONVERGE_X} ${MODEL_CY}`;
}

function outputCurvePath(endY: number): string {
  const ex = OUTPUT_CARD_X - 2;
  const ey = endY + OUTPUT_CARD_H / 2;
  return `M ${DIVERGE_X} ${MODEL_CY} C ${DIVERGE_X + 60} ${MODEL_CY}, ${ex - 80} ${ey}, ${ex} ${ey}`;
}

function sampleCubicBezier(
  sx: number, sy: number,
  cp1x: number, cp1y: number,
  cp2x: number, cp2y: number,
  ex: number, ey: number,
  steps: number,
) {
  const cxArr: number[] = [];
  const cyArr: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    cxArr.push(u * u * u * sx + 3 * u * u * t * cp1x + 3 * u * t * t * cp2x + t * t * t * ex);
    cyArr.push(u * u * u * sy + 3 * u * u * t * cp1y + 3 * u * t * t * cp2y + t * t * t * ey);
  }
  return { cxArr, cyArr };
}

/* ── Animated dot component ────────────────────────────── */

function FlowDot({
  path,
  color,
  delay,
}: {
  path: { sx: number; sy: number; cp1x: number; cp1y: number; cp2x: number; cp2y: number; ex: number; ey: number };
  color: string;
  delay: number;
}) {
  const { cxArr, cyArr } = sampleCubicBezier(
    path.sx, path.sy, path.cp1x, path.cp1y, path.cp2x, path.cp2y, path.ex, path.ey, 50,
  );

  return (
    <motion.circle
      r={3}
      fill={color}
      initial={{ opacity: 0 }}
      animate={{
        cx: cxArr,
        cy: cyArr,
        opacity: [0, 0.5, 0.5, 0.5, 0],
      }}
      transition={{ duration: 4.5, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ── Price feedback cycle ─────────────────────────────── */

interface PriceState {
  price: string;
  subtitle: string;
}

const PRICE_CYCLE: PriceState[] = [
  { price: "$18.50 / unit", subtitle: "Initial recommendation across all segments" },
  { price: "$19.80 / unit", subtitle: "Adjusted after win-rate patterns" },
  { price: "$19.25 / unit", subtitle: "Refined with competitive signals" },
];

const PRICE_CYCLE_MS = 3500;

/* ── Timeline feedback layout ──────────────────────────── */

const TL_Y = 200;
const TL_LEFT = 80;
const TL_RIGHT = 920;
const TL_STEP_POSITIONS = [
  { x: 140, label: "Price Set", subtitle: "Model recommends", color: TEAL, num: "1" },
  { x: 390, label: "Market Tests", subtitle: "Deployed to deals", color: NAVY, num: "2" },
  { x: 640, label: "Outcomes Observed", subtitle: "Win/loss data collected", color: ORANGE, num: "3" },
  { x: 870, label: "Model Re-learns", subtitle: "Precision tightens", color: NAVY, num: "4" },
];

/* ── Input card (SVG) — title + subtitle ───────────────── */

const GREY = "#B8BFC6";

function InputCard({ inp, visible, enterDelay, opacity, greyed }: { inp: StreamConfig; visible: boolean; enterDelay?: number; opacity?: number; greyed?: boolean }) {
  const cx = INPUT_CARD_X + INPUT_CARD_W / 2;
  const targetOpacity = opacity !== undefined ? opacity : visible ? 1 : 0;
  const strokeColor = greyed ? GREY : inp.color;
  const textColor = greyed ? GREY : inp.color;
  return (
    <motion.g
      initial={enterDelay !== undefined ? { opacity: 0, x: -40 } : undefined}
      animate={{ opacity: targetOpacity, x: 0 }}
      transition={{ duration: 0.6, delay: visible && enterDelay !== undefined ? enterDelay : 0, ease: "easeOut" }}
    >
      <motion.rect
        x={INPUT_CARD_X}
        y={inp.startY}
        width={INPUT_CARD_W}
        height={INPUT_CARD_H}
        rx={10}
        fill="white"
        animate={{ stroke: strokeColor }}
        transition={{ duration: 0.4 }}
        strokeWidth={1.2}
      />
      <motion.text
        x={cx}
        y={inp.startY + 18}
        fontSize="13"
        fontWeight="700"
        animate={{ fill: textColor }}
        transition={{ duration: 0.4 }}
        textAnchor="middle"
      >
        {inp.label}
      </motion.text>
      <foreignObject
        x={INPUT_CARD_X + 10}
        y={inp.startY + 26}
        width={INPUT_CARD_W - 20}
        height={INPUT_CARD_H - 30}
      >
        <p
          style={{
            fontSize: 11,
            lineHeight: 1.35,
            color: greyed ? GREY : "#4A5568",
            margin: 0,
            textAlign: "center",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {inp.subtitle}
        </p>
      </foreignObject>
    </motion.g>
  );
}

/* ── Output card ──────────────────────────────────────── */

function OutputCard({ out, visible, enterDelay, opacity, greyed }: { out: OutputConfig; visible: boolean; enterDelay?: number; opacity?: number; greyed?: boolean }) {
  const cx = OUTPUT_CARD_X + OUTPUT_CARD_W / 2;
  const cy = out.endY + OUTPUT_CARD_H / 2;
  const targetOpacity = opacity !== undefined ? opacity : visible ? 1 : 0;
  const strokeColor = greyed ? GREY : out.color;
  const textColor = greyed ? GREY : out.color;
  return (
    <motion.g
      initial={enterDelay !== undefined ? { opacity: 0, x: 40 } : undefined}
      animate={{ opacity: targetOpacity, x: 0 }}
      transition={{ duration: 0.6, delay: visible && enterDelay !== undefined ? enterDelay : 0, ease: "easeOut" }}
    >
      <motion.rect
        x={OUTPUT_CARD_X}
        y={out.endY}
        width={OUTPUT_CARD_W}
        height={OUTPUT_CARD_H}
        rx={10}
        fill="white"
        animate={{ stroke: strokeColor }}
        transition={{ duration: 0.4 }}
        strokeWidth={1.2}
      />
      <motion.text
        x={cx}
        y={cy - 5}
        fontSize="14"
        fontWeight="700"
        animate={{ fill: textColor }}
        transition={{ duration: 0.4 }}
        textAnchor="middle"
      >
        {out.label}
      </motion.text>
      <foreignObject
        x={OUTPUT_CARD_X + 10}
        y={out.endY + 26}
        width={OUTPUT_CARD_W - 20}
        height={OUTPUT_CARD_H - 30}
      >
        <p
          style={{
            fontSize: 11,
            lineHeight: 1.35,
            color: greyed ? GREY : "#4A5568",
            margin: 0,
            textAlign: "center",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {out.subtitle}
        </p>
      </foreignObject>
    </motion.g>
  );
}

/* ── Main slide ────────────────────────────────────────── */

interface OneModelSlideProps {
  step: number;
  onAutoAdvance?: () => void;
}

export function OneModelSlide({ step, onAutoAdvance }: OneModelSlideProps) {
  const [priceCycle, setPriceCycle] = useState(0);

  const isDimmed = DIMMED_STEPS.has(step);
  const isProminentText = PROMINENT_TEXT_STEPS.has(step);
  const visibleInputCount = step >= 0 ? 4 : 0;
  const allInputsEntering = step === 0;
  const allInputsVisible = visibleInputCount >= 4;

  const showOutputs = step >= 1;
  const showFeedback = step === 2;
  const isOutputsEntering = step === 1;
  const isFeedbackEntering = step === 2;

  useEffect(() => {
    if (!showFeedback) { setPriceCycle(0); return; }
    const timer = setInterval(() => {
      setPriceCycle((c) => (c + 1) % PRICE_CYCLE.length);
    }, PRICE_CYCLE_MS);
    return () => clearInterval(timer);
  }, [showFeedback]);

  void onAutoAdvance;

  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-6xl flex-col items-center justify-center px-6 pt-8 relative">
      <motion.span
        className="mb-1 inline-block rounded-full px-3 py-0.5 text-[10px] font-bold tracking-[0.2em] uppercase"
        style={{ backgroundColor: `${NAVY}10`, color: NAVY }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Design
      </motion.span>
      <motion.h2
        className="text-center text-2xl font-bold tracking-tight sm:text-3xl"
        style={{ color: NAVY }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Core components of the ideal pricing model
      </motion.h2>

      {/* Narrative line */}
      <div className="flex min-h-[3rem] items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            className="max-w-2xl text-center leading-relaxed"
            style={{
              color: NAVY,
              fontSize: isProminentText ? "1.15rem" : "0.875rem",
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <HighlightNarrative segments={STEP_NARRATIVES[step]} isActive={isProminentText} />
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Diagram area */}
      <div className="relative w-full max-w-5xl flex-1 min-h-0 overflow-hidden">
        <motion.div
          className="w-full h-full"
          animate={{ opacity: isDimmed ? 0.15 : 1 }}
          transition={{ opacity: { duration: isDimmed ? 0.3 : 0.6 } }}
        >
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-full">
        {/* ── Section labels ── */}
        <motion.text
          x={INPUT_CARD_X}
          y={10}
          fontSize="11"
          fontWeight="600"
          letterSpacing="0.12em"
          fill={FEEDBACK}
          animate={{ opacity: visibleInputCount > 0 && !showFeedback ? 1 : 0 }}
          transition={{ duration: 0.4, delay: allInputsEntering ? 0.1 : 0 }}
        >
          FOUR CORE COMPONENTS
        </motion.text>

        <motion.text
          x={OUTPUT_CARD_X + OUTPUT_CARD_W}
          y={10}
          fontSize="11"
          fontWeight="600"
          letterSpacing="0.12em"
          fill={FEEDBACK}
          textAnchor="end"
          initial={isOutputsEntering ? { opacity: 0 } : undefined}
          animate={{ opacity: showOutputs && !showFeedback ? 1 : 0 }}
          transition={{ duration: 0.4, delay: isOutputsEntering ? OUTPUT_BASE_DELAY : 0 }}
        >
          MODEL OUTPUTS (ILLUSTRATIVE)
        </motion.text>

        {/* ── Input streams ── */}
        {INPUTS.map((inp, i) => {
          const isVisible = i < visibleInputCount;
          const isEntering = allInputsEntering;
          const d = inputCurvePath(inp.startY);
          const sx = INPUT_CARD_X + INPUT_CARD_W + 2;
          const sy = inp.startY + INPUT_CARD_H / 2;
          const pathParams = {
            sx, sy,
            cp1x: sx + 80, cp1y: sy,
            cp2x: CONVERGE_X - 60, cp2y: MODEL_CY,
            ex: CONVERGE_X, ey: MODEL_CY,
          };

          const cardOpacity = !isVisible ? 0 : showFeedback ? 0 : 1;
          const curveColor = showFeedback ? GREY : inp.color;
          const curveOpacity = !isVisible ? 0 : showFeedback ? 0 : 0.35;

          return (
            <Fragment key={inp.label}>
              <InputCard
                inp={inp}
                visible={isVisible}
                enterDelay={isEntering ? 0.1 + i * 0.12 : undefined}
                opacity={cardOpacity}
                greyed={showFeedback}
              />
              <motion.path
                d={d}
                fill="none"
                stroke={curveColor}
                strokeWidth={1.5}
                strokeLinecap="round"
                initial={isEntering ? { pathLength: 0, opacity: 0 } : undefined}
                animate={{ opacity: curveOpacity, pathLength: isVisible ? 1 : 0 }}
                transition={{ duration: 0.8, delay: isEntering ? 0.3 + i * 0.12 : 0, ease: "easeOut" }}
              />
              {isVisible && !showFeedback && (
                <FlowDot path={pathParams} color={inp.color} delay={isEntering ? 0.7 + i * 0.15 : 0.5 + i * 0.8} />
              )}
            </Fragment>
          );
        })}

        {/* ── Output streams ── */}
        {OUTPUTS.map((out, i) => {
          const d = outputCurvePath(out.endY);
          const ex = OUTPUT_CARD_X - 2;
          const ey = out.endY + OUTPUT_CARD_H / 2;
          const pathParams = {
            sx: DIVERGE_X, sy: MODEL_CY,
            cp1x: DIVERGE_X + 60, cp1y: MODEL_CY,
            cp2x: ex - 80, cp2y: ey,
            ex, ey,
          };
          const staggerDelay = OUTPUT_BASE_DELAY + i * OUTPUT_STAGGER_DELAY;

          const cardOpacity = !showOutputs ? 0 : showFeedback ? 0 : 1;
          const curveColor = showFeedback ? GREY : out.color;
          const curveOpacity = !showOutputs ? 0 : showFeedback ? 0 : 0.35;

          return (
            <Fragment key={out.label}>
              <OutputCard
                out={out}
                visible={showOutputs}
                enterDelay={isOutputsEntering ? staggerDelay : undefined}
                opacity={cardOpacity}
                greyed={showFeedback}
              />
              <motion.path
                d={d}
                fill="none"
                stroke={curveColor}
                strokeWidth={1.5}
                strokeLinecap="round"
                initial={isOutputsEntering ? { pathLength: 0, opacity: 0 } : undefined}
                animate={{ opacity: curveOpacity, pathLength: showOutputs ? 1 : 0 }}
                transition={{ duration: 0.8, delay: isOutputsEntering ? staggerDelay + 0.3 : 0, ease: "easeOut" }}
              />
              {showOutputs && !showFeedback && (
                <FlowDot path={pathParams} color={out.color} delay={isOutputsEntering ? staggerDelay + 0.8 : 0.6 + i * 0.8} />
              )}
            </Fragment>
          );
        })}

        {/* ── Feedback: left-to-right timeline ── */}
        {showFeedback && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

            {/* ── Main timeline line ── */}
            <motion.line
              x1={TL_LEFT} y1={TL_Y} x2={TL_RIGHT} y2={TL_Y}
              stroke="#CBD5E1" strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: isFeedbackEntering ? 0.1 : 0 }}
            />

            {/* ── Timeline steps ── */}
            {TL_STEP_POSITIONS.map((s, i) => (
              <motion.g
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: isFeedbackEntering ? 0.2 + i * 0.25 : 0 }}
              >
                {/* Node circle */}
                <circle cx={s.x} cy={TL_Y} r={16} fill={s.color} />
                <text x={s.x} y={TL_Y + 4.5} fontSize="11" fontWeight="700" fill="white" textAnchor="middle">{s.num}</text>
                {/* Label below */}
                <text x={s.x} y={TL_Y + 36} fontSize="13" fontWeight="700" fill={NAVY} textAnchor="middle">{s.label}</text>
                <text x={s.x} y={TL_Y + 52} fontSize="10" fill="#64748B" textAnchor="middle">{s.subtitle}</text>

                {/* Arrow connector to next step */}
                {i < TL_STEP_POSITIONS.length - 1 && (
                  <motion.polygon
                    points={`${s.x + 18},${TL_Y} ${s.x + 24},${TL_Y - 4} ${s.x + 24},${TL_Y + 4}`}
                    fill={s.color}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ duration: 0.3, delay: isFeedbackEntering ? 0.4 + i * 0.25 : 0 }}
                  />
                )}
              </motion.g>
            ))}

            {/* ── Dashed learning arc: from step 4 back to step 1 ── */}
            <motion.path
              d={`M ${TL_STEP_POSITIONS[3].x} ${TL_Y - 18} C ${TL_STEP_POSITIONS[3].x - 80} ${TL_Y - 120}, ${TL_STEP_POSITIONS[0].x + 80} ${TL_Y - 120}, ${TL_STEP_POSITIONS[0].x} ${TL_Y - 18}`}
              fill="none" stroke={TEAL} strokeWidth={2} strokeDasharray="10 6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 0.8, delay: isFeedbackEntering ? 1.2 : 0 }}
            />
            <motion.polygon
              points={`${TL_STEP_POSITIONS[0].x},${TL_Y - 18} ${TL_STEP_POSITIONS[0].x - 5},${TL_Y - 26} ${TL_STEP_POSITIONS[0].x + 5},${TL_Y - 26}`}
              fill={TEAL}
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
              transition={{ duration: 0.3, delay: isFeedbackEntering ? 1.8 : 0 }}
            />
            <motion.text
              x={(TL_STEP_POSITIONS[0].x + TL_STEP_POSITIONS[3].x) / 2}
              y={TL_Y - 108}
              fontSize="10" fontWeight="600" fill={TEAL} textAnchor="middle"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
              transition={{ duration: 0.4, delay: isFeedbackEntering ? 1.4 : 0 }}
            >
              Continuous learning loop
            </motion.text>

            {/* ── Cycling price card below timeline ── */}
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: isFeedbackEntering ? 0.6 : 0 }}
            >
              <rect x={330} y={TL_Y + 68} width={340} height={100} rx={16} fill={NAVY} />
              <text x={500} y={TL_Y + 88} fontSize="10" fontWeight="700" letterSpacing="0.14em" fill="rgba(255,255,255,0.45)" textAnchor="middle">RECOMMENDATION</text>
              <AnimatePresence mode="wait">
                <motion.g key={priceCycle} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.3 }}>
                  <text x={500} y={TL_Y + 126} fontSize="28" fontWeight="700" fill="white" textAnchor="middle">{PRICE_CYCLE[priceCycle].price}</text>
                  <text x={500} y={TL_Y + 146} fontSize="11" fill="rgba(255,255,255,0.5)" textAnchor="middle">{PRICE_CYCLE[priceCycle].subtitle}</text>
                </motion.g>
              </AnimatePresence>
              {PRICE_CYCLE.map((_, pi) => (
                <motion.circle key={pi} cx={500 + (pi - 1) * 12} cy={TL_Y + 160} r={3}
                  fill={pi === priceCycle ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)"} />
              ))}
            </motion.g>
          </motion.g>
        )}

        {/* ── Absorbing glow (all inputs visible, before feedback) ── */}
        <motion.rect
          x={MODEL_X - 4} y={MODEL_Y - 4} width={MODEL_W + 8} height={MODEL_H + 8} rx={20}
          fill="none" stroke={NAVY} strokeWidth={2}
          animate={{ opacity: allInputsVisible && !showFeedback ? [0.1, 0.3, 0.1] : 0 }}
          transition={allInputsVisible && !showFeedback ? { duration: 3.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
        />

        {/* ── Center model box ── */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: showFeedback ? 0 : 1 }}
          transition={{ duration: showFeedback ? 0.4 : 0.8, ease: "easeOut" }}
          style={{ transformOrigin: `${MODEL_CX}px ${MODEL_CY}px` }}
        >
          <rect x={MODEL_X} y={MODEL_Y} width={MODEL_W} height={MODEL_H} rx={16} fill={NAVY} />
          <g>
            <text x={MODEL_CX} y={MODEL_CY - 18} fontSize="19" fontWeight="700" fill="white" textAnchor="middle">
              Pricing Model
            </text>
            <text x={MODEL_CX} y={MODEL_CY + 4} fontSize="12" fill="rgba(255,255,255,0.65)" textAnchor="middle">
              ML-powered optimization
            </text>
            <motion.rect
              x={MODEL_CX - 35} y={MODEL_CY + 24} height={3} rx={1.5} fill="rgba(255,255,255,0.2)"
              animate={{ width: [50, 65, 35, 60, 50] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.rect
              x={MODEL_CX - 35} y={MODEL_CY + 33} height={3} rx={1.5} fill="rgba(255,255,255,0.12)"
              animate={{ width: [65, 35, 55, 30, 65] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>
        </motion.g>

      </svg>
        </motion.div>
      </div>
    </div>
  );
}
