"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { makeCurve } from "./demand-curve";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const TEAL = "#21A5D5";
const MUTED = "#5A6A78";

const SLOT = { x: 40, y: 20, w: 340, h: 160 };
const BASE_Y = SLOT.y + SLOT.h;

const MONTHS = [
  { label: "Jan", steepness: 6, dotT: 0.45 },
  { label: "Feb", steepness: 5.2, dotT: 0.42 },
  { label: "Mar", steepness: 4.5, dotT: 0.38 },
  { label: "Apr", steepness: 5.8, dotT: 0.48 },
  { label: "May", steepness: 7, dotT: 0.50 },
];

export function MarketShiftCurveVisual() {
  const [monthIdx, setMonthIdx] = useState(0);

  const advance = useCallback(() => {
    setMonthIdx((i) => (i + 1) % MONTHS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(advance, 2000);
    return () => clearInterval(timer);
  }, [advance]);

  const month = MONTHS[monthIdx];
  const curve = useMemo(
    () => makeCurve(SLOT, month.steepness),
    [month.steepness],
  );
  const dot = curve.sampleAt(month.dotT);

  return (
    <div className="space-y-2">
      <svg
        viewBox="0 0 420 210"
        className="w-full"
        role="img"
        aria-label="Demand curve morphing month to month as market conditions shift, with price dot tracking"
      >
        <line x1={SLOT.x} y1={BASE_Y} x2={SLOT.x + SLOT.w} y2={BASE_Y} stroke="#e0e0e0" strokeWidth={1} />
        <line x1={SLOT.x} y1={SLOT.y} x2={SLOT.x} y2={BASE_Y} stroke="#e0e0e0" strokeWidth={1} />

        {/* Ghost of previous month's curve */}
        {monthIdx > 0 && (
          <path
            d={makeCurve(SLOT, MONTHS[monthIdx - 1].steepness).d}
            fill="none"
            stroke={NAVY}
            strokeWidth={1}
            strokeOpacity={0.15}
            strokeDasharray="4 4"
          />
        )}

        {/* Current curve */}
        <motion.path
          d={curve.d}
          fill="none"
          stroke={NAVY}
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={false}
          animate={{ d: curve.d }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Price dot */}
        <motion.circle
          cx={dot.x}
          cy={dot.y}
          r={6}
          fill={ORANGE}
          animate={{ cx: dot.x, cy: dot.y }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Vertical dashed line from dot to axis */}
        <motion.line
          x1={dot.x}
          y1={dot.y + 8}
          x2={dot.x}
          y2={BASE_Y}
          stroke={ORANGE}
          strokeWidth={0.8}
          strokeDasharray="3 2"
          strokeOpacity={0.4}
          animate={{ x1: dot.x, x2: dot.x }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Month ticker */}
        <AnimatePresence mode="wait">
          <motion.text
            key={monthIdx}
            x={SLOT.x + SLOT.w - 10}
            y={SLOT.y + 12}
            fontSize="12"
            fontWeight="700"
            fill={NAVY}
            textAnchor="end"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.3 }}
          >
            {month.label}
          </motion.text>
        </AnimatePresence>

        {/* Month dots at bottom */}
        {MONTHS.map((m, i) => (
          <circle
            key={m.label}
            cx={SLOT.x + 40 + i * 65}
            cy={BASE_Y + 18}
            r={3}
            fill={i === monthIdx ? ORANGE : "#ddd"}
          />
        ))}

        <text
          x={SLOT.x + SLOT.w / 2}
          y={BASE_Y + 30}
          fontSize="8"
          fill="rgba(0,0,0,0.3)"
          textAnchor="middle"
        >
          Demand shifts. Prices retune automatically.
        </text>
      </svg>
    </div>
  );
}
