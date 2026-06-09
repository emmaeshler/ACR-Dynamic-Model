"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  makeCurve,
  makeSinglePriceFill,
  makeStaircaseFill,
  makeFullCurveFill,
} from "./demand-curve";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const TEAL = "#21A5D5";
const MUTED = "#5A6A78";

const SLOT = { x: 40, y: 20, w: 360, h: 200 };
const BASE_Y = SLOT.y + SLOT.h;

const STEP_TS = [0.08, 0.2, 0.33, 0.46, 0.6, 0.75, 0.92];

const STAGES = [
  {
    label: "One Price",
    capture: "54%",
    color: MUTED,
    fillOpacity: 0.2,
    strokeOpacity: 0.6,
  },
  {
    label: "Manual Segmentation",
    capture: "78%",
    color: NAVY,
    fillOpacity: 0.22,
    strokeOpacity: 0.7,
  },
  {
    label: "ML Model",
    capture: "92%",
    color: ORANGE,
    fillOpacity: 0.25,
    strokeOpacity: 0.7,
  },
];

function getFillPath(stage: number) {
  if (stage === 0) return makeSinglePriceFill(SLOT, STEP_TS[0]);
  if (stage === 1) return makeStaircaseFill(SLOT, STEP_TS);
  return makeFullCurveFill(SLOT);
}

export function DemandCurveCaptureVisual() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStage((s) => (s + 1) % 3);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const curve = makeCurve(SLOT);
  const current = STAGES[stage];

  return (
    <div className="space-y-3">
      <svg
        viewBox="0 0 440 250"
        className="w-full"
        role="img"
        aria-label="Demand curve showing margin capture: one price 54%, manual segmentation 78%, ML model 92%"
      >
        {/* Axes */}
        <line
          x1={SLOT.x}
          y1={BASE_Y}
          x2={SLOT.x + SLOT.w}
          y2={BASE_Y}
          stroke="#ddd"
          strokeWidth={1}
        />
        <line
          x1={SLOT.x}
          y1={SLOT.y}
          x2={SLOT.x}
          y2={BASE_Y}
          stroke="#ddd"
          strokeWidth={1}
        />
        <text
          x={SLOT.x + SLOT.w / 2}
          y={BASE_Y + 18}
          fontSize="8"
          fill="rgba(0,0,0,0.3)"
          textAnchor="middle"
        >
          Quantity
        </text>
        <text
          x={SLOT.x - 10}
          y={SLOT.y + SLOT.h / 2}
          fontSize="8"
          fill="rgba(0,0,0,0.3)"
          textAnchor="middle"
          transform={`rotate(-90,${SLOT.x - 10},${SLOT.y + SLOT.h / 2})`}
        >
          Price
        </text>

        {/* Fill area */}
        <AnimatePresence mode="wait">
          <motion.path
            key={stage}
            d={getFillPath(stage)}
            fill={current.color}
            fillOpacity={current.fillOpacity}
            stroke={current.color}
            strokeOpacity={current.strokeOpacity}
            strokeWidth={1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        {/* Demand curve */}
        <path
          d={curve.d}
          fill="none"
          stroke={NAVY}
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Stage indicator dots */}
        {STAGES.map((s, i) => (
          <circle
            key={i}
            cx={SLOT.x + SLOT.w / 2 - 20 + i * 20}
            cy={SLOT.y + 8}
            r={3}
            fill={i === stage ? s.color : "#ddd"}
          />
        ))}
      </svg>

      {/* Caption bar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center gap-3"
        >
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: current.color }}
          />
          <span className="text-sm font-medium">{current.label}</span>
          <span
            className="text-lg font-bold"
            style={{ color: current.color }}
          >
            {current.capture}
          </span>
          <span className="text-xs text-muted-foreground">
            margin captured
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
