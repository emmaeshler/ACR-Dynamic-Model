"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { makeCurve } from "./demand-curve";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const MUTED = "#5A6A78";

const SLOT = { x: 30, y: 15, w: 350, h: 140 };
const DOT_COUNT = 20;

function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

interface DotState {
  scatterX: number;
  scatterY: number;
  curveX: number;
  curveY: number;
}

function buildDots(): DotState[] {
  const rng = seededRng(77);
  const curve = makeCurve(SLOT);
  const dots: DotState[] = [];

  for (let i = 0; i < DOT_COUNT; i++) {
    const t = 0.05 + rng() * 0.9;
    const onCurve = curve.sampleAt(t);
    dots.push({
      scatterX: SLOT.x + rng() * SLOT.w,
      scatterY: SLOT.y + rng() * SLOT.h,
      curveX: onCurve.x + (rng() - 0.5) * 8,
      curveY: onCurve.y + (rng() - 0.5) * 6,
    });
  }
  return dots;
}

export function AutoTuneVisual() {
  const [converged, setConverged] = useState(false);
  const dots = useMemo(buildDots, []);
  const curve = useMemo(() => makeCurve(SLOT), []);

  useEffect(() => {
    const t1 = setTimeout(() => setConverged(true), 1000);
    const t2 = setTimeout(() => setConverged(false), 5500);
    const t3 = setTimeout(() => setConverged(true), 6500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="space-y-2">
      <svg
        viewBox="0 0 420 175"
        className="w-full"
        role="img"
        aria-label="Scattered dots converge onto the optimal demand curve as ML tunes every knob"
      >
        <line
          x1={SLOT.x}
          y1={SLOT.y + SLOT.h}
          x2={SLOT.x + SLOT.w}
          y2={SLOT.y + SLOT.h}
          stroke="#e0e0e0"
          strokeWidth={1}
        />
        <line
          x1={SLOT.x}
          y1={SLOT.y}
          x2={SLOT.x}
          y2={SLOT.y + SLOT.h}
          stroke="#e0e0e0"
          strokeWidth={1}
        />

        {/* Curve */}
        <motion.path
          d={curve.d}
          fill="none"
          stroke={NAVY}
          strokeWidth={2}
          strokeLinecap="round"
          animate={{ opacity: converged ? 1 : 0.3 }}
          transition={{ duration: 0.5 }}
        />

        {/* Dots */}
        {dots.map((d, i) => (
          <motion.circle
            key={i}
            r={4}
            fill={ORANGE}
            animate={{
              cx: converged ? d.curveX : d.scatterX,
              cy: converged ? d.curveY : d.scatterY,
              opacity: converged ? 0.85 : 0.5,
            }}
            transition={{
              duration: 0.8,
              delay: converged ? i * 0.04 : 0,
              ease: "easeOut",
            }}
          />
        ))}

        <text
          x={SLOT.x + SLOT.w / 2}
          y={SLOT.y + SLOT.h + 15}
          fontSize="8"
          fill="rgba(0,0,0,0.3)"
          textAnchor="middle"
        >
          Quantity →
        </text>
        <text
          x={SLOT.x - 8}
          y={SLOT.y + SLOT.h / 2}
          fontSize="8"
          fill="rgba(0,0,0,0.3)"
          textAnchor="middle"
          transform={`rotate(-90,${SLOT.x - 8},${SLOT.y + SLOT.h / 2})`}
        >
          Price →
        </text>
      </svg>

      <p className="text-center text-xs text-muted-foreground">
        {converged
          ? "Knobs settle. Prices land on the optimal curve."
          : "ML tunes every knob, for every deal..."}
      </p>
    </div>
  );
}
