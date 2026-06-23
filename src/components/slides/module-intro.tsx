"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const TEAL = "#21A5D5";

interface ModuleConfig {
  number: number;
  label: string;
  color: string;
}

const MODULES: ModuleConfig[] = [
  { number: 1, label: "Design", color: NAVY },
  { number: 2, label: "Power", color: TEAL },
  { number: 3, label: "Execute", color: ORANGE },
  { number: 4, label: "Refine", color: NAVY },
  { number: 5, label: "Profit Growth", color: ORANGE },
];

// Radial diagram constants
const SVG_W = 420;
const SVG_H = 340;
const CX = 210;
const CY = 160;
const RING = 115;
const R = 24;
const MW = 120;
const MH = 72;

const COL = Array.from({ length: 5 }, (_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  return { x: CX + RING * Math.cos(a), y: CY + RING * Math.sin(a) };
});

const TEXT_DELAY = 0.55;

interface ModuleIntroProps {
  number: number;
  label: string;
  headline: string;
  description: string;
}

export function ModuleIntroSlide({ number, label, headline, description }: ModuleIntroProps) {
  const accent = MODULES.find((m) => m.number === number)?.color ?? NAVY;
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), TEXT_DELAY * 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-5xl flex-col px-6">
      {/* ── Breadcrumb stepper (always at top) ── */}
      <motion.div
        className="flex items-center justify-center gap-3 pt-6 pb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {MODULES.map((m, i) => {
          const active = m.number === number;
          const past = m.number < number;
          return (
            <div key={m.number} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  className="flex items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: active ? m.color : past ? m.color : "#E2E8F0",
                    color: active || past ? "white" : "#94A3B8",
                  }}
                  animate={{
                    width: active ? 32 : 24,
                    height: active ? 32 : 24,
                  }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {m.number}
                </motion.div>
                <motion.span
                  className="text-[10px] font-semibold whitespace-nowrap"
                  style={{ color: active ? m.color : past ? m.color : "#94A3B8" }}
                  animate={{ opacity: active ? 1 : 0.6 }}
                >
                  {m.label}
                </motion.span>
              </div>
              {i < MODULES.length - 1 && (
                <div
                  className="mb-4 h-px w-6 sm:w-10"
                  style={{
                    backgroundColor: m.number < number ? m.color : "#E2E8F0",
                    opacity: m.number < number ? 0.4 : 0.3,
                  }}
                />
              )}
            </div>
          );
        })}
      </motion.div>

      {/* ── Main content area ── */}
      <div className="flex flex-1 min-h-0 items-center justify-center">
        <div className="flex w-full items-center justify-center gap-8 lg:gap-12">
          {/* Diagram panel */}
          <motion.div
            className="flex-shrink-0"
            style={{ width: "45%", maxWidth: 420 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div>
              <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full">
                {/* Radial lines */}
                {MODULES.map((m, i) => {
                  const dx = CX - COL[i].x;
                  const dy = CY - COL[i].y;
                  const len = Math.sqrt(dx * dx + dy * dy);
                  const nx = dx / len;
                  const ny = dy / len;
                  const active = m.number === number;

                  return (
                    <motion.line
                      key={`line-${i}`}
                      x1={COL[i].x + nx * (R + 3)}
                      y1={COL[i].y + ny * (R + 3)}
                      x2={CX - nx * 38}
                      y2={CY - ny * 38}
                      stroke={m.color}
                      strokeWidth={active ? 2.5 : 1.5}
                      initial={{ opacity: 0, pathLength: 0 }}
                      animate={{
                        opacity: active ? 0.6 : 0.15,
                        pathLength: 1,
                      }}
                      transition={{
                        duration: 0.6,
                        delay: 0.15 + i * 0.06,
                        ease: "easeOut",
                      }}
                    />
                  );
                })}

                {/* Central box */}
                <motion.g
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  style={{ transformOrigin: `${CX}px ${CY}px` }}
                >
                  <rect
                    x={CX - MW / 2}
                    y={CY - MH / 2}
                    width={MW}
                    height={MH}
                    rx={12}
                    fill={NAVY}
                  />
                  <text
                    x={CX}
                    y={CY - 8}
                    fontSize="11"
                    fontWeight="700"
                    fill="white"
                    textAnchor="middle"
                  >
                    Evidence-Based
                  </text>
                  <text
                    x={CX}
                    y={CY + 8}
                    fontSize="11"
                    fontWeight="700"
                    fill="white"
                    textAnchor="middle"
                  >
                    Pricing Model
                  </text>
                  <rect
                    x={CX - 16}
                    y={CY + 18}
                    width={32}
                    height={2}
                    rx={1}
                    fill="rgba(255,255,255,0.2)"
                  />
                </motion.g>

                {/* Module circles + labels */}
                {MODULES.map((m, i) => {
                  const active = m.number === number;
                  const pos = COL[i];

                  return (
                    <motion.g key={m.label}>
                      {/* Glow ring for active spoke */}
                      {active && (
                        <motion.circle
                          cx={pos.x}
                          cy={pos.y}
                          r={R + 6}
                          fill="none"
                          stroke={m.color}
                          strokeWidth={2}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: [0, 0.5, 0],
                            scale: [0.9, 1.15, 0.9],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.6,
                          }}
                          style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                        />
                      )}

                      {/* Circle */}
                      <motion.circle
                        cx={pos.x}
                        cy={pos.y}
                        r={R}
                        fill={m.color}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                          opacity: active ? 1 : 0.25,
                          scale: 1,
                        }}
                        transition={{
                          duration: 0.4,
                          delay: 0.2 + i * 0.08,
                          ease: "easeOut",
                        }}
                        style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                      />

                      {/* Number */}
                      <motion.text
                        x={pos.x}
                        y={pos.y}
                        fontSize="13"
                        fontWeight="700"
                        fill="white"
                        textAnchor="middle"
                        dominantBaseline="central"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: active ? 1 : 0.3 }}
                        transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                      >
                        {m.number}
                      </motion.text>

                      {/* Label background + text */}
                      <motion.rect
                        x={pos.x - (m.label.length * 3.2)}
                        y={pos.y + R + 5}
                        width={m.label.length * 6.4}
                        height={14}
                        rx={3}
                        fill="white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: active ? 1 : 0.2 }}
                        transition={{ duration: 0.3, delay: 0.35 + i * 0.08 }}
                      />
                      <motion.text
                        x={pos.x}
                        y={pos.y + R + 14}
                        fontSize="10"
                        fontWeight="600"
                        fill={m.color}
                        textAnchor="middle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: active ? 1 : 0.2 }}
                        transition={{ duration: 0.3, delay: 0.35 + i * 0.08 }}
                      >
                        {m.label}
                      </motion.text>
                    </motion.g>
                  );
                })}

                {/* Flow dot from active spoke to center */}
                {MODULES.map((m, i) => {
                  if (m.number !== number) return null;
                  const dx = CX - COL[i].x;
                  const dy = CY - COL[i].y;
                  const len = Math.sqrt(dx * dx + dy * dy);
                  const nx = dx / len;
                  const ny = dy / len;
                  const sx = COL[i].x + nx * (R + 6);
                  const sy = COL[i].y + ny * (R + 6);
                  const ex = CX - nx * 42;
                  const ey = CY - ny * 42;

                  return (
                    <motion.circle
                      key={`dot-${i}`}
                      r={3}
                      fill={m.color}
                      animate={{
                        cx: [sx, ex],
                        cy: [sy, ey],
                        opacity: [0, 0.7, 0.7, 0],
                      }}
                      transition={{
                        duration: 2.5,
                        delay: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  );
                })}
              </svg>
            </div>
          </motion.div>

          {/* Text panel */}
          <motion.div
            className="flex flex-1 flex-col items-start text-left"
            style={{ minWidth: 0 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: showText ? 1 : 0,
              y: showText ? 0 : 8,
            }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <span
              className="mb-3 inline-block text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: accent }}
            >
              {label}
            </span>

            <h2
              className="max-w-lg text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
              style={{ color: NAVY }}
            >
              {headline}
            </h2>

            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>

            <motion.div
              className="mt-8 h-px w-16"
              style={{ backgroundColor: accent }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{
                opacity: showText ? 0.4 : 0,
                scaleX: showText ? 1 : 0,
              }}
              transition={{ delay: showText ? 0.3 : 0, duration: 0.6 }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
