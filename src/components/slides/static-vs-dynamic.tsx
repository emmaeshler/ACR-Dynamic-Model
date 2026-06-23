"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { makeCurve } from "../visuals/demand-curve";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const TEAL = "#21A5D5";

const SLOT = { x: 30, y: 20, w: 260, h: 160 };
const BASE_Y = SLOT.y + SLOT.h;
const curve = makeCurve(SLOT, 5);

const CUSTOMERS = [
  { label: "A2: $19.24", t: 0.18, color: NAVY },
  { label: "A: $17.96", t: 0.28, color: NAVY },
  { label: "B: $16.73", t: 0.38, color: TEAL },
  { label: "B2: $14.89", t: 0.52, color: ORANGE },
];

const TREE_LEVELS = [
  { delay: 0, key: "root" },
  { delay: 0.3, key: "l1" },
  { delay: 0.6, key: "l2" },
  { delay: 0.9, key: "l3" },
  { delay: 1.2, key: "output" },
];

function StaticTree() {
  return (
    <svg viewBox="0 0 300 230" className="w-full max-w-md">
      {/* Root */}
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: TREE_LEVELS[0].delay, duration: 0.4 }}
      >
        <rect x={110} y={10} width={80} height={28} rx={4} fill={NAVY} />
        <text x={150} y={28} fontSize="10" fontWeight="600" fill="white" textAnchor="middle">Customer</text>
      </motion.g>

      {/* Level 1 branches */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: TREE_LEVELS[1].delay, duration: 0.4 }}
      >
        <line x1={150} y1={38} x2={80} y2={60} stroke={NAVY} strokeWidth={1.5} opacity={0.4} />
        <line x1={150} y1={38} x2={220} y2={60} stroke={NAVY} strokeWidth={1.5} opacity={0.4} />
        <rect x={40} y={60} width={80} height={24} rx={4} fill={NAVY} fillOpacity={0.7} />
        <text x={80} y={76} fontSize="9" fill="white" textAnchor="middle">Strategic</text>
        <rect x={180} y={60} width={80} height={24} rx={4} fill={NAVY} fillOpacity={0.4} />
        <text x={220} y={76} fontSize="9" fill="white" textAnchor="middle">Standard</text>
      </motion.g>

      {/* Level 2 */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: TREE_LEVELS[2].delay, duration: 0.4 }}
      >
        <line x1={80} y1={84} x2={45} y2={106} stroke={NAVY} strokeWidth={1} opacity={0.3} />
        <line x1={80} y1={84} x2={115} y2={106} stroke={NAVY} strokeWidth={1} opacity={0.3} />
        <rect x={15} y={106} width={60} height={22} rx={3} fill={TEAL} fillOpacity={0.6} />
        <text x={45} y={121} fontSize="8" fill="white" textAnchor="middle">Specialized</text>
        <rect x={85} y={106} width={60} height={22} rx={3} fill={TEAL} fillOpacity={0.3} />
        <text x={115} y={121} fontSize="8" fill="white" textAnchor="middle">Commodity</text>
      </motion.g>

      {/* Leaf nodes */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: TREE_LEVELS[3].delay, duration: 0.4 }}
      >
        <line x1={45} y1={128} x2={30} y2={148} stroke={NAVY} strokeWidth={1} opacity={0.2} />
        <line x1={45} y1={128} x2={60} y2={148} stroke={NAVY} strokeWidth={1} opacity={0.2} />
        <line x1={115} y1={128} x2={100} y2={148} stroke={NAVY} strokeWidth={1} opacity={0.2} />
        <line x1={115} y1={128} x2={130} y2={148} stroke={NAVY} strokeWidth={1} opacity={0.2} />
        {[30, 60, 100, 130].map((x) => (
          <rect key={x} x={x - 15} y={148} width={30} height={18} rx={2} fill="#ddd" />
        ))}
      </motion.g>

      {/* Single output */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: TREE_LEVELS[4].delay, duration: 0.5 }}
      >
        <line x1={80} y1={172} x2={80} y2={190} stroke={ORANGE} strokeWidth={2} opacity={0.5} />
        <rect x={40} y={190} width={80} height={26} rx={6} fill={ORANGE} />
        <text x={80} y={207} fontSize="11" fontWeight="700" fill="white" textAnchor="middle">A: $17.96</text>
      </motion.g>

      <motion.text
        x={150}
        y={228}
        fontSize="9"
        fill="rgba(0,0,0,0.4)"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.4 }}
      >
        One path → one price
      </motion.text>
    </svg>
  );
}

