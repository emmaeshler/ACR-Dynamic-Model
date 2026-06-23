"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAVY = "#00446A";
const TEAL = "#21A5D5";
const ORANGE = "#E56910";
const SLATE = "#2E5A88";
const AMBER = "#EF8B1D";

const MODULES = [
  { number: 1, label: "Design", subtitle: "Architecting the", subtitle2: "right model", color: NAVY },
  { number: 2, label: "Power", subtitle: "Intelligence behind", subtitle2: "recommendations", color: TEAL },
  { number: 3, label: "Execute", subtitle: "From model", subtitle2: "to market", color: ORANGE },
  { number: 4, label: "Refine", subtitle: "Learning from", subtitle2: "every response", color: SLATE },
  { number: 5, label: "Profit Growth", subtitle: "Measuring", subtitle2: "the impact", color: AMBER },
];

const SVG_W = 1050;
const SVG_H = 340;
const R = 32;
const LINE_Y = 130;
const CX = SVG_W / 2;

const LINE = MODULES.map((_, i) => ({
  x: 105 + i * 210,
  y: LINE_Y,
}));

const STEP_STAGGER = 0.9;
const TOTAL_ANIM = MODULES.length * STEP_STAGGER;
const COLLAPSE_DELAY = TOTAL_ANIM + 1.2;

const CARD_W = 220;
const CARD_H = 120;
const CARD_R = 16;

const MINI_R = 16;
const MINI_Y = LINE_Y + CARD_H / 2 + 50;
const MINI_SPACING = 160;
const MINI_START = CX - (MODULES.length - 1) * MINI_SPACING / 2;

export const OVERVIEW_TOTAL_STEPS = 1;

