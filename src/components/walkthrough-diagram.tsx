"use client";

import { Fragment, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BLUE,
  ORANGE,
  GREEN,
  NAVY,
  GRAY_BG,
  GRAY_BORDER,
  MUTED,
} from "./hub-spoke-diagram";

/* ═══════════════════════════════════════════════════════════════════
   Node & connection data
   ═══════════════════════════════════════════════════════════════════ */

interface NodeDef {
  id: string;
  label: string;
  subtitle: string;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
  zone: "input" | "engine" | "output";
}

const NW = 175;
const NH = 56;

const INPUTS: NodeDef[] = [
  { id: "execution", label: "Execution", subtitle: "Email · chat · quoting", color: BLUE, x: 70, y: 30, w: NW, h: NH, zone: "input" },
  { id: "data", label: "Data", subtitle: "Your deal history", color: NAVY, x: 45, y: 120, w: NW, h: NH, zone: "input" },
  { id: "market", label: "Market Signals", subtitle: "Conditions · benchmarks", color: ORANGE, x: 45, y: 210, w: NW, h: NH, zone: "input" },
  { id: "expertise", label: "Expertise", subtitle: "Industry · in-house", color: GREEN, x: 70, y: 300, w: NW, h: NH, zone: "input" },
];

const MODEL: NodeDef = {
  id: "model", label: "ML Model", subtitle: "Deterministic pricing",
  color: NAVY, x: 385, y: 135, w: 230, h: 115, zone: "engine",
};

const OUTPUTS: NodeDef[] = [
  { id: "conviction", label: "Conviction", subtitle: "Approve or flag", color: BLUE, x: 755, y: 60, w: NW, h: NH, zone: "output" },
  { id: "plan", label: "Plan", subtitle: "Drivers · talking points", color: ORANGE, x: 780, y: 165, w: NW, h: NH, zone: "output" },
  { id: "negotiate", label: "Negotiate", subtitle: "Guardrails · escalation", color: GREEN, x: 755, y: 270, w: NW, h: NH, zone: "output" },
];

interface PathDef {
  id: string;
  d: string;
  color: string;
}

const INPUT_PATHS: PathDef[] = [
  { id: "exec-model", d: "M245,58 C310,58 365,185 385,193", color: BLUE },
  { id: "data-model", d: "M220,148 C290,148 355,190 385,193", color: NAVY },
  { id: "market-model", d: "M220,238 C290,238 355,196 385,193", color: ORANGE },
  { id: "exp-model", d: "M245,328 C310,328 365,200 385,193", color: GREEN },
];

const OUTPUT_PATHS: PathDef[] = [
  { id: "model-conv", d: "M615,193 C660,193 720,88 755,88", color: BLUE },
  { id: "model-plan", d: "M615,193 C660,193 740,193 780,193", color: ORANGE },
  { id: "model-neg", d: "M615,193 C660,193 720,298 755,298", color: GREEN },
];

const FEEDBACK_PATHS: PathDef[] = [
  { id: "conv-model", d: "M755,88 C700,55 660,100 615,170", color: BLUE },
  { id: "neg-model", d: "M755,298 C700,335 660,280 615,215", color: GREEN },
];

const ZONES = {
  input: { x: 25, y: 12, w: 235, h: 360, rx: 14, color: BLUE },
  engine: { x: 365, y: 118, w: 270, h: 150, rx: 14, color: NAVY },
  output: { x: 735, y: 42, w: 215, h: 300, rx: 14, color: ORANGE },
} as const;

const ZONE_LABELS = {
  input: { x: 142, y: 6, text: "INPUTS" },
  engine: { x: 500, y: 112, text: "ENGINE" },
  output: { x: 842, y: 36, text: "OUTPUTS" },
} as const;

/* ═══════════════════════════════════════════════════════════════════
   Beat-driven visibility
   ═══════════════════════════════════════════════════════════════════ */

function nodeOp(id: string, zone: string, beat: number): number {
  if (beat === 0 || beat === 5 || beat === 6) return 1;
  if (beat === 4) return id === "conviction" || id === "negotiate" || id === "model" ? 1 : 0.1;
  if (beat === 1) return zone === "input" ? 1 : 0.1;
  if (beat === 2) return zone === "engine" ? 1 : 0.1;
  if (beat === 3) return zone === "output" ? 1 : zone === "engine" ? 0.3 : 0.1;
  return 1;
}