function DynamicCurve() {
  const revenuePathD = (() => {
    const pts: string[] = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const p = curve.sampleAt(t);
      pts.push(`${i === 0 ? "M" : "L"} ${p.x} ${p.y}`);
    }
    pts.push(`L ${SLOT.x + SLOT.w} ${BASE_Y}`);
    pts.push(`L ${SLOT.x} ${BASE_Y} Z`);
    return pts.join(" ");
  })();

  return (
    <svg viewBox="0 0 320 230" className="w-full max-w-lg">
      {/* Axes */}
      <line x1={SLOT.x} y1={BASE_Y} x2={SLOT.x + SLOT.w} y2={BASE_Y} stroke="#ccc" strokeWidth={1} />
      <line x1={SLOT.x} y1={SLOT.y} x2={SLOT.x} y2={BASE_Y} stroke="#ccc" strokeWidth={1} />
      <text x={15} y={SLOT.y + SLOT.h / 2} fontSize="9" fill="#999" textAnchor="middle" transform={`rotate(-90, 15, ${SLOT.y + SLOT.h / 2})`}>Price</text>
      <text x={SLOT.x + SLOT.w / 2} y={BASE_Y + 16} fontSize="9" fill="#999" textAnchor="middle">Demand</text>

      {/* Revenue area fill */}
      <motion.path
        d={revenuePathD}
        fill={NAVY}
        fillOpacity={0.08}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      />

      {/* Demand curve */}
      <motion.path
        d={curve.d}
        fill="none"
        stroke={NAVY}
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
      />

      {/* Customer dots */}
      {CUSTOMERS.map((c, i) => {
        const pt = curve.sampleAt(c.t);
        return (
          <motion.g
            key={c.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.15 }}
          >
            <circle cx={pt.x} cy={pt.y} r={6} fill={c.color} />
            <line x1={pt.x} y1={pt.y + 7} x2={pt.x} y2={BASE_Y} stroke={c.color} strokeWidth={0.7} strokeDasharray="3 2" opacity={0.3} />
            <text x={pt.x + 10} y={pt.y - 8} fontSize="10" fontWeight="600" fill={c.color}>
              {c.label}
            </text>
          </motion.g>
        );
      })}

      {/* Revenue label */}
      <motion.text
        x={SLOT.x + SLOT.w / 2}
        y={BASE_Y - 20}
        fontSize="10"
        fontWeight="600"
        fill={NAVY}
        textAnchor="middle"
        fillOpacity={0.4}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1 }}
      >
        Revenue $
      </motion.text>

      <motion.text
        x={SLOT.x + SLOT.w / 2}
        y={BASE_Y + 34}
        fontSize="9"
        fill="rgba(0,0,0,0.4)"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
      >
        Multiple positions → maximized capture
      </motion.text>
    </svg>
  );
}

export function StaticVsDynamicSlide() {
  const [isDynamic, setIsDynamic] = useState(false);

  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-5xl flex-col items-center justify-center gap-6 px-6">
      <motion.h2
        className="text-center text-2xl font-bold tracking-tight sm:text-3xl"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {isDynamic ? "Dynamic Model" : "Static Decision Logic"}
      </motion.h2>

      <div className="relative flex w-full items-center justify-center" style={{ minHeight: 320 }}>
        <AnimatePresence mode="wait">
          {!isDynamic ? (
            <motion.div
              key="static"
              className="flex w-full flex-col items-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <StaticTree />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dynamic"
              className="flex w-full flex-col items-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-xl border bg-card p-6 shadow-sm" style={{ borderColor: `${ORANGE}30` }}>
                <div className="mb-3 rounded-md py-1.5 text-center text-xs font-bold tracking-wider uppercase" style={{ backgroundColor: `${ORANGE}10`, color: ORANGE }}>
                  Dynamic Decision Logic
                </div>
                <DynamicCurve />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        className="rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors"
        style={{ backgroundColor: isDynamic ? NAVY : ORANGE }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsDynamic((d) => !d)}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isDynamic ? 0.3 : 1.6, duration: 0.4 }}
      >
        {isDynamic ? "← Back to Static" : "Make it Dynamic →"}
      </motion.button>

      <AnimatePresence>
        {isDynamic && (
          <motion.p
            className="max-w-md text-center text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.3, duration: 0.4 }}
          >
            Instead of one path to one price, the model places each customer on the demand curve — capturing margin a static tree leaves behind.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
