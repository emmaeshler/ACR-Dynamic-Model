"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { makeParabolaPath } from "./demand-curve";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const GREEN = "#2e7d32";
const TEAL = "#21A5D5";
const MUTED = "#5A6A78";

const SLOT = { x: 30, y: 20, w: 360, h: 140 };

const PEAK_T = 0.55;
const PEAK_H = 0.85;

function parabolaYAt(t: number) {
  let y =
    SLOT.y +
    SLOT.h * (1 - (1 - Math.pow((t - PEAK_T) * 2.6, 2)) * PEAK_H * 0.85);
  return Math.max(SLOT.y + 10, Math.min(SLOT.y + SLOT.h - 10, y));
}

function parabolaXAt(t: number) {
  return SLOT.x + 20 + t * (SLOT.w - 40);
}

interface DotPair {
  t: number;
  predictedY: number;
  actualY: number;
  x: number;
}

function buildDots(): DotPair[] {
  const ts = [0.2, 0.3, 0.4, 0.5, 0.55, 0.6, 0.7, 0.8];
  let seed = 88;
  function rng() {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  }

  return ts.map((t) => {
    const predicted = parabolaYAt(t);
    const offset = (rng() - 0.5) * 20;
    return {
      t,
      predictedY: predicted,
      actualY: predicted + offset,
      x: parabolaXAt(t),
    };
  });
}

export function PredictedVsActualVisual() {
  const [showActual, setShowActual] = useState(false);
  const dots = useMemo(buildDots, []);
  const parabD = useMemo(
    () => makeParabolaPath(SLOT, PEAK_T, PEAK_H),
    [],
  );

  useEffect(() => {
    const t1 = setTimeout(() => setShowActual(true), 1200);
    const t2 = setTimeout(() => setShowActual(false), 5500);
    const t3 = setTimeout(() => setShowActual(true), 6500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="space-y-2">
      <svg
        viewBox="0 0 420 190"
        className="w-full"
        role="img"
        aria-label="Predicted margin dots on parabola, then actual results appear nearby — the model adjusts"
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

        {/* Parabola */}
        <path
          d={parabD}
          fill="none"
          stroke={ORANGE}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.5}
        />

        {/* Predicted dots */}
        {dots.map((d, i) => (
          <motion.circle
            key={`pred-${i}`}
            cx={d.x}
            cy={d.predictedY}
            r={5}
            fill={ORANGE}
            initial={{ opacity: 0, r: 0 }}
            animate={{ opacity: 0.8, r: 5 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          />
        ))}

        {/* Actual dots */}
        {dots.map((d, i) => (
          <motion.g key={`actual-${i}`}>
            <motion.circle
              cx={d.x}
              cy={d.actualY}
              r={4}
              fill={TEAL}
              animate={{ opacity: showActual ? 0.8 : 0, r: showActual ? 4 : 0 }}
              transition={{ duration: 0.3, delay: showActual ? i * 0.06 : 0 }}
            />
            {/* Connecting line between predicted and actual */}
            <motion.line
              x1={d.x}
              y1={d.predictedY}
              x2={d.x}
              y2={d.actualY}
              stroke={MUTED}
              strokeWidth={0.8}
              strokeDasharray="2 2"
              animate={{ opacity: showActual ? 0.4 : 0 }}
              transition={{ duration: 0.3, delay: showActual ? i * 0.06 : 0 }}
            />
          </motion.g>
        ))}

        {/* Legend */}
        <circle cx={SLOT.x + 20} cy={SLOT.y + SLOT.h + 16} r={3.5} fill={ORANGE} />
        <text
          x={SLOT.x + 28}
          y={SLOT.y + SLOT.h + 19}
          fontSize="8"
          fill={MUTED}
        >
          Predicted
        </text>
        <motion.g animate={{ opacity: showActual ? 1 : 0.3 }}>
          <circle
            cx={SLOT.x + 100}
            cy={SLOT.y + SLOT.h + 16}
            r={3.5}
            fill={TEAL}
          />
          <text
            x={SLOT.x + 108}
            y={SLOT.y + SLOT.h + 19}
            fontSize="8"
            fill={MUTED}
          >
            Actual
          </text>
        </motion.g>

        <text
          x={SLOT.x + SLOT.w / 2}
          y={SLOT.y + SLOT.h + 32}
          fontSize="8"
          fill="rgba(0,0,0,0.3)"
          textAnchor="middle"
        >
          Price →
        </text>
        <text
          x={SLOT.x - 8}
          y={SLOT.y + SLOT.h / 2}
          fontSize="8"
          fill="rgba(0,0,0,0.3)"
          textAnchor="middle"
          transform={`rotate(-90,${SLOT.x - 8},${SLOT.y + SLOT.h / 2})`}
        >
          Margin $ →
        </text>
      </svg>
    </div>
  );
}