function isGlowing(id: string, zone: string, beat: number): boolean {
  if (beat === 0 || beat === 5) return false;
  if (beat === 6) return true;
  if (beat === 4) return id === "conviction" || id === "negotiate" || id === "model";
  return (
    (beat === 1 && zone === "input") ||
    (beat === 2 && zone === "engine") ||
    (beat === 3 && zone === "output")
  );
}

function connOp(type: "input" | "output", beat: number): number {
  if (beat === 0 || beat === 5 || beat === 6) return 0.5;
  if (beat === 1) return type === "input" ? 0.45 : 0.04;
  if (beat === 2) return type === "input" ? 0.35 : 0.04;
  if (beat === 3) return type === "output" ? 0.45 : 0.04;
  return 0.04;
}

function fbOp(beat: number): number {
  if (beat === 4) return 0.75;
  if (beat === 0 || beat === 5 || beat === 6) return 0.4;
  return 0.04;
}

function zoneBg(zone: "input" | "engine" | "output", beat: number): number {
  if (beat === 1 && zone === "input") return 0.06;
  if (beat === 2 && zone === "engine") return 0.06;
  if (beat === 3 && zone === "output") return 0.06;
  return 0;
}

function zoneLabel(zone: "input" | "engine" | "output", beat: number): number {
  if (beat === 0) return 0;
  if (beat === 1 && zone === "input") return 0.7;
  if (beat === 2 && zone === "engine") return 0.7;
  if (beat === 3 && zone === "output") return 0.7;
  if (beat === 5 || beat === 6) return 0.35;
  return 0.15;
}

