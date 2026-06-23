"use client";

import { motion } from "framer-motion";

export function sampleCubicBezier(
  sx: number, sy: number,
  cp1x: number, cp1y: number,
  cp2x: number, cp2y: number,
  ex: number, ey: number,
  steps: number,
) {
  const cxArr: number[] = [];
  const cyArr: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    cxArr.push(u * u * u * sx + 3 * u * u * t * cp1x + 3 * u * t * t * cp2x + t * t * t * ex);
    cyArr.push(u * u * u * sy + 3 * u * u * t * cp1y + 3 * u * t * t * cp2y + t * t * t * ey);
  }
  return { cxArr, cyArr };
}

export interface FlowDotPath {
  sx: number; sy: number;
  cp1x: number; cp1y: number;
  cp2x: number; cp2y: number;
  ex: number; ey: number;
}

export function FlowDot({
  path,
  color,
  delay,
  duration = 4.5,
}: {
  path: FlowDotPath;
  color: string;
  delay: number;
  duration?: number;
}) {
  const { cxArr, cyArr } = sampleCubicBezier(
    path.sx, path.sy, path.cp1x, path.cp1y, path.cp2x, path.cp2y, path.ex, path.ey, 50,
  );

  return (
    <motion.circle
      r={3}
      fill={color}
      initial={{ opacity: 0 }}
      animate={{
        cx: cxArr,
        cy: cyArr,
        opacity: [0, 0.5, 0.5, 0.5, 0],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}