export function OverviewSlide({ step }: { step: number }) {
  const [collapsed, setCollapsed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    timerRef.current = setTimeout(
      () => setCollapsed(true),
      COLLAPSE_DELAY * 1000,
    );
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-5xl flex-col items-center justify-center px-6 pt-8">
      <motion.span
        className="mb-1 inline-block rounded-full px-3 py-0.5 text-[10px] font-bold tracking-[0.2em] uppercase"
        style={{ backgroundColor: `${NAVY}10`, color: NAVY }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Overview
      </motion.span>

      <motion.h2
        className="text-center text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
        style={{ color: NAVY }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        Five core pillars of a dynamic pricing model
      </motion.h2>

      <div className="flex min-h-[2rem] items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={collapsed ? "done" : "intro"}
            className="max-w-2xl text-center text-base text-muted-foreground"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            {collapsed
              ? "Each builds on the last — together they form our formula for a dynamic pricing model."
              : "Each one builds on the last. We'll walk through how they add up to our formula for a dynamic model."}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="relative w-full flex-1 min-h-0 mt-1">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-full">
          {/* Connecting arrows between adjacent steps */}
          {MODULES.slice(0, -1).map((m, i) => {
            const x1 = LINE[i].x + R + 6;
            const x2 = LINE[i + 1].x - R - 6;
            const arrowDelay = i * STEP_STAGGER + 0.7;
            return (
              <motion.g key={`arrow-${i}`}>
                <motion.line
                  x1={x1}
                  y1={LINE_Y}
                  x2={x2}
                  y2={LINE_Y}
                  stroke={m.color}
                  strokeWidth={2}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{
                    opacity: collapsed ? 0 : 0.5,
                    pathLength: collapsed ? 0 : 1,
                  }}
                  transition={collapsed
                    ? { duration: 0.4 }
                    : { duration: 0.6, delay: arrowDelay }
                  }
                />
                <motion.polygon
                  points={`${x2},${LINE_Y} ${x2 - 8},${LINE_Y - 5} ${x2 - 8},${LINE_Y + 5}`}
                  fill={m.color}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: collapsed ? 0 : 0.5 }}
                  transition={collapsed
                    ? { duration: 0.3 }
                    : { duration: 0.3, delay: arrowDelay + 0.4 }
                  }
                />
              </motion.g>
            );
          })}

          {/* Module circles, numbers, labels, subtitles — collapse to center */}
          {MODULES.map((m, i) => {
            const pos = LINE[i];
            const delay = i * STEP_STAGGER;
            return (
              <motion.g key={m.label}>
                <motion.circle
                  r={R}
                  fill={m.color}
                  initial={{ cx: pos.x, cy: pos.y, opacity: 0, scale: 0 }}
                  animate={{
                    cx: collapsed ? CX : pos.x,
                    cy: collapsed ? LINE_Y : pos.y,
                    opacity: collapsed ? 0 : 1,
                    scale: collapsed ? 0.3 : 1,
                  }}
                  transition={collapsed
                    ? { duration: 0.7, delay: i * 0.04, ease: "easeInOut" }
                    : { duration: 0.5, delay, ease: "easeOut" }
                  }
                />
                <motion.text
                  fontSize="18"
                  fontWeight="700"
                  fill="white"
                  textAnchor="middle"
                  dominantBaseline="central"
                  initial={{ x: pos.x, y: pos.y, opacity: 0 }}
                  animate={{
                    x: collapsed ? CX : pos.x,
                    y: collapsed ? LINE_Y : pos.y,
                    opacity: collapsed ? 0 : 1,
                  }}
                  transition={collapsed
                    ? { duration: 0.5 }
                    : { duration: 0.4, delay: delay + 0.15 }
                  }
                >
                  {m.number}
                </motion.text>

                <motion.text
                  fontSize="14"
                  fontWeight="700"
                  fill={m.color}
                  textAnchor="middle"
                  x={pos.x}
                  y={pos.y + R + 20}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: collapsed ? 0 : 1 }}
                  transition={collapsed
                    ? { duration: 0.3 }
                    : { duration: 0.4, delay: delay + 0.3 }
                  }
                >
                  {m.label}
                </motion.text>

                <motion.text
                  fontSize="11"
                  fontWeight="400"
                  fill="#666"
                  textAnchor="middle"
                  x={pos.x}
                  y={pos.y + R + 36}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: collapsed ? 0 : 0.75 }}
                  transition={collapsed
                    ? { duration: 0.3 }
                    : { duration: 0.4, delay: delay + 0.5 }
                  }
                >
                  {m.subtitle}
                </motion.text>
                <motion.text
                  fontSize="11"
                  fontWeight="400"
                  fill="#666"
                  textAnchor="middle"
                  x={pos.x}
                  y={pos.y + R + 50}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: collapsed ? 0 : 0.75 }}
                  transition={collapsed
                    ? { duration: 0.3 }
                    : { duration: 0.4, delay: delay + 0.5 }
                  }
                >
                  {m.subtitle2}
                </motion.text>
              </motion.g>
            );
          })}

          {/* Central card — appears after collapse */}
          <motion.g
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: collapsed ? 1 : 0,
              scale: collapsed ? 1 : 0.5,
            }}
            transition={{ duration: 0.6, delay: collapsed ? 0.5 : 0, ease: "easeOut" }}
            style={{ transformOrigin: `${CX}px ${LINE_Y}px` }}
          >
            <rect
              x={CX - CARD_W / 2}
              y={LINE_Y - CARD_H / 2}
              width={CARD_W}
              height={CARD_H}
              rx={CARD_R}
              fill={NAVY}
            />
            <text
              x={CX}
              y={LINE_Y - 12}
              fontSize="17"
              fontWeight="700"
              fill="white"
              textAnchor="middle"
            >
              Evidence-Based
            </text>
            <text
              x={CX}
              y={LINE_Y + 12}
              fontSize="17"
              fontWeight="700"
              fill="white"
              textAnchor="middle"
            >
              Pricing Model
            </text>
          </motion.g>

          {/* Static mini stepper — appears after collapse */}
          {MODULES.map((m, i) => {
            const mx = MINI_START + i * MINI_SPACING;
            return (
              <motion.g
                key={`mini-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: collapsed ? 1 : 0,
                  y: collapsed ? 0 : 12,
                }}
                transition={{ duration: 0.4, delay: collapsed ? 0.8 + i * 0.08 : 0 }}
              >
                <circle cx={mx} cy={MINI_Y} r={MINI_R} fill={m.color} />
                <text
                  x={mx}
                  y={MINI_Y + 1}
                  fontSize="11"
                  fontWeight="700"
                  fill="white"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {m.number}
                </text>
                <text
                  x={mx}
                  y={MINI_Y + MINI_R + 14}
                  fontSize="11"
                  fontWeight="600"
                  fill={m.color}
                  textAnchor="middle"
                >
                  {m.label}
                </text>
                {i < MODULES.length - 1 && (
                  <line
                    x1={mx + MINI_R + 4}
                    y1={MINI_Y}
                    x2={mx + MINI_SPACING - MINI_R - 4}
                    y2={MINI_Y}
                    stroke={m.color}
                    strokeWidth={1.5}
                    strokeOpacity={0.35}
                  />
                )}
              </motion.g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
