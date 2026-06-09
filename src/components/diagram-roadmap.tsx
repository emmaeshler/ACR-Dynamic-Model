"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { BLUE, ORANGE, GREEN, NAVY, GRAY_BG, GRAY_BORDER, MUTED } from "./hub-spoke-diagram";

export type DiagramNode =
  | "execution"
  | "data"
  | "market"
  | "expertise"
  | "model"
  | "conviction"
  | "plan"
  | "negotiate";

interface NodeDef {
  id: DiagramNode;
  label: string;
  subtitle: string;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const NODE_H = 62;
const INPUT_X = 20;
const INPUT_W = 190;
const OUTPUT_X = 740;
const OUTPUT_W = 190;

const INPUTS: NodeDef[] = [
  { id: "execution", label: "Execution", subtitle: "Email · chat · quoting", color: BLUE, x: INPUT_X, y: 25, w: INPUT_W, h: NODE_H },
  { id: "data", label: "Data", subtitle: "Your deal history", color: NAVY, x: INPUT_X, y: 107, w: INPUT_W, h: NODE_H },
  { id: "market", label: "Market Signals", subtitle: "Conditions · benchmarks", color: ORANGE, x: INPUT_X, y: 189, w: INPUT_W, h: NODE_H },
  { id: "expertise", label: "Expertise", subtitle: "Industry · in-house", color: GREEN, x: INPUT_X, y: 271, w: INPUT_W, h: NODE_H },
];

const MODEL: NodeDef = {
  id: "model",
  label: "ML Model",
  subtitle: "Deterministic pricing",
  color: NAVY,
  x: 380,
  y: 138,
  w: 200,
  h: 85,
};

const OUTPUTS: NodeDef[] = [
  { id: "conviction", label: "Conviction", subtitle: "Approve or flag", color: BLUE, x: OUTPUT_X, y: 53, w: OUTPUT_W, h: NODE_H },
  { id: "plan", label: "Plan", subtitle: "Drivers · talking points", color: ORANGE, x: OUTPUT_X, y: 148, w: OUTPUT_W, h: NODE_H },
  { id: "negotiate", label: "Negotiate", subtitle: "Guardrails · escalation", color: GREEN, x: OUTPUT_X, y: 243, w: OUTPUT_W, h: NODE_H },
];

const ALL_NODES: NodeDef[] = [...INPUTS, MODEL, ...OUTPUTS];

export function getNodeColor(node: DiagramNode): string {
  return ALL_NODES.find((n) => n.id === node)?.color ?? MUTED;
}

const INPUT_ARROWS = [
  { fromNode: "execution" as DiagramNode, x1: 212, y1: 56, x2: 378, y2: 162 },
  { fromNode: "data" as DiagramNode, x1: 212, y1: 138, x2: 378, y2: 172 },
  { fromNode: "market" as DiagramNode, x1: 212, y1: 220, x2: 378, y2: 188 },
  { fromNode: "expertise" as DiagramNode, x1: 212, y1: 302, x2: 378, y2: 198 },
];

const OUTPUT_ARROWS = [
  { toNode: "conviction" as DiagramNode, x1: 582, y1: 166, x2: 738, y2: 84 },
  { toNode: "plan" as DiagramNode, x1: 582, y1: 180, x2: 738, y2: 171 },
  { toNode: "negotiate" as DiagramNode, x1: 582, y1: 194, x2: 738, y2: 272 },
];

const GHOST = 0.07;
const GHOST_ARROW = 0.04;

function nodeOpacity(
  nodeId: DiagramNode,
  highlight?: DiagramNode,
  visibleNodes?: DiagramNode[],
): number {
  if (visibleNodes && !visibleNodes.includes(nodeId)) return GHOST;
  if (!highlight) return 1;
  return nodeId === highlight ? 1 : 0.2;
}

function arrowOpacity(
  fromId: DiagramNode,
  toId: DiagramNode,
  highlight?: DiagramNode,
  visibleNodes?: DiagramNode[],
): number {
  if (visibleNodes) {
    if (!visibleNodes.includes(fromId) || !visibleNodes.includes(toId))
      return GHOST_ARROW;
  }
  if (!highlight) return 0.7;
  if (fromId === highlight || toId === highlight) return 0.6;
  return 0.08;
}

const EASE = "easeOut" as const;

function FlowDot({
  x1,
  y1,
  x2,
  y2,
  delay,
  color,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
  color: string;
}) {
  return (
    <motion.circle
      r={2.5}
      fill={color}
      initial={{ cx: x1, cy: y1, opacity: 0 }}
      animate={{
        cx: [x1, x2],
        cy: [y1, y2],
        opacity: [0, 0.6, 0.6, 0],
      }}
      transition={{
        duration: 2.5,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

function ModelProcessing({ x, y }: { x: number; y: number }) {
  return (
    <>
      <motion.rect
        x={x + 30}
        y={y}
        height={3}
        rx={1.5}
        fill="rgba(255,255,255,0.22)"
        animate={{ width: [60, 120, 40, 90, 60] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
      />
      <motion.rect
        x={x + 30}
        y={y + 8}
        height={3}
        rx={1.5}
        fill="rgba(255,255,255,0.16)"
        animate={{ width: [100, 50, 80, 60, 100] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" as const }}
      />
      <motion.rect
        x={x + 30}
        y={y + 16}
        height={3}
        rx={1.5}
        fill="rgba(255,255,255,0.12)"
        animate={{ width: [50, 90, 130, 40, 50] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" as const }}
      />
    </>
  );
}

function NodeBox({
  node,
  highlight,
  activeNode,
  animated,
  entranceDelay = 0,
  visibleNodes,
}: {
  node: NodeDef;
  highlight?: DiagramNode;
  activeNode?: DiagramNode;
  animated?: boolean;
  entranceDelay?: number;
  visibleNodes?: DiagramNode[];
}) {
  const isHighlighted = highlight === node.id;
  const isActive = activeNode === node.id;
  const showGlow = isHighlighted || isActive;
  const opacity = nodeOpacity(node.id, highlight, visibleNodes);
  const isModel = node.id === "model";
  const delay = animated ? entranceDelay : 0;

  return (
    <motion.g
      initial={animated ? { opacity: 0 } : false}
      animate={{ opacity }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {showGlow && (
        <motion.rect
          x={node.x - 4}
          y={node.y - 4}
          width={node.w + 8}
          height={node.h + 8}
          rx={isModel ? 16 : 12}
          fill="none"
          stroke={node.color}
          strokeWidth={2}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
        />
      )}

      {isModel ? (
        <>
          <rect
            x={node.x}
            y={node.y}
            width={node.w}
            height={node.h}
            rx={12}
            fill={NAVY}
          />
          <text x={node.x + node.w / 2} y={node.y + 32} fontSize="18" fontWeight="700" fill="white" textAnchor="middle">
            {node.label}
          </text>
          <text x={node.x + node.w / 2} y={node.y + 50} fontSize="11" fill="rgba(255,255,255,0.7)" textAnchor="middle">
            {node.subtitle}
          </text>
          <ModelProcessing x={node.x} y={node.y + 60} />
        </>
      ) : (
        <>
          <rect
            x={node.x}
            y={node.y}
            width={node.w}
            height={node.h}
            rx={8}
            fill={showGlow ? "white" : GRAY_BG}
            stroke={showGlow ? node.color : GRAY_BORDER}
            strokeWidth={showGlow ? 2 : 1}
          />
          <rect
            x={node.x + 1}
            y={node.y + 4}
            width={4}
            height={node.h - 8}
            rx={2}
            fill={node.color}
          />
          <text x={node.x + node.w / 2 + 2} y={node.y + 27} fontSize="14" fontWeight="600" fill="#1a1a1a" textAnchor="middle">
            {node.label}
          </text>
          <text x={node.x + node.w / 2 + 2} y={node.y + 45} fontSize="11" fill={MUTED} textAnchor="middle">
            {node.subtitle}
          </text>
        </>
      )}
    </motion.g>
  );
}

const ENTRANCE = {
  inputs: [0.2, 0.35, 0.5, 0.65],
  inputArrows: [0.85, 0.9, 0.95, 1.0],
  model: 1.3,
  outputArrows: [1.7, 1.75, 1.8],
  outputs: [1.9, 2.05, 2.2],
  feedback: 2.6,
  flow: 3.2,
};

interface DiagramRoadmapProps {
  highlight?: DiagramNode;
  animated?: boolean;
  visibleNodes?: DiagramNode[];
  activeNode?: DiagramNode;
}

export function DiagramRoadmap({
  highlight,
  animated,
  visibleNodes,
  activeNode,
}: DiagramRoadmapProps) {
  const showFlow = animated && !highlight && !visibleNodes;

  return (
    <svg viewBox="0 0 960 420" className="w-full" role="img" aria-label="ML pricing model pipeline diagram">
      <defs>
        <marker id="rm-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill={GRAY_BORDER} />
        </marker>
        <marker id="rm-arrow-muted" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill={MUTED} />
        </marker>
      </defs>

      {/* Input → Model arrows */}
      {INPUT_ARROWS.map((a, i) => (
        <motion.line
          key={`in-${a.fromNode}`}
          x1={a.x1}
          y1={a.y1}
          x2={a.x2}
          y2={a.y2}
          stroke={GRAY_BORDER}
          strokeWidth={1.5}
          markerEnd="url(#rm-arrow)"
          initial={animated ? { opacity: 0 } : false}
          animate={{ opacity: arrowOpacity(a.fromNode, "model", highlight, visibleNodes) }}
          transition={{ duration: 0.4, delay: animated ? ENTRANCE.inputArrows[i] : 0 }}
        />
      ))}

      {/* Model → Output arrows */}
      {OUTPUT_ARROWS.map((a, i) => (
        <motion.line
          key={`out-${a.toNode}`}
          x1={a.x1}
          y1={a.y1}
          x2={a.x2}
          y2={a.y2}
          stroke={GRAY_BORDER}
          strokeWidth={1.5}
          markerEnd="url(#rm-arrow)"
          initial={animated ? { opacity: 0 } : false}
          animate={{ opacity: arrowOpacity("model", a.toNode, highlight, visibleNodes) }}
          transition={{ duration: 0.4, delay: animated ? ENTRANCE.outputArrows[i] : 0 }}
        />
      ))}

      {/* Feedback arc */}
      <motion.path
        d="M835 305 C835 400, 115 400, 115 169"
        fill="none"
        stroke={MUTED}
        strokeWidth={1.5}
        strokeDasharray="6 4"
        markerEnd="url(#rm-arrow-muted)"
        initial={animated ? { opacity: 0 } : false}
        animate={{
          opacity:
            visibleNodes && (!visibleNodes.includes("negotiate") || !visibleNodes.includes("data"))
              ? GHOST_ARROW
              : highlight
                ? 0.1
                : 0.5,
        }}
        transition={{ duration: 0.6, delay: animated ? ENTRANCE.feedback : 0 }}
      />
      <motion.text
        x={480}
        y={400}
        fontSize="11"
        fill={MUTED}
        textAnchor="middle"
        fontStyle="italic"
        initial={animated ? { opacity: 0 } : false}
        animate={{
          opacity:
            visibleNodes && (!visibleNodes.includes("negotiate") || !visibleNodes.includes("data"))
              ? GHOST_ARROW
              : highlight
                ? 0.1
                : 0.5,
        }}
        transition={{ duration: 0.5, delay: animated ? ENTRANCE.feedback + 0.3 : 0 }}
      >
        Outcomes feed back into the model
      </motion.text>

      {/* Flow dots — only on full animated diagram */}
      {showFlow &&
        INPUT_ARROWS.map((a, i) => (
          <Fragment key={`flow-in-${a.fromNode}`}>
            <FlowDot
              x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
              color={INPUTS[i].color}
              delay={ENTRANCE.flow + i * 0.4}
            />
            <FlowDot
              x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
              color={INPUTS[i].color}
              delay={ENTRANCE.flow + i * 0.4 + 1.25}
            />
          </Fragment>
        ))}
      {showFlow &&
        OUTPUT_ARROWS.map((a, i) => (
          <Fragment key={`flow-out-${a.toNode}`}>
            <FlowDot
              x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
              color={OUTPUTS[i].color}
              delay={ENTRANCE.flow + 1.8 + i * 0.4}
            />
            <FlowDot
              x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
              color={OUTPUTS[i].color}
              delay={ENTRANCE.flow + 1.8 + i * 0.4 + 1.25}
            />
          </Fragment>
        ))}

      {/* Nodes */}
      {INPUTS.map((node, i) => (
        <NodeBox
          key={node.id}
          node={node}
          highlight={highlight}
          activeNode={activeNode}
          animated={animated}
          entranceDelay={ENTRANCE.inputs[i]}
          visibleNodes={visibleNodes}
        />
      ))}
      <NodeBox
        node={MODEL}
        highlight={highlight}
        activeNode={activeNode}
        animated={animated}
        entranceDelay={ENTRANCE.model}
        visibleNodes={visibleNodes}
      />
      {OUTPUTS.map((node, i) => (
        <NodeBox
          key={node.id}
          node={node}
          highlight={highlight}
          activeNode={activeNode}
          animated={animated}
          entranceDelay={ENTRANCE.outputs[i]}
          visibleNodes={visibleNodes}
        />
      ))}
    </svg>
  );
}
