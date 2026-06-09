"use client";

import { motion } from "framer-motion";
import {
  makeCurve,
  makeSinglePriceFill,
  makeStaircaseFill,
  makeFullCurveFill,
} from "./demand-curve";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const MUTED = "#5A6A78";

const PANELS = [
  {
    title: "One Price",
    count: "1",
    unit: "price",
    capture: 54,
    color: MUTED,
    fillOpacity: 0.18,
  },
  {
    title: "Manual Segmentation",
    count: "7",
    unit: "prices",
    capture: 78,
    color: NAVY,
    fillOpacity: 0.24,
  },
  {
    title: "ML Model",
    count: "74",
    unit: "prices",
    capture: 92,
    color: ORANGE,
    fillOpacity: 0.28,
  },
];

const STEP_TS = [0.08, 0.2, 0.33, 0.46, 0.6, 0.75, 0.92];

function PanelChart({
  panel,
  index,
}: {
  panel: (typeof PANELS)[number];
  index: number;
}) {
  const slot = { x: 8, y: 8, w: 110, h: 70 };
  const baseY = slot.y + slot.h;
  const curve = makeCurve(slot);

  let fillD: string;
  if (index === 0) fillD = makeSinglePriceFill(slot, STEP_TS[0]);
  else if (index === 1) fillD = makeStaircaseFill(slot, STEP_TS);
  else fillD = makeFullCurveFill(slot);

  return (
    <motion.div
      className="flex flex-1 flex-col items-center gap-2"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.15 }}
    >
      <div className="w-full rounded-lg border bg-white/60 p-3">
        <svg viewBox="0 0 126 90" className="w-full">
          <line
            x1={slot.x}
            y1={baseY}
            x2={slot.x + slot.w}
            y2={baseY}
            stroke="#ddd"
            strokeWidth={0.8}
          />
          <line
            x1={slot.x}
            y1={slot.y}
            x2={slot.x}
            y2={baseY}
            stroke="#ddd"
            strokeWidth={0.8}
          />
          <path
            d={fillD}
            fill={panel.color}
            fillOpacity={panel.fillOpacity}
            stroke={panel.color}
            strokeOpacity={0.5}
            strokeWidth={0.5}
          />
          <path
            d={curve.d}
            fill="none"
            stroke={NAVY}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="text-center">
        <p
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: panel.color }}
        >
          {panel.title}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{panel.count}</span>{" "}
          {panel.unit}
        </p>
        <p className="mt-1 text-2xl font-bold" style={{ color: panel.color }}>
          {panel.capture}%
        </p>
        <p className="text-[10px] text-muted-foreground">margin captured</p>
      </div>
    </motion.div>
  );
}

export function CaptureComparisonVisual() {
  return (
    <div className="flex gap-4">
      {PANELS.map((panel, i) => (
        <PanelChart key={panel.title} panel={panel} index={i} />
      ))}
    </div>
  );
}
