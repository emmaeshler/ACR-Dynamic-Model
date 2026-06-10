"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAVY = "#00446a";
const RED = "#c62828";
const GREEN = "#2e7d32";
const MUTED = "#7a7570";

const HEADLINES = [
  "Your price. Flat.",
  "But the market never holds still.",
  "The gap is revenue leakage.",
  "The model reads the signals. Sets the price.",
  "92% of addressable margin — captured.",
];

const BEAT_MS = 3000;
const N_BEATS = 5;

const W = 460, H = 170;
const PL = 38, PR = 12, PT = 20, PB = 25;
const P_MIN = 4.30, P_MAX = 6.10;
const STATIC_P = 5.00;

const MKT = [
  5.02, 4.95, 4.78, 4.62, 4.52, 4.58, 4.72, 4.92,
  5.12, 5.32, 5.48, 5.42, 5.52, 5.68, 5.58, 5.42,
  5.28, 5.48, 5.62, 5.72, 5.68,
];

const DYN = MKT.map((p) => STATIC_P + (p - STATIC_P) * 0.92);

const N = MKT.length;

function tx(i: number) {
  return PL + (i / (N - 1)) * (W - PL - PR);
}
function py(p: number) {
  return PT + ((P_MAX - p) / (P_MAX - P_MIN)) * (H - PT - PB);
}

const STATIC_Y = py(STATIC_P);

function linePath(prices: number[]) {
  return prices.map((p, i) => `${i === 0 ? "M" : "L"}${tx(i)},${py(p)}`).join(" ");
}

function gapBetween(y1: (i: number) => number, y2: (i: number) => number) {
  let d = `M${tx(0)},${y1(0)}`;
  for (let i = 1; i < N; i++) d += ` L${tx(i)},${y1(i)}`;
  for (let i = N - 1; i >= 0; i--) d += ` L${tx(i)},${y2(i)}`;
  return d + " Z";
}

const staticPath = `M${tx(0)},${STATIC_Y} L${tx(N - 1)},${STATIC_Y}`;
const mktPath = linePath(MKT);
const dynPath = linePath(DYN);
const bigGap = gapBetween(() => STATIC_Y, (i) => py(MKT[i]));
const smallGap = gapBetween((i) => py(DYN[i]), (i) => py(MKT[i]));

const GAP_LABELS: {
  x: number;
  y: number;
  line1: string;
  line2: string;
}[] = [
  {
    x: tx(3),
    y: (STATIC_Y + py(MKT[3])) / 2,
    line1: "Overpriced here",
    line2: "→ losing deals",
  },
  {
    x: tx(13),
    y: (STATIC_Y + py(MKT[13])) / 2,
    line1: "Underpriced here",
    line2: "→ giving away margin",
  },
];

const MODEL_REACTIONS: {
  t: number;
  signal: string;
  extraUp: number;
}[] = [
  { t: 4,  signal: "Competitor drops",  extraUp: 0 },
  { t: 9,  signal: "Costs up 12%",      extraUp: 0 },
  { t: 14, signal: "Demand surges",     extraUp: 16 },
  { t: 17, signal: "New entrant",       extraUp: 4 },
];

