"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { makeCurve, makeParabolaPath, makeSigmoidPath } from "./demand-curve";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const TEAL = "#21A5D5";
const MUTED = "#5A6A78";
const GREEN = "#2e7d32";

const LEFT_SLOT = { x: 10, y: 20, w: 170, h: 120 };
const RIGHT_SLOT = { x: 10, y: 10, w: 170, h: 110 };

const SWEEP_STEPS = 7;
const PEAK_T = 0.55;

function parabolaYAtT(t: number, slot: typeof RIGHT_SLOT) {
  const peakH = 0.85;
  let y =
    slot.y +
    slot.h * (1 - (1 - Math.pow((t - PEAK_T) * 2.6, 2)) * peakH * 0.85);
  y = Math.max(slot.y + 10, Math.min(slot.y + slot.h - 10, y));
  const x = slot.x + 15 + t * (slot.w - 30);
  return { x, y };
}

export function ObjectiveFunctionVisual() {
  const [sweepIdx, setSweepIdx] = useState(0);
  const [running, setRunning] = useState(true);

  const advance = useCallback(() => {
    setSweepIdx((i) => {
      if (i >= SWEEP_STEPS - 1) {
        setRunning(false);
        return i;
      }
      return i + 1;
    });
  }, []);

  useEffect(() => {
    if (!running) {
      const reset = setTimeout(() => {
        setSweepIdx(0);
        setRunning(true);
      }, 2400);
      return () => clearTimeout(reset);
    }
    const timer = setInterval(advance, 600);
    return () => clearInterval(timer);
  }, [running, advance]);

  const sweepT = 0.15 + (sweepIdx / (SWEEP_STEPS - 1)) * 0.65;
  const curve = makeCurve(LEFT_SLOT);
  const curvePt = curve.sampleAt(sweepT);
  const parabD = makeParabolaPath(RIGHT_SLOT, PEAK_T, 0.85);
  const sigD = makeSigmoidPath(RIGHT_SLOT);
  const parabPt = parabolaYAtT(sweepT, RIGHT_SLOT);

  const sigSamples = 64;
  const sigT = sweepT;
  const sigX = RIGHT_SLOT.x + 15 + sigT * (RIGHT_SLOT.w - 30);
  const sigYNorm = 1 / (1 + Math.exp(7 * (sigT - 0.5)));
  const sigY =
    RIGHT_SLOT.y +
    (1 - sigYNorm) * RIGHT_SLOT.h * 0.74 +
    RIGHT_SLOT.h * 0.13;

  const atPeak = sweepIdx === SWEEP_STEPS - 1;

  return (
    <div className="flex gap-3">
      {/* Left: Demand Curve */}
      <div className="flex-1">
        <p
          className="mb-1 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: NAVY }}
        >
          Demand Curve
        </p>
        <div className="rounded-lg border bg-white/60 p-2">
          <svg viewBox="0 0 190 155" className="w-full">
            <line
              x1={LEFT_SLOT.x}
              y1={LEFT_SLOT.y + LEFT_SLOT.h}
              x2={LEFT_SLOT.x + LEFT_SLOT.w}
              y2={LEFT_SLOT.y + LEFT_SLOT.h}
              stroke="#ddd"
              strokeWidth={0.8}
            />
            <line
              x1={LEFT_SLOT.x}
              y1={LEFT_SLOT.y}
              x2={LEFT_SLOT.x}
              y2={LEFT_SLOT.y + LEFT_SLOT.h}
              stroke="#ddd"
              strokeWidth={0.8}
            />
            <path
              d={curve.d}
              fill="none"
              stroke={NAVY}
              strokeWidth={2}
              strokeLinecap="round"
            />
            {/* Price dot on curve */}
            <motion.circle
              cx={curvePt.x}
              cy={curvePt.y}
              r={5}
              fill={ORANGE}
              animate={{ cx: curvePt.x, cy: curvePt.y }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            {/* Dashed vertical from dot to axis */}
            <motion.line
              x1={curvePt.x}
              y1={curvePt.y}
              x2={curvePt.x}
              y2={LEFT_SLOT.y + LEFT_SLOT.h}
              stroke={ORANGE}
              strokeWidth={0.8}
              strokeDasharray="3 2"
              strokeOpacity={0.5}
              animate={{ x1: curvePt.x, x2: curvePt.x }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            <text
              x={LEFT_SLOT.x + LEFT_SLOT.w / 2}
              y={LEFT_SLOT.y + LEFT_SLOT.h + 14}
              fontSize="7"
              fill={MUTED}
              textAnchor="middle"
            >
              Quantity →
            </text>
            <text
              x={LEFT_SLOT.x - 4}
              y={LEFT_SLOT.y + LEFT_SLOT.h / 2}
              fontSize="7"
              fill={MUTED}
              textAnchor="middle"
              transform={`rotate(-90,${LEFT_SLOT.x - 4},${LEFT_SLOT.y + LEFT_SLOT.h / 2})`}
            >
              Price →
            </text>
          </svg>
        </div>
      </div>

      {/* Right: Parabola + Sigmoid */}
      <div className="flex-1">
        <p
          className="mb-1 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: ORANGE }}
        >
          Objective
        </p>
        <div className="rounded-lg border bg-white/60 p-2">
          <svg viewBox="0 0 190 135" className="w-full">
            <line
              x1={RIGHT_SLOT.x}
              y1={RIGHT_SLOT.y + RIGHT_SLOT.h}
              x2={RIGHT_SLOT.x + RIGHT_SLOT.w}
              y2={RIGHT_SLOT.y + RIGHT_SLOT.h}
              stroke="#ddd"
              strokeWidth={0.8}
            />
            <line
              x1={RIGHT_SLOT.x}
              y1={RIGHT_SLOT.y}
              x2={RIGHT_SLOT.x}
              y2={RIGHT_SLOT.y + RIGHT_SLOT.h}
              stroke="#ddd"
              strokeWidth={0.8}
            />

            {/* Parabola */}
            <path
              d={parabD}
              fill="none"
              stroke={ORANGE}
              strokeWidth={1.8}
              strokeLinecap="round"
            />
            {/* Sigmoid */}
            <path
              d={sigD}
              fill="none"
              stroke={MUTED}
              strokeWidth={1.2}
              strokeDasharray="4 3"
              strokeLinecap="round"
            />

            {/* Sweep dot on parabola */}
            <motion.circle
              cx={parabPt.x}
              cy={parabPt.y}
              r={4.5}
              fill={ORANGE}
              animate={{ cx: parabPt.x, cy: parabPt.y }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            {/* Sweep dot on sigmoid */}
            <motion.circle
              cx={sigX}
              cy={sigY}
              r={3.5}
              fill={MUTED}
              animate={{ cx: sigX, cy: sigY }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />

            {/* Peak marker */}
            {atPeak && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <line
                  x1={parabPt.x}
                  y1={parabPt.y - 8}
                  x2={parabPt.x}
                  y2={parabPt.y - 20}
                  stroke={ORANGE}
                  strokeWidth={1}
                />
                <text
                  x={parabPt.x}
                  y={parabPt.y - 23}
                  fontSize="7"
                  fontWeight="600"
                  fill={ORANGE}
                  textAnchor="middle"
                >
                  OPTIMAL
                </text>
              </motion.g>
            )}

            {/* Labels */}
            <text
              x={RIGHT_SLOT.x + RIGHT_SLOT.w - 4}
              y={RIGHT_SLOT.y + 16}
              fontSize="7"
              fill={ORANGE}
              textAnchor="end"
              fontWeight="600"
            >
              Margin $
            </text>
            <text
              x={RIGHT_SLOT.x + RIGHT_SLOT.w - 4}
              y={RIGHT_SLOT.y + RIGHT_SLOT.h - 6}
              fontSize="7"
              fill={MUTED}
              textAnchor="end"
            >
              Win Rate
            </text>
            <text
              x={RIGHT_SLOT.x + RIGHT_SLOT.w / 2}
              y={RIGHT_SLOT.y + RIGHT_SLOT.h + 14}
              fontSize="7"
              fill={MUTED}
              textAnchor="middle"
            >
              Price →
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