function dots(type: "input" | "output" | "feedback", beat: number): boolean {
  if (beat === 5) return true;
  return (
    (beat === 2 && type === "input") ||
    (beat === 3 && type === "output") ||
    (beat === 4 && type === "feedback")
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Bezier sampling for flow dots
   ═══════════════════════════════════════════════════════════════════ */

function sampleBezier(d: string, steps = 12): { x: number; y: number }[] {
  const m = d.match(
    /M([\d.]+),([\d.]+)\s*C([\d.]+),([\d.]+)\s+([\d.]+),([\d.]+)\s+([\d.]+),([\d.]+)/,
  );
  if (!m) return [];
  const n = m.slice(1).map(Number);
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    pts.push({
      x: u ** 3 * n[0] + 3 * u ** 2 * t * n[2] + 3 * u * t ** 2 * n[4] + t ** 3 * n[6],
      y: u ** 3 * n[1] + 3 * u ** 2 * t * n[3] + 3 * u * t ** 2 * n[5] + t ** 3 * n[7],
    });
  }
  return pts;
}

/* ═══════════════════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════════════════ */

function CurveFlowDot({
  pathD,
  color,
  delay,
  r = 3,
}: {
  pathD: string;
  color: string;
  delay: number;
  r?: number;
}) {
  const pts = useMemo(() => sampleBezier(pathD, 12), [pathD]);
  if (pts.length === 0) return null;

  return (
    <motion.circle
      r={r}
      fill={color}
      animate={{
        cx: pts.map((p) => p.x),
        cy: pts.map((p) => p.y),
        opacity: pts.map((_, i) => (i <= 0 || i >= pts.length - 1 ? 0 : 0.6)),
      }}
      transition={{ duration: 2.4, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

function ProcessingBars({ x, y }: { x: number; y: number }) {
  return (
    <>
      <motion.rect
        x={x + 30} y={y} height={3} rx={1.5}
        fill="rgba(255,255,255,0.22)"
        animate={{ width: [60, 130, 40, 100, 60] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
      />
      <motion.rect
        x={x + 30} y={y + 8} height={3} rx={1.5}
        fill="rgba(255,255,255,0.16)"
        animate={{ width: [100, 50, 90, 60, 100] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" as const }}
      />
      <motion.rect
        x={x + 30} y={y + 16} height={3} rx={1.5}
        fill="rgba(255,255,255,0.12)"
        animate={{ width: [50, 100, 140, 40, 50] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" as const }}
      />
    </>
  );
}

function WTNodeBox({
  node,
  beat,
  entranceDelay,
  fast,
  onNodeClick,
  onNodeHover,
  onNodeLeave,
}: {
  node: NodeDef;
  beat: number;
  entranceDelay: number;
  fast: boolean;
  onNodeClick?: (nodeId: string) => void;
  onNodeHover?: (nodeId: string) => void;
  onNodeLeave?: () => void;
}) {
  const opacity = nodeOp(node.id, node.zone, beat);
  const glow = isGlowing(node.id, node.zone, beat);
  const isModel = node.zone === "engine";
  const tr = fast
    ? { duration: 0.5, ease: "easeInOut" as const }
    : { duration: 0.6, delay: entranceDelay, ease: "easeOut" as const };

  const iconX = node.x + node.w - 18;
  const iconY = node.y + 6;
  const iconR = 8;

  return (
    <motion.g initial={fast ? false : { opacity: 0 }} animate={{ opacity }} transition={tr}>
      {glow && (
        <motion.rect
          x={node.x - 5}
          y={node.y - 5}
          width={node.w + 10}
          height={node.h + 10}
          rx={isModel ? 18 : 12}
          fill="none"
          stroke={node.color}
          strokeWidth={2}
          animate={{ opacity: [0.15, 0.45, 0.15] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
        />
      )}

      {isModel ? (
        <>
          <rect
            x={node.x} y={node.y} width={node.w} height={node.h}
            rx={14} fill={NAVY}
          />
          <text
            x={node.x + node.w / 2} y={node.y + 44}
            fontSize="22" fontWeight="700" fill="white" textAnchor="middle"
          >
            {node.label}
          </text>
          <text
            x={node.x + node.w / 2} y={node.y + 64}
            fontSize="13" fill="rgba(255,255,255,0.85)" textAnchor="middle"
          >
            {node.subtitle}
          </text>
          <ProcessingBars x={node.x} y={node.y + 80} />
        </>
      ) : (
        <>
          <rect
            x={node.x} y={node.y} width={node.w} height={node.h} rx={8}
            fill={glow ? "white" : GRAY_BG}
            stroke={glow ? node.color : GRAY_BORDER}
            strokeWidth={glow ? 2 : 1}
          />
          <rect
            x={node.x + 1} y={node.y + 4}
            width={4} height={node.h - 8} rx={2}
            fill={node.color}
          />
          <text
            x={node.x + node.w / 2 + 2} y={node.y + 24}
            fontSize="13" fontWeight="600" fill="#1a1a1a" textAnchor="middle"
          >
            {node.label}
          </text>
          <text
            x={node.x + node.w / 2 + 2} y={node.y + 42}
            fontSize="12" fill="#3d4f5f" textAnchor="middle"
          >
            {node.subtitle}
          </text>

          {glow && (onNodeClick || onNodeHover) && (
            <g
              className="cursor-pointer"
              onClick={onNodeClick ? (e) => { e.stopPropagation(); onNodeClick(node.id); } : undefined}
              onMouseEnter={onNodeHover ? () => onNodeHover(node.id) : undefined}
              onMouseLeave={onNodeLeave}
            >
              <circle cx={iconX} cy={iconY + iconR} r={iconR} fill={node.color} opacity={0.12} />
              <circle cx={iconX} cy={iconY + iconR} r={iconR} fill="none" stroke={node.color} strokeWidth={1.2} opacity={0.5} />
              <text
                x={iconX} y={iconY + iconR + 4}
                fontSize="11" fontWeight="600" fill={node.color}
                textAnchor="middle"
              >
                i
              </text>
            </g>
          )}
        </>
      )}
    </motion.g>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main diagram
   ═══════════════════════════════════════════════════════════════════ */

interface WalkthroughDiagramProps {
  beat: number;
  skipEntrance?: boolean;
  onNodeClick?: (nodeId: string) => void;
  onNodeHover?: (nodeId: string) => void;
  onNodeLeave?: () => void;
}

export function WalkthroughDiagram({ beat, skipEntrance = false, onNodeClick, onNodeHover, onNodeLeave }: WalkthroughDiagramProps) {
  const [fast, setFast] = useState(skipEntrance);

  useEffect(() => {
    if (skipEntrance) {
      setFast(true);
      return;
    }
    if (beat > 0) {
      setFast(true);
      return;
    }
    const timer = setTimeout(() => setFast(true), 3000);
    return () => clearTimeout(timer);
  }, [beat, skipEntrance]);

  const STD = { duration: 0.5, ease: "easeInOut" as const };

  function tr(delay: number) {
    return fast ? STD : { duration: 0.6, delay, ease: "easeOut" as const };
  }

  return (
    <svg
      viewBox="0 -6 1000 466"
      className="w-full"
      role="img"
      aria-label="ML pricing model walkthrough"
    >
      {/* Zone backgrounds */}
      {(["input", "engine", "output"] as const).map((z) => (
        <motion.rect
          key={`zbg-${z}`}
          x={ZONES[z].x}
          y={ZONES[z].y}
          width={ZONES[z].w}
          height={ZONES[z].h}
          rx={ZONES[z].rx}
          fill={ZONES[z].color}
          initial={{ opacity: 0 }}
          animate={{ opacity: zoneBg(z, beat) }}
          transition={STD}
        />
      ))}

      {/* Zone labels */}
      {(["input", "engine", "output"] as const).map((z) => (
        <motion.text
          key={`zlbl-${z}`}
          x={ZONE_LABELS[z].x}
          y={ZONE_LABELS[z].y}
          fontSize="13"
          fontWeight="700"
          fill="#4a5568"
          textAnchor="middle"
          letterSpacing="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: zoneLabel(z, beat) }}
          transition={fast ? STD : { duration: 0.5, delay: 2.7, ease: "easeOut" as const }}
        >
          {ZONE_LABELS[z].text}
        </motion.text>
      ))}

      {/* Input connections */}
      {INPUT_PATHS.map((p, i) => (
        <Fragment key={p.id}>
          <motion.path
            d={p.d}
            fill="none"
            stroke={GRAY_BORDER}
            strokeWidth={2}
            initial={fast ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: connOp("input", beat) }}
            transition={tr(0.8 + i * 0.1)}
          />
          {dots("input", beat) && (
            <>
              <CurveFlowDot pathD={p.d} color={p.color} delay={i * 0.5} />
              <CurveFlowDot pathD={p.d} color={p.color} delay={i * 0.5 + 1.2} />
            </>
          )}
        </Fragment>
      ))}

      {/* Output connections */}
      {OUTPUT_PATHS.map((p, i) => (
        <Fragment key={p.id}>
          <motion.path
            d={p.d}
            fill="none"
            stroke={GRAY_BORDER}
            strokeWidth={2}
            initial={fast ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: connOp("output", beat) }}
            transition={tr(1.6 + i * 0.1)}
          />
          {dots("output", beat) && (
            <>
              <CurveFlowDot pathD={p.d} color={p.color} delay={i * 0.5} />
              <CurveFlowDot pathD={p.d} color={p.color} delay={i * 0.5 + 1.2} />
            </>
          )}
        </Fragment>
      ))}

      {/* Feedback arcs — Conviction and Negotiate loop back to Model */}
      {FEEDBACK_PATHS.map((fb, i) => (
        <Fragment key={fb.id}>
          <motion.path
            d={fb.d}
            fill="none"
            stroke={MUTED}
            strokeWidth={1.5}
            strokeDasharray="6 4"
            initial={fast ? false : { opacity: 0 }}
            animate={{ opacity: fbOp(beat) }}
            transition={tr(2.4 + i * 0.15)}
          />
          {dots("feedback", beat) && (
            <CurveFlowDot pathD={fb.d} color={fb.color} delay={i * 0.8} r={3.5} />
          )}
        </Fragment>
      ))}
      <motion.text
        x={685}
        y={193}
        fontSize="13"
        fontWeight="500"
        fill="#4a5568"
        textAnchor="middle"
        fontStyle="italic"
        initial={fast ? false : { opacity: 0 }}
        animate={{ opacity: beat === 4 ? 0.85 : beat === 0 || beat === 5 ? 0.55 : 0.04 }}
        transition={tr(2.6)}
      >
        Outcomes feed back
      </motion.text>

      {/* Input nodes */}
      {INPUTS.map((node, i) => (
        <WTNodeBox
          key={node.id}
          node={node}
          beat={beat}
          entranceDelay={0.2 + i * 0.15}
          fast={fast}
          onNodeClick={onNodeClick}
          onNodeHover={onNodeHover}
          onNodeLeave={onNodeLeave}
        />
      ))}

      {/* Model node */}
      <WTNodeBox node={MODEL} beat={beat} entranceDelay={1.3} fast={fast} />

      {/* Output nodes */}
      {OUTPUTS.map((node, i) => (
        <WTNodeBox
          key={node.id}
          node={node}
          beat={beat}
          entranceDelay={1.9 + i * 0.12}
          fast={fast}
          onNodeClick={onNodeClick}
        />
      ))}

    </svg>
  );
}
