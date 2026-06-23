"use client";

import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const TEAL = "#21A5D5";
const GREEN = "#2e7d32";
const GRAY_BG = "#F5F8FA";
const GRAY_BORDER = "#CBD5DE";
const MUTED = "#5A6A78";
const FEEDBACK = "#8A9AAA";

export const OVERVIEW_TOTAL_STEPS = 5;

const STEP_NARRATIVES = [
  "Four inputs converge into one model — continuously learning from outcomes.",
  "Every pricing decision starts with data flowing into the model.",
  "The model produces actionable pricing guidance for every deal.",
  "Outcomes feed back — the model learns and refines over time.",
  "The result: an evidence-based system that improves with every decision.",
];

interface InputNode {
  label: string;
  subtitle: string;
  color: string;
  y: number;
}

const INPUTS: InputNode[] = [
  { label: "Internal Data", subtitle: "Transaction history", color: NAVY, y: 28 },
  { label: "External Data", subtitle: "Market signals", color: ORANGE, y: 98 },
  { label: "Industry Expertise", subtitle: "I2P benchmarks & drivers", color: GREEN, y: 168 },
  { label: "In-House Knowledge", subtitle: "Your rules & strategy", color: TEAL, y: 238 },
];

const INPUT_X = 15;
const INPUT_W = 175;
const INPUT_H = 54;

const MODEL_CX = 330;
const MODEL_CY = 155;
const MODEL_R = 70;

interface OutputNode {
  label: string;
  subtitle: string;
  y: number;
}

const OUTPUTS: OutputNode[] = [
  { label: "Price Reco", subtitle: "Per scenario", y: 68 },
  { label: "Win Rate", subtitle: "Predicted", y: 138 },
  { label: "Rationale", subtitle: "Decision drivers", y: 208 },
];

const OUTPUT_X = 490;
const OUTPUT_W = 150;
const OUTPUT_H = 50;

const INPUT_ARROWS = INPUTS.map((inp) => ({
  x1: INPUT_X + INPUT_W + 2,
  y1: inp.y + INPUT_H / 2,
  x2: MODEL_CX - MODEL_R - 4,
  y2: MODEL_CY,
}));

const OUTPUT_ARROWS = OUTPUTS.map((out) => ({
  x1: MODEL_CX + MODEL_R + 4,
  y1: MODEL_CY,
  x2: OUTPUT_X - 2,
  y2: out.y + OUTPUT_H / 2,
}));

