"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAVY = "#00446a";
const ORANGE = "#D97C14";
const GREEN = "#2e7d32";
const MUTED = "#7a7570";

interface CellData {
  text: string;
  highlight?: boolean;
  strong?: boolean;
  headerColor?: string;
}

function MatrixTable({
  headers,
  rowHeaders,
  cells,
  color,
}: {
  headers?: string[];
  rowHeaders: string[];
  cells: CellData[][];
  color: string;
}) {
  const cellW = 38;
  const cellH = 20;
  const rhW = 24;
  const hdrH = headers ? 16 : 0;
  const totalW = rhW + cells[0].length * cellW;
  const totalH = hdrH + rowHeaders.length * cellH;

  return (
    <g>
      {headers?.map((h, i) => (
        <text
          key={`h-${i}`}
          x={rhW + i * cellW + cellW / 2}
          y={hdrH - 4}
          fontSize="8"
          fontWeight="600"
          fill={color}
          textAnchor="middle"
        >
          {h}
        </text>
      ))}
      {rowHeaders.map((rh, row) => (
        <g key={`row-${row}`}>
          <text
            x={rhW - 4}
            y={hdrH + row * cellH + cellH / 2 + 3}
            fontSize="8.5"
            fontWeight="600"
            fill={color}
            textAnchor="end"
          >
            {rh}
          </text>
          {cells[row].map((cell, col) => {
            const cx = rhW + col * cellW;
            const cy = hdrH + row * cellH;
            return (
              <g key={`cell-${row}-${col}`}>
                <rect
                  x={cx}
                  y={cy}
                  width={cellW}
                  height={cellH}
                  fill={cell.strong ? color : "none"}
                  fillOpacity={cell.strong ? 0.12 : 0}
                  stroke="#d4d0cb"
                  strokeWidth={0.5}
                  rx={1}
                />
                <text
                  x={cx + cellW / 2}
                  y={cy + cellH / 2 + 3}
                  fontSize="9"
                  fill={cell.highlight || cell.strong ? color : MUTED}
                  fontWeight={cell.strong ? "600" : "400"}
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {cell.text}
                </text>
              </g>
            );
          })}
        </g>
      ))}
      <rect
        x={rhW}
        y={hdrH}
        width={totalW - rhW}
        height={totalH - hdrH}
        fill="none"
        stroke="#d4d0cb"
        strokeWidth={0.8}
        rx={2}
      />
    </g>
  );
}

function Operator({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text
      x={x}
      y={y}
      fontSize="16"
      fill={MUTED}
      fontWeight="300"
      textAnchor="middle"
    >
      {text}
    </text>
  );
}

function ListDiscountEquation() {
  return (
    <svg viewBox="0 0 420 95" className="w-full" role="img" aria-label="List Price times Discount equals Net Price matrix">
      <g transform="translate(8,10)">
        <text x="24" y="-2" fontSize="7.5" fill={MUTED} fontWeight="600" textAnchor="middle" letterSpacing="0.04em">LIST PRICE</text>
        <MatrixTable
          rowHeaders={["P1", "P2", "P3"]}
          cells={[
            [{ text: "$100", highlight: true }],
            [{ text: "$95" }],
            [{ text: "$100" }],
          ]}
          color={NAVY}
        />
      </g>
      <Operator x={90} y={52} text="×" />
      <g transform="translate(104,10)">
        <text x="24" y="-2" fontSize="7.5" fill={MUTED} fontWeight="600" textAnchor="middle" letterSpacing="0.04em">DISCOUNT</text>
        <MatrixTable
          rowHeaders={["C1", "C2", "C3"]}
          cells={[
            [{ text: "30%", highlight: true }],
            [{ text: "15%" }],
            [{ text: "5%" }],
          ]}
          color={ORANGE}
        />
      </g>
      <Operator x={190} y={52} text="=" />
      <g transform="translate(206,10)">
        <text x="74" y="-2" fontSize="7.5" fill={MUTED} fontWeight="600" textAnchor="middle" letterSpacing="0.04em">NET PRICE</text>
        <MatrixTable
          headers={["C1", "C2", "C3"]}
          rowHeaders={["P1", "P2", "P3"]}
          cells={[
            [{ text: "$70", strong: true }, { text: "$85", highlight: true }, { text: "$95", highlight: true }],
            [{ text: "$67", highlight: true }, { text: "$81" }, { text: "$90" }],
            [{ text: "$70", highlight: true }, { text: "$85" }, { text: "$95" }],
          ]}
          color={NAVY}
        />
      </g>
      <text x="340" y="90" fontSize="7" fill={MUTED} textAnchor="middle">Model adjusts list prices and discounts independently</text>
    </svg>
  );
}

