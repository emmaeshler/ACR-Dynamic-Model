"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const TEAL = "#21A5D5";
const MUTED = "#5A6A78";
const DOT_GRAY = "#B5B7B0";

const REGIONS = [
  { label: "California", color: NAVY, mean: 172 },
  { label: "PNW", color: TEAL, mean: 148 },
  { label: "Southwest", color: "#9CC3DD", mean: 124 },
  { label: "Great Plains", color: ORANGE, mean: 96 },
];

const DOT_COUNT = 120;

function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function gaussian(rng: () => number) {
  let u = 0,
    v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

interface Dot {
  grayX: number;
  grayY: number;
  colorX: number;
  colorY: number;
  region: number;
}

function buildDots(): Dot[] {
  const rng = seededRng(42);
  const slot = { x: 30, y: 15, w: 380, h: 130 };
  const dots: Dot[] = [];

  for (let i = 0; i < DOT_COUNT; i++) {
    const grayX = slot.x + rng() * slot.w;
    const grayY = slot.y + rng() * slot.h;

    const quartile = Math.floor((i / DOT_COUNT) * 4);
    let region = quartile;
    if (rng() < 0.12)
      region = Math.max(0, Math.min(3, region + (rng() < 0.5 ? -1 : 1)));

    const stripW = slot.w / 4;
    const colorX =
      slot.x + stripW * (region + 0.5) + gaussian(rng) * stripW * 0.22;
    const meanY = [0.2, 0.38, 0.58, 0.78];
    const stdY = [0.09, 0.085, 0.09, 0.08];
    let cy = slot.y + meanY[region] * slot.h + gaussian(rng) * slot.h * stdY[region];
    if (rng() < 0.08) cy += gaussian(rng) * slot.h * 0.12;

    dots.push({
      grayX,
      grayY,
      colorX: Math.max(slot.x + 4, Math.min(slot.x + slot.w - 4, colorX)),
      colorY: Math.max(slot.y + 4, Math.min(slot.y + slot.h - 4, cy)),
      region,
    });
  }
  return dots;
}

export function RegionScatterVisual() {
  const [revealed, setRevealed] = useState(false);
  const dots = useMemo(buildDots, []);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!revealed) return;
    const reset = setTimeout(() => setRevealed(false), 5000);
    const reReveal = setTimeout(() => setRevealed(true), 6000);
    return () => {
      clearTimeout(reset);
      clearTimeout(reReveal);
    };
  }, [revealed]);

  return (
    <div className="space-y-2">
      <svg
        viewBox="0 0 440 175"
        className="w-full"
        role="img"
        aria-label="Scatter plot: 120 dots start gray then reveal four regional color clusters"
      >
        <line x1="30" y1="145" x2="410" y2="145" stroke="#e0e0e0" strokeWidth={1} />
        <line x1="30" y1="15" x2="30" y2="145" stroke="#e0e0e0" strokeWidth={1} />
        <text x="12" y="80" fontSize="8" fill="rgba(0,0,0,0.3)" textAnchor="middle" transform="rotate(-90,12,80)">
          Price
        </text>
        <text x="220" y="158" fontSize="8" fill="rgba(0,0,0,0.3)" textAnchor="middle">
          Deals
        </text>

        {dots.map((d, i) => (
          <motion.circle
            key={i}
            r={3}
            fill={revealed ? REGIONS[d.region].color : DOT_GRAY}
            initial={{ cx: d.grayX, cy: d.grayY, opacity: 0.45 }}
            animate={{
              cx: revealed ? d.colorX : d.grayX,
              cy: revealed ? d.colorY : d.grayY,
              opacity: revealed ? 0.75 : 0.45,
            }}
            transition={{
              duration: 0.7,
              delay: revealed ? d.region * 0.15 : 0,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Legend */}
        {REGIONS.map((r, i) => (
          <motion.g
            key={r.label}
            animate={{ opacity: revealed ? 1 : 0.3 }}
            transition={{ duration: 0.4, delay: revealed ? i * 0.15 : 0 }}
          >
            <circle cx={90 + i * 90} cy={170} r={3.5} fill={r.color} />
            <text x={97 + i * 90} y={173} fontSize="8" fill={MUTED}>
              {r.label}
            </text>
          </motion.g>
        ))}
      </svg>

      {/* Regional means */}
      <motion.div
        className="flex justify-center gap-4"
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        {REGIONS.map((r) => (
          <div key={r.label} className="text-center">
            <p className="text-[10px] font-medium" style={{ color: r.color }}>
              {r.label}
            </p>
            <p className="text-sm font-bold" style={{ color: r.color }}>
              ${r.mean}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