export function PriceDriftHero() {
  const [beat, setBeat] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    setBeat((b) => (b >= N_BEATS ? 1 : b + 1));
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(advance, beat === 0 ? 100 : BEAT_MS);
    return () => clearTimeout(t);
  }, [beat, paused, advance]);

  const goBack = useCallback(() => {
    setBeat((b) => (b <= 1 ? N_BEATS : b - 1));
    setPaused(true);
  }, []);
  const goForward = useCallback(() => {
    setBeat((b) => (b >= N_BEATS ? 1 : b + 1));
    setPaused(true);
  }, []);

  return (
    <div className="space-y-2">
      {/* Headline */}
      <div className="min-h-[20px]">
        <AnimatePresence mode="wait">
          {beat >= 1 && (
            <motion.h4
              key={beat}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-semibold tracking-tight"
            >
              {HEADLINES[beat - 1]}
            </motion.h4>
          )}
        </AnimatePresence>
      </div>

      {/* Chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Price over time: static pricing vs. dynamic market"
      >
        {/* Grid */}
        {[4.50, 5.00, 5.50, 6.00].map((p) => (
          <g key={p}>
            <line
              x1={PL - 4} y1={py(p)} x2={PL} y2={py(p)}
              stroke="#ccc" strokeWidth={0.7}
            />
            <text x={PL - 7} y={py(p) + 3} fontSize="7" fill={MUTED} textAnchor="end">
              ${p.toFixed(2)}
            </text>
            <line
              x1={PL} y1={py(p)} x2={W - PR} y2={py(p)}
              stroke="#f0f0f0" strokeWidth={0.5}
            />
          </g>
        ))}

        {/* X-axis */}
        <line x1={PL} y1={H - PB} x2={W - PR} y2={H - PB} stroke="#ddd" strokeWidth={0.8} />
        {["Q1", "Q2", "Q3", "Q4", "Q1"].map((q, i) => (
          <text
            key={i} x={tx(i * 5)} y={H - PB + 12}
            fontSize="7" fill={MUTED} textAnchor="middle"
          >
            {q}
          </text>
        ))}

        {/* ── Big gap fill — beats 3-4 ── */}
        <AnimatePresence>
          {beat >= 3 && beat <= 4 && (
            <motion.path
              d={bigGap}
              fill={RED}
              fillOpacity={0.1}
              stroke="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: beat >= 4 ? 0.15 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>

        {/* gap annotations are rendered later in the SVG for z-order */}

        {/* ── Small gap fill — beat 4+ ── */}
        <AnimatePresence>
          {beat >= 4 && (
            <motion.path
              d={smallGap}
              fill={GREEN}
              fillOpacity={0.18}
              stroke="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          )}
        </AnimatePresence>

        {/* ── Static price line — beat 1+ ── */}
        {beat >= 1 && (
          <motion.path
            d={staticPath}
            fill="none"
            stroke={RED}
            strokeWidth={1.8}
            strokeDasharray="6 3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, opacity: beat >= 4 ? 0.2 : 1 }}
            transition={{ duration: 0.8 }}
          />
        )}

        {/* Static label */}
        {beat >= 1 && (
          <motion.text
            x={tx(0) + 4} y={STATIC_Y - 6}
            fontSize="7.5" fill={RED} fontWeight="600"
            initial={{ opacity: 0 }}
            animate={{ opacity: beat >= 4 ? 0.2 : 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            Your Price — $5.00
          </motion.text>
        )}

        {/* ── Market line — beat 2+ ── */}
        {beat >= 2 && (
          <motion.path
            d={mktPath}
            fill="none"
            stroke={NAVY}
            strokeWidth={2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, opacity: beat >= 5 ? 0.3 : 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        )}

        {/* Market label */}
        {beat >= 2 && (
          <motion.text
            x={tx(N - 1) - 2} y={py(MKT[N - 1]) - 7}
            fontSize="7.5" fill={NAVY} fontWeight="600" textAnchor="end"
            initial={{ opacity: 0 }}
            animate={{ opacity: beat >= 5 ? 0.3 : 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            Market
          </motion.text>
        )}

        {/* ── Market signal annotations — beat 2 only ── */}
        <AnimatePresence>
          {beat === 2 &&
            MODEL_REACTIONS.map((r, idx) => {
              const cx = tx(r.t);
              const cy = py(MKT[r.t]);
              const cardW = 72;
              const cardH = 16;
              const cardY = cy - 18 - r.extraUp;

              return (
                <motion.g
                  key={`mkt-${r.t}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.8 + idx * 0.2, duration: 0.35 }}
                >
                  <circle cx={cx} cy={cy} r={2.5} fill={NAVY} />
                  <line
                    x1={cx} y1={cy - 3}
                    x2={cx} y2={cardY + cardH / 2 - 1}
                    stroke={NAVY} strokeWidth={0.6} strokeOpacity={0.35}
                  />
                  <rect
                    x={cx - cardW / 2} y={cardY - cardH / 2}
                    width={cardW} height={cardH}
                    rx={3}
                    fill="white" fillOpacity={0.95}
                    stroke={NAVY} strokeWidth={0.6} strokeOpacity={0.3}
                  />
                  <text
                    x={cx} y={cardY + 3}
                    fontSize="6" fill={NAVY} textAnchor="middle" fontWeight="600"
                  >
                    {r.signal}
                  </text>
                </motion.g>
              );
            })}
        </AnimatePresence>

        {/* ── Dynamic model line — beat 4+ ── */}
        {beat >= 4 && (
          <motion.path
            d={dynPath}
            fill="none"
            stroke={GREEN}
            strokeWidth={2.2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        )}

        {/* ── Model reaction callouts — beat 4+ ── */}
        {beat >= 4 &&
          MODEL_REACTIONS.map((r, idx) => {
            const cx = tx(r.t);
            const cy = py(DYN[r.t]);
            const price = `$${DYN[r.t].toFixed(2)}`;
            const cardY = cy - 22 - r.extraUp;
            const cardW = 88;
            const cardH = 22;

            return (
              <motion.g
                key={r.t}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.25, duration: 0.4, type: "spring", bounce: 0.3 }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              >
                <circle cx={cx} cy={cy} r={4} fill={GREEN} />
                <circle cx={cx} cy={cy} r={7} fill={GREEN} fillOpacity={0.15} />

                <line
                  x1={cx} y1={cy - 4}
                  x2={cx} y2={cardY + cardH / 2 - 2}
                  stroke={GREEN} strokeWidth={1} strokeOpacity={0.5}
                />

                <rect
                  x={cx - cardW / 2} y={cardY - cardH / 2}
                  width={cardW} height={cardH}
                  rx={4}
                  fill={GREEN} fillOpacity={0.08}
                  stroke={GREEN} strokeWidth={1} strokeOpacity={0.45}
                />

                <text
                  x={cx} y={cardY - 2}
                  fontSize="6" fill={MUTED} textAnchor="middle" fontWeight="600"
                >
                  {r.signal}
                </text>

                <text
                  x={cx} y={cardY + 7}
                  fontSize="7.5" fill={GREEN} textAnchor="middle" fontWeight="700"
                >
                  Model → {price}
                </text>
              </motion.g>
            );
          })}

        {/* Dynamic label */}
        {beat >= 4 && (
          <motion.text
            x={tx(N - 1) - 2} y={py(DYN[N - 1]) + 14}
            fontSize="7.5" fill={GREEN} fontWeight="600" textAnchor="end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.3 }}
          >
            Model Price
          </motion.text>
        )}

        {/* ── Gap annotations — beat 3, rendered last for z-order ── */}
        {beat === 3 &&
          GAP_LABELS.map((g, idx) => {
            const isOverpriced = idx === 0;
            const cardW = 110;
            const cardH = 26;
            const cardY = isOverpriced ? H - PB - 2 : PT + 2;
            const dotY = isOverpriced ? py(MKT[3]) : py(MKT[13]);
            const midGapY = g.y;

            return (
              <motion.g
                key={`gap-${idx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + idx * 0.4, duration: 0.4 }}
              >
                {/* Bracket line pointing into the gap */}
                <line
                  x1={g.x} y1={cardY}
                  x2={g.x} y2={midGapY}
                  stroke={RED} strokeWidth={1} strokeOpacity={0.5}
                />
                <circle cx={g.x} cy={midGapY} r={2.5} fill={RED} fillOpacity={0.6} />

                {/* Card — positioned at chart edge */}
                <rect
                  x={g.x - cardW / 2} y={cardY - cardH / 2}
                  width={cardW} height={cardH}
                  rx={4}
                  fill="white"
                  stroke={RED} strokeWidth={1} strokeOpacity={0.5}
                />
                <text
                  x={g.x} y={cardY - 2}
                  fontSize="7.5" fill={RED} textAnchor="middle" fontWeight="700"
                >
                  {g.line1}
                </text>
                <text
                  x={g.x} y={cardY + 8}
                  fontSize="6.5" fill={RED} textAnchor="middle" fontWeight="500"
                  opacity={0.7}
                >
                  {g.line2}
                </text>
              </motion.g>
            );
          })}
      </svg>

      {/* Success — beat 5 */}
      <AnimatePresence>
        {beat === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-2 rounded-lg border px-4 py-2"
            style={{ borderColor: GREEN + "30", backgroundColor: GREEN + "08" }}
          >
            <div
              className="flex size-5 items-center justify-center rounded-full"
              style={{ backgroundColor: GREEN + "20" }}
            >
              <svg
                viewBox="0 0 12 12" className="size-3"
                fill="none" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round"
              >
                <polyline points="2.5,6.5 5,9 9.5,3" />
              </svg>
            </div>
            <p className="text-xs font-semibold" style={{ color: GREEN }}>
              Model-driven pricing captures up to 92% of addressable margin
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control bar */}
      <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-1.5">
        <div className="flex items-center gap-1">
          {Array.from({ length: N_BEATS }, (_, i) => (
            <button
              key={i}
              onClick={() => { setBeat(i + 1); setPaused(true); }}
              className="transition-all"
              aria-label={`Go to step ${i + 1}`}
              style={{
                width: beat === i + 1 ? 16 : 6,
                height: 6, borderRadius: 3,
                backgroundColor: beat === i + 1 ? NAVY : "#d4d0cb",
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={goBack}
            className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-muted"
            aria-label="Previous step"
          >
            <svg viewBox="0 0 12 12" className="size-3">
              <polyline points="8,2 4,6 8,10" fill="none" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => setPaused((p) => !p)}
            className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-muted"
            aria-label={paused ? "Play" : "Pause"}
          >
            {paused ? (
              <svg viewBox="0 0 12 12" className="size-3"><polygon points="3,1 10,6 3,11" fill={NAVY} /></svg>
            ) : (
              <svg viewBox="0 0 12 12" className="size-3">
                <rect x="2" y="1.5" width="2.8" height="9" rx="0.5" fill={NAVY} />
                <rect x="7.2" y="1.5" width="2.8" height="9" rx="0.5" fill={NAVY} />
              </svg>
            )}
          </button>
          <button
            onClick={goForward}
            className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-muted"
            aria-label="Next step"
          >
            <svg viewBox="0 0 12 12" className="size-3">
              <polyline points="4,2 8,6 4,10" fill="none" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