function LevelsEquation() {
  return (
    <svg viewBox="0 0 420 95" className="w-full" role="img" aria-label="Product times Level grid times Customer Level equals Price">
      <g transform="translate(2,10)">
        <text x="95" y="-2" fontSize="7.5" fill={MUTED} fontWeight="600" textAnchor="middle" letterSpacing="0.04em">PRODUCT × LEVEL</text>
        <MatrixTable
          headers={["L1", "L2", "L3", "L4", "L5"]}
          rowHeaders={["P1", "P2", "P3"]}
          cells={[
            [{ text: "$96" }, { text: "$86" }, { text: "$76", strong: true }, { text: "$71" }, { text: "$65" }],
            [{ text: "$92" }, { text: "$82" }, { text: "$72", highlight: true }, { text: "$67" }, { text: "$60" }],
            [{ text: "$100" }, { text: "$90" }, { text: "$80", highlight: true }, { text: "$75" }, { text: "$68" }],
          ]}
          color={NAVY}
        />
      </g>
      <Operator x={226} y={52} text="×" />
      <g transform="translate(240,10)">
        <text x="35" y="-2" fontSize="7.5" fill={MUTED} fontWeight="600" textAnchor="middle" letterSpacing="0.04em">CUST LEVEL</text>
        <MatrixTable
          rowHeaders={["C1", "C2", "C3"]}
          cells={[
            [{ text: "L3", strong: true }],
            [{ text: "L1" }],
            [{ text: "L5" }],
          ]}
          color={ORANGE}
        />
      </g>
      <Operator x={330} y={52} text="=" />
      <g transform="translate(344,10)">
        <text x="30" y="-2" fontSize="7.5" fill={MUTED} fontWeight="600" textAnchor="middle" letterSpacing="0.04em">C1 PRICE</text>
        <MatrixTable
          rowHeaders={["P1", "P2", "P3"]}
          cells={[
            [{ text: "$76", strong: true }],
            [{ text: "$72", highlight: true }],
            [{ text: "$80", highlight: true }],
          ]}
          color={NAVY}
        />
      </g>
    </svg>
  );
}

function TargetPriceEquation() {
  const attrBoxes = [
    { label: "Product attributes", y: 8 },
    { label: "Customer attributes", y: 32 },
    { label: "Order attributes", y: 56 },
  ];
  return (
    <svg viewBox="0 0 420 90" className="w-full" role="img" aria-label="Multiple attributes flow into one model producing a unique price per deal">
      {attrBoxes.map((a, i) => (
        <g key={i}>
          <rect x={30} y={a.y} width={120} height={20} rx={4} fill={NAVY} fillOpacity={0.08} stroke={NAVY} strokeWidth={0.6} strokeOpacity={0.3} />
          <text x={90} y={a.y + 13} fontSize="8.5" fontWeight="600" fill={NAVY} textAnchor="middle">{a.label}</text>
        </g>
      ))}
      <path d="M155,18 L180,42 M155,42 L180,42 M155,66 L180,42" fill="none" stroke={MUTED} strokeWidth={1} strokeOpacity={0.4} />
      <text x={175} y={48} fontSize="14" fill={MUTED}>→</text>
      <rect x={192} y={24} width={80} height={36} rx={6} fill={NAVY} fillOpacity={0.06} stroke={NAVY} strokeWidth={1.2} />
      <text x={232} y={40} fontSize="10" fontWeight="700" fill={NAVY} textAnchor="middle">Model</text>
      <text x={232} y={52} fontSize="7" fill={MUTED} textAnchor="middle">20+ attributes</text>
      <text x={295} y={48} fontSize="14" fill={MUTED}>→</text>
      <g transform="translate(310,22)">
        <text x={45} y={12} fontSize="10" fontWeight="700" fill={ORANGE} textAnchor="middle">Unique price</text>
        <text x={45} y={24} fontSize="10" fontWeight="700" fill={ORANGE} textAnchor="middle">per deal</text>
        <text x={45} y={36} fontSize="7" fill={MUTED} textAnchor="middle">Floor · Target · Stretch</text>
      </g>
    </svg>
  );
}

const STRUCTURES = [
  {
    key: "ld",
    label: "List & Discount",
    sub: "Wide variance, simple administration",
    color: NAVY,
    Component: ListDiscountEquation,
  },
  {
    key: "levels",
    label: "Levels",
    sub: "Tier-governed, moderate exceptions",
    color: ORANGE,
    Component: LevelsEquation,
  },
  {
    key: "target",
    label: "Target Price",
    sub: "Tightest precision, fewest exceptions",
    color: GREEN,
    Component: TargetPriceEquation,
  },
];

export function PricingStructureEquationsVisual() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((a) => (a + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const structure = STRUCTURES[active];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2">
        {STRUCTURES.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setActive(i)}
            className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
            style={{
              backgroundColor: i === active ? s.color : "transparent",
              color: i === active ? "white" : s.color,
              border: `1px solid ${i === active ? s.color : s.color + "40"}`,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border bg-white/60 p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={structure.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <structure.Component />
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={structure.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-center text-xs text-muted-foreground"
        >
          <span className="font-semibold" style={{ color: structure.color }}>{structure.label}</span>
          {" — "}{structure.sub}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
