"use client";

import { motion } from "framer-motion";

const NAVY = "#00446a";
const ORANGE = "#D97C14";
const GREEN = "#2e7d32";
const MUTED = "#7a7570";

interface BarData {
  x: number;
  h: number;
}

function seed(n: number) {
  return ((n * 1103515245 + 12345) >>> 16) & 0x7fff;
}

function generatePolicyBars(count: number): BarData[] {
  const bars: BarData[] = [];
  const heights = [0.3, 0.85, 1.0, 0.7, 0.4, 0.15];
  const positions = [0.1, 0.25, 0.42, 0.58, 0.74, 0.9];
  for (let i = 0; i < Math.min(count, positions.length); i++) {
    bars.push({ x: positions[i], h: heights[i] });
  }
  return bars;
}

function generateModelBars(count: number): BarData[] {
  const bars: BarData[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const bell = Math.exp(-Math.pow((t - 0.45) / 0.22, 2));
    const jitter = (seed(i * 7 + 3) / 0x7fff - 0.5) * 0.15;
    bars.push({ x: t, h: Math.max(0.05, bell + jitter) });
  }
  return bars;
}

function DistributionChart({
  bars,
  color,
  label,
  adherence,
  barWidth,
}: {
  bars: BarData[];
  color: string;
  label: string;
  adherence: number;
  barWidth: number;
}) {
  const slotX = 10;
  const slotY = 8;
  const slotW = 165;
  const slotH = 80;
  const baseY = slotY + slotH;
  const maxH = slotH - 4;

  return (
    <div className="flex-1">
      <svg viewBox="0 0 185 115" className="w-full">
        <line x1={slotX} y1={baseY} x2={slotX + slotW} y2={baseY} stroke="#ddd" strokeWidth={0.8} />
        <line x1={slotX} y1={slotY} x2={slotX} y2={baseY} stroke="#ddd" strokeWidth={0.8} />

        {bars.map((bar, i) => {
          const bx = slotX + bar.x * slotW - barWidth / 2;
          const bh = bar.h * maxH;
          return (
            <motion.rect
              key={i}
              x={bx}
              y={baseY - bh}
              width={barWidth}
              height={bh}
              rx={1}
              fill={color}
              fillOpacity={0.6}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.4, delay: i * 0.02 }}
              style={{ transformOrigin: `${bx + barWidth / 2}px ${baseY}px` }}
            />
          );
        })}

        <text x={slotX + slotW / 2} y={baseY + 12} fontSize="7" fill={MUTED} textAnchor="middle">Discount / Price</text>

        <text x={slotX + slotW / 2} y={baseY + 28} fontSize="8" fill={color} fontWeight="600" textAnchor="middle">{label}</text>

        <g transform={`translate(${slotX}, ${baseY + 34})`}>
          <rect x={0} y={0} width={slotW} height={6} rx={3} fill="#e5e7eb" />
          <rect x={0} y={0} width={slotW * adherence / 100} height={6} rx={3} fill={color} fillOpacity={0.7} />
          <text x={slotW + 6} y={6} fontSize="8" fontWeight="600" fill={color}>{adherence}%</text>
        </g>
        <text x={slotX} y={baseY + 52} fontSize="7" fill={MUTED}>Adherence</text>
      </svg>
    </div>
  );
}

export function PolicyVsModelDistribution() {
  const policyBars = generatePolicyBars(6);
  const modelBars = generateModelBars(30);

  return (
    <div className="space-y-1">
      <div className="flex gap-3">
        <DistributionChart
          bars={policyBars}
          color={MUTED}
          label="Policy (6 prices)"
          adherence={62}
          barWidth={14}
        />
        <div className="flex items-center">
          <svg viewBox="0 0 20 80" className="h-16 w-4">
            <text x="10" y="44" fontSize="14" fill={MUTED} textAnchor="middle">→</text>
          </svg>
        </div>
        <DistributionChart
          bars={modelBars}
          color={NAVY}
          label="Model (30+ prices)"
          adherence={91}
          barWidth={4}
        />
      </div>
      <p className="text-center text-[10px] text-muted-foreground">
        More price points fill gaps under the demand curve — fewer exceptions, more profit captured
      </p>
    </div>
  );
}
