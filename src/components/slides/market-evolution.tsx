"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { makeCurve } from "../visuals/demand-curve";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const TEAL = "#21A5D5";
const GREEN = "#2e7d32";

const SLOT = { x: 50, y: 20, w: 400, h: 160 };
const BASE_Y = SLOT.y + SLOT.h;

interface CustomerPoint {
  label: string;
  price: string;
  t: number;
  color: string;
}

interface MarketState {
  label: string;
  steepness: number;
  customers: CustomerPoint[];
}

const STATES: MarketState[] = [
  {
    label: "Original Output",
    steepness: 5,
    customers: [
      { label: "Cust 1", price: "$18.79", t: 0.15, color: NAVY },
      { label: "Cust 2", price: "$17.96", t: 0.25, color: TEAL },
      { label: "Cust 3", price: "$17.05", t: 0.35, color: ORANGE },
      { label: "Cust 4", price: "$15.20", t: 0.50, color: GREEN },
    ],
  },
  {
    label: "Market Shifts — Model Adjusts",
    steepness: 4,
    customers: [
      { label: "Cust 1", price: "$19.42", t: 0.12, color: NAVY },
      { label: "Cust 2", price: "$18.30", t: 0.22, color: TEAL },
      { label: "Cust 3", price: "$16.50", t: 0.38, color: ORANGE },
      { label: "Cust 4", price: "$14.80", t: 0.55, color: GREEN },
    ],
  },
  {
    label: "Continued Evolution",
    steepness: 6.5,
    customers: [
      { label: "Cust 1", price: "$18.10", t: 0.18, color: NAVY },
      { label: "Cust 2", price: "$17.40", t: 0.28, color: TEAL },
      { label: "Cust 3", price: "$17.20", t: 0.33, color: ORANGE },
      { label: "Cust 4", price: "$15.60", t: 0.48, color: GREEN },
    ],
  },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.4 },
});

export function MarketEvolutionSlide() {
  const [stateIdx, setStateIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStateIdx((i) => (i + 1) % STATES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const state = STATES[stateIdx];
  const curve = useMemo(() => makeCurve(SLOT, state.steepness), [state.steepness]);
  const prevCurve = useMemo(
    () => stateIdx > 0 ? makeCurve(SLOT, STATES[stateIdx - 1].steepness) : null,
    [stateIdx],
  );

  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-5xl flex-col justify-center gap-4 px-6">
      <motion.div {...fadeUp(0)}>
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Dynamic Model
        </h2>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Evolves with changing market conditions and objectives to maximize profit
        </p>
      </motion.div>

      <motion.div
        className="rounded-md py-1.5 text-center text-xs font-semibold tracking-wider"
        style={{ backgroundColor: `${ORANGE}12`, color: ORANGE }}
        {...fadeUp(0.1)}
      >
        Dynamic Model Adjusts for Evolving Market Conditions
      </motion.div>

      <motion.div className="min-h-0 flex-1 rounded-xl border bg-card p-4" {...fadeUp(0.15)}>
        {/* State label */}
        <div className="mb-2 flex items-center justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={stateIdx}
              className="rounded-md border px-3 py-1 text-xs font-semibold"
              style={{ color: NAVY }}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.3 }}
            >
              {state.label}
            </motion.div>
          </AnimatePresence>

          {/* State dots */}
          <div className="flex gap-1.5">
            {STATES.map((_, i) => (
              <button
                key={i}
                onClick={() => setStateIdx(i)}
                className="size-2.5 rounded-full transition-colors"
                style={{ backgroundColor: i === stateIdx ? ORANGE : "#ddd" }}
              />
            ))}
          </div>
        </div>

        <svg viewBox={`0 0 ${SLOT.x + SLOT.w + 80} ${BASE_Y + 40}`} className="w-full">
          {/* Axes */}
          <line x1={SLOT.x} y1={BASE_Y} x2={SLOT.x + SLOT.w} y2={BASE_Y} stroke="#ddd" strokeWidth={1} />
          <line x1={SLOT.x} y1={SLOT.y} x2={SLOT.x} y2={BASE_Y} stroke="#ddd" strokeWidth={1} />
          <text x={20} y={SLOT.y + SLOT.h / 2} fontSize="11" fill="#999" textAnchor="middle" transform={`rotate(-90, 20, ${SLOT.y + SLOT.h / 2})`}>Price</text>
          <text x={SLOT.x + SLOT.w / 2} y={BASE_Y + 22} fontSize="11" fill="#999" textAnchor="middle">Demand</text>

          {/* Ghost curve from previous state */}
          {prevCurve && (
            <path d={prevCurve.d} fill="none" stroke={NAVY} strokeWidth={1.5} strokeOpacity={0.12} strokeDasharray="4 4" />
          )}

          {/* Current demand curve */}
          <motion.path
            d={curve.d}
            fill="none"
            stroke={NAVY}
            strokeWidth={2.5}
            strokeLinecap="round"
            animate={{ d: curve.d }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Customer points */}
          {state.customers.map((c, i) => {
            const pt = curve.sampleAt(c.t);
            return (
              <motion.g
                key={`${stateIdx}-${c.label}`}
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                <motion.circle
                  r={6}
                  fill={c.color}
                  animate={{ cx: pt.x, cy: pt.y }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                <motion.line
                  y2={BASE_Y}
                  stroke={c.color}
                  strokeWidth={0.8}
                  strokeDasharray="3 2"
                  strokeOpacity={0.3}
                  animate={{ x1: pt.x, y1: pt.y + 8, x2: pt.x }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                <motion.text
                  fontSize="10"
                  fontWeight="600"
                  fill={c.color}
                  animate={{ x: pt.x + 10, y: pt.y - 8 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  {c.label}: {c.price}
                </motion.text>
              </motion.g>
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
}