function FlowDot({ x1, y1, x2, y2, delay, color }: {
  x1: number; y1: number; x2: number; y2: number; delay: number; color: string;
}) {
  return (
    <motion.circle
      r={2.5}
      fill={color}
      initial={{ cx: x1, cy: y1, opacity: 0 }}
      animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [0, 0.6, 0.6, 0] }}
      transition={{ duration: 2.5, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

interface DynamicOverviewSlideProps {
  step: number;
}

export function DynamicOverviewSlide({ step }: DynamicOverviewSlideProps) {
  const showInputs = step >= 1;
  const showOutputs = step >= 2;
  const showFeedback = step >= 3;
  const showComplete = step >= 4;

  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-5xl flex-col items-center justify-center gap-3 px-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Inside Your Dynamic Model
        </h2>
      </div>

      <div className="flex h-10 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            className="max-w-xl text-center text-sm font-medium"
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

      <svg viewBox="0 0 660 310" className="w-full max-w-3xl">
        <defs>
          <marker id="arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill={GRAY_BORDER} />
          </marker>
          <marker id="arr-fb" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill={FEEDBACK} />
          </marker>
        </defs>

        {/* Input → Model arrows */}
        {INPUT_ARROWS.map((a, i) => (
          <Fragment key={`in-${i}`}>
            <motion.line
              x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
              stroke={INPUTS[i].color}
              strokeWidth={1.5}
              markerEnd="url(#arr)"
              animate={{ opacity: showInputs ? 0.7 : 0.1 }}
              transition={{ duration: 0.4 }}
            />
            {showInputs && (
              <>
                <FlowDot x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} color={INPUTS[i].color} delay={0.3 + i * 0.4} />
                <FlowDot x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} color={INPUTS[i].color} delay={0.3 + i * 0.4 + 1.25} />
              </>
            )}
          </Fragment>
        ))}

        {/* Model → Output arrows */}
        {OUTPUT_ARROWS.map((a, i) => (
          <Fragment key={`out-${i}`}>
            <motion.line
              x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
              stroke={GRAY_BORDER}
              strokeWidth={1.5}
              markerEnd="url(#arr)"
              animate={{ opacity: showOutputs ? 0.7 : 0.08 }}
              transition={{ duration: 0.4 }}
            />
            {showOutputs && (
              <>
                <FlowDot x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} color={NAVY} delay={0.5 + i * 0.3} />
                <FlowDot x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} color={NAVY} delay={0.5 + i * 0.3 + 1.25} />
              </>
            )}
          </Fragment>
        ))}

        {/* Feedback arcs */}
        <motion.path
          d="M490 90 C460 30, 260 10, 192 50"
          fill="none"
          stroke={FEEDBACK}
          strokeWidth={1.5}
          strokeDasharray="6 4"
          markerEnd="url(#arr-fb)"
          animate={{ opacity: showFeedback ? 0.5 : 0.05 }}
          transition={{ duration: 0.6 }}
        />
        <motion.path
          d="M490 230 C460 280, 260 300, 192 260"
          fill="none"
          stroke={FEEDBACK}
          strokeWidth={1.5}
          strokeDasharray="6 4"
          markerEnd="url(#arr-fb)"
          animate={{ opacity: showFeedback ? 0.5 : 0.05 }}
          transition={{ duration: 0.6 }}
        />
        <motion.text
          x={330}
          y={298}
          fontSize="10"
          fill={FEEDBACK}
          textAnchor="middle"
          fontStyle="italic"
          animate={{ opacity: showFeedback ? 0.6 : 0 }}
          transition={{ duration: 0.5 }}
        >
          Outcomes feed back into the model
        </motion.text>

        {/* Input cards */}
        {INPUTS.map((inp, i) => {
          const active = step === 1;
          const visible = showInputs;
          return (
            <motion.g
              key={inp.label}
              animate={{ opacity: visible ? 1 : 0.22 }}
              transition={{ duration: 0.5 }}
            >
              {active && (
                <motion.rect
                  x={INPUT_X - 3} y={inp.y - 3}
                  width={INPUT_W + 6} height={INPUT_H + 6}
                  rx={11} fill="none" stroke={inp.color} strokeWidth={2}
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <rect
                x={INPUT_X} y={inp.y}
                width={INPUT_W} height={INPUT_H}
                rx={8}
                fill={visible ? "white" : GRAY_BG}
                stroke={visible ? inp.color : GRAY_BORDER}
                strokeWidth={visible ? 1.5 : 1}
              />
              <rect x={INPUT_X + 1} y={inp.y + 4} width={4} height={INPUT_H - 8} rx={2} fill={inp.color} />
              <text x={INPUT_X + INPUT_W / 2 + 2} y={inp.y + 22} fontSize="12" fontWeight="600" fill="#1a1a1a" textAnchor="middle">
                {inp.label}
              </text>
              <text x={INPUT_X + INPUT_W / 2 + 2} y={inp.y + 38} fontSize="10" fill={MUTED} textAnchor="middle">
                {inp.subtitle}
              </text>
            </motion.g>
          );
        })}

        {/* Center model */}
        <motion.g
          animate={{ opacity: step >= 0 ? 1 : 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <circle cx={MODEL_CX} cy={MODEL_CY} r={MODEL_R} fill={NAVY} />
          <text x={MODEL_CX} y={MODEL_CY - 8} fontSize="16" fontWeight="700" fill="white" textAnchor="middle">
            Pricing Model
          </text>
          <text x={MODEL_CX} y={MODEL_CY + 10} fontSize="10.5" fill="rgba(255,255,255,0.85)" textAnchor="middle">
            ML-powered
          </text>
          <text x={MODEL_CX} y={MODEL_CY + 24} fontSize="9.5" fill="rgba(255,255,255,0.6)" textAnchor="middle" fontStyle="italic">
            Continuously learning
          </text>
          {/* Subtle processing bars */}
          <motion.rect
            x={MODEL_CX - 30} y={MODEL_CY + 34} height={2.5} rx={1.5} fill="rgba(255,255,255,0.18)"
            animate={{ width: [40, 55, 30, 50, 40] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.rect
            x={MODEL_CX - 30} y={MODEL_CY + 40} height={2.5} rx={1.5} fill="rgba(255,255,255,0.12)"
            animate={{ width: [55, 30, 45, 35, 55] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>

        {/* Output cards */}
        {OUTPUTS.map((out, i) => {
          const active = step === 2;
          return (
            <motion.g
              key={out.label}
              animate={{ opacity: showOutputs ? 1 : 0.12 }}
              transition={{ duration: 0.5 }}
            >
              {active && (
                <motion.rect
                  x={OUTPUT_X - 3} y={out.y - 3}
                  width={OUTPUT_W + 6} height={OUTPUT_H + 6}
                  rx={11} fill="none" stroke={NAVY} strokeWidth={2}
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <rect
                x={OUTPUT_X} y={out.y}
                width={OUTPUT_W} height={OUTPUT_H}
                rx={8}
                fill={showOutputs ? "white" : GRAY_BG}
                stroke={showOutputs ? NAVY : GRAY_BORDER}
                strokeWidth={showOutputs ? 1.5 : 1}
              />
              <text x={OUTPUT_X + OUTPUT_W / 2} y={out.y + 22} fontSize="12" fontWeight="600" fill={NAVY} textAnchor="middle">
                {out.label}
              </text>
              <text x={OUTPUT_X + OUTPUT_W / 2} y={out.y + 38} fontSize="10" fill={MUTED} textAnchor="middle">
                {out.subtitle}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
