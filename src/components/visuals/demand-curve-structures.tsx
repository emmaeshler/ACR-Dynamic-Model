"use client";

import { motion } from "framer-motion";
import {
  makeCurve,
  makeStaircaseFill,
  makeFullCurveFill,
} from "./demand-curve";

const NAVY = "#00446a";
const ORANGE = "#D97C14";
const MUTED = "#7a7570";

const SLOT = { x: 20, y: 10, w: 155, h: 95 };
const BASE_Y = SLOT.y + SLOT.h;
const STEP_TS = [0.08, 0.22, 0.36, 0.52, 0.68, 0.85];

function Panel({
  label,
  priceCount,
  color,
  fillD,
  delay,
}: {
  label: string;
  priceCount: string;
  color: string;
  fillD: string;
  delay: number;
}) {
  const curve = makeCurve(SLOT);

  return (
    <motion.div
      className="flex-1"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="rounded-lg border bg-white/60 p-3">
        <svg viewBox="0 0 195 120" className="w-full">
          <line x1={SLOT.x} y1={BASE_Y} x2={SLOT.x + SLOT.w} y2={BASE_Y} stroke="#ddd" strokeWidth={0.8} />
          <line x1={SLOT.x} y1={SLOT.y} x2={SLOT.x} y2={BASE_Y} stroke="#ddd" strokeWidth={0.8} />

          <path d={fillD} fill={color} fillOpacity={0.2} stroke={color} strokeOpacity={0.4} strokeWidth={0.5} />
          <path d={curve.d} fill="none" stroke={NAVY} strokeWidth={1.5} strokeLinecap="round" />

          <text x={SLOT.x + SLOT.w / 2} y={BASE_Y + 12} fontSize="7" fill={MUTED} textAnchor="middle">Quantity →</text>
        </svg>
      </div>
      <div className="mt-2 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{priceCount}</span> prices
        </p>
      </div>
    </motion.div>
  );
}

export function DemandCurveStructuresVisual() {
  const staircaseFill = makeStaircaseFill(SLOT, STEP_TS);
  const fullFill = makeFullCurveFill(SLOT);

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <Panel
          label="Policy Pricing"
          priceCount="5–10"
          color={MUTED}
          fillD={staircaseFill}
          delay={0}
        />
        <Panel
          label="Dynamic Model"
          priceCount="50+"
          color={ORANGE}
          fillD={fullFill}
          delay={0.15}
        />
      </div>
      <p className="text-center text-[10px] text-muted-foreground">
        Each additional price point fills a gap under the demand curve that rigid policy leaves on the table
      </p>
    </div>
  );
}
