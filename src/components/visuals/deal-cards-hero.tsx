"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAVY = "#00446a";
const ORANGE = "#D97C14";
const GREEN = "#2e7d32";
const RED = "#c62828";
const MUTED = "#7a7570";

interface Deal {
  company: string;
  price: number;
  zone: "leakage" | "market" | "conviction";
  jY: number;
}

const DEALS: Deal[] = [
  { company: "Bayshore",   price: 3.95, zone: "leakage",    jY: -15 },
  { company: "Hartwell",   price: 4.12, zone: "leakage",    jY: 12 },
  { company: "Pacific",    price: 4.38, zone: "leakage",    jY: -4 },
  { company: "Crosspoint", price: 5.60, zone: "market",     jY: 13 },
  { company: "Northern",   price: 5.72, zone: "market",     jY: -10 },
  { company: "Summit",     price: 5.84, zone: "market",     jY: 7 },
  { company: "Ridgeline",  price: 6.18, zone: "conviction", jY: -12 },
  { company: "Apex",       price: 6.41, zone: "conviction", jY: 10 },
];

const MARKET_DEALS = DEALS.filter((d) => d.zone === "market");

const ZONES: Record<
  Deal["zone"],
  { color: string; label: string; lo: number; hi: number }
> = {
  leakage:    { color: RED,   label: "Leakage",         lo: 3.50, hi: 4.75 },
  market:     { color: NAVY,  label: "Market Rate",     lo: 4.75, hi: 6.05 },
  conviction: { color: GREEN, label: "High Conviction", lo: 6.05, hi: 7.00 },
};

const ZONE_KEYS: Deal["zone"][] = ["leakage", "market", "conviction"];

const HEADLINES = [
  "Same product. Wildly different prices.",
  "The model finds the structure.",
  "Leakage — identified.",
  "Here's why this deal priced where it did.",
  "High conviction pricing. Every deal.",
];

const BEAT_MS = 4000;
const N_BEATS = 5;

/* ── Full scatter layout ── */
const W = 460, H = 130;
const PL = 30, PR = 15;
const AX_Y = 108;
const DOT_CY = 62;
const R = 7;
const MIN_P = 3.50, MAX_P = 7.00;

function px(p: number) {
  return PL + ((p - MIN_P) / (MAX_P - MIN_P)) * (W - PL - PR);
}

/* ── Zoomed market-rate layout ── */
const Z_W = 460, Z_H = 165;
const Z_PL = 50, Z_PR = 50;
const Z_DOT_CY = 38;
const Z_AX_Y = 60;
const Z_R = 9;
const Z_MIN = 5.45, Z_MAX = 5.95;

function zpx(p: number) {
  return Z_PL + ((p - Z_MIN) / (Z_MAX - Z_MIN)) * (Z_W - Z_PL - Z_PR);
}

/* ── Waterfall data ── */
const WATERFALL_ITEMS = [
  { label: "Base rate",    value: 4.80,  color: NAVY },
  { label: "Volume",       value: 0.45,  color: GREEN },
  { label: "Region",       value: -0.22, color: ORANGE },
  { label: "Relationship", value: 0.57,  color: GREEN },
];

const HIGHLIGHT_IDX = 4;

export function DealCardsHero() {
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

  const isZoomed = beat === 4;

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

      {/* Main visual — crossfade between scatter and zoomed view */}
      <AnimatePresence mode="wait">
        {isZoomed ? (
          <motion.div
            key="zoomed"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.5 }}
          >
            <ZoomedMarketView />
          </motion.div>
        ) : (
          <motion.div
            key="scatter"
            initial={{ opacity: 0, scale: beat === 5 ? 0.96 : 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.5 }}
          >
            <ScatterView beat={beat} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leakage callout */}
      <AnimatePresence>
        {beat === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.35 }}
            className="rounded-lg border px-4 py-2.5"
            style={{ borderColor: RED + "30", backgroundColor: RED + "08" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex size-7 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: RED + "15" }}
              >
                <svg viewBox="0 0 16 16" className="size-3.5">
                  <path
                    d="M8 1l7 14H1L8 1zm0 4v4m0 2v1"
                    stroke={RED}
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: RED }}>
                  3 deals below market rate
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Est. recoverable margin:{" "}
                  <span className="font-bold" style={{ color: RED }}>
                    $18,400
                  </span>{" "}
                  annualized
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conviction banner */}
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
                viewBox="0 0 12 12"
                className="size-3"
                fill="none"
                stroke={GREEN}
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <polyline points="2.5,6.5 5,9 9.5,3" />
              </svg>
            </div>
            <p className="text-xs font-semibold" style={{ color: GREEN }}>
              Every deal priced with conviction — backed by data, not gut
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
              onClick={() => {
                setBeat(i + 1);
                setPaused(true);
              }}
              className="transition-all"
              aria-label={`Go to step ${i + 1}`}
              style={{
                width: beat === i + 1 ? 16 : 6,
                height: 6,
                borderRadius: 3,
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
              <polyline
                points="8,2 4,6 8,10"
                fill="none"
                stroke={MUTED}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => setPaused((p) => !p)}
            className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-muted"
            aria-label={paused ? "Play" : "Pause"}
          >
            {paused ? (
              <svg viewBox="0 0 12 12" className="size-3">
                <polygon points="3,1 10,6 3,11" fill={NAVY} />
              </svg>
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
              <polyline
                points="4,2 8,6 4,10"
                fill="none"
                stroke={MUTED}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Scatter view — beats 1-3 and 5
   ════════════════════════════════════════════ */

function ScatterView({ beat }: { beat: number }) {
  const showZones = beat >= 2;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Deal prices scattered along a price axis"
    >
      {showZones &&
        ZONE_KEYS.map((z) => {
          const { color, label, lo, hi } = ZONES[z];
          const x1 = px(lo),
            x2 = px(hi);
          return (
            <motion.g
              key={z}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <rect
                x={x1}
                y={18}
                width={x2 - x1}
                height={AX_Y - 18}
                fill={color}
                fillOpacity={0.06}
                rx={3}
              />
              <text
                x={(x1 + x2) / 2}
                y={30}
                fontSize="7.5"
                fill={color}
                textAnchor="middle"
                fontWeight="600"
                opacity={0.6}
              >
                {label}
              </text>
            </motion.g>
          );
        })}

      <line x1={PL} y1={AX_Y} x2={W - PR} y2={AX_Y} stroke="#ddd" strokeWidth={0.8} />

      {[4, 4.5, 5, 5.5, 6, 6.5].map((p) => (
        <g key={p}>
          <line x1={px(p)} y1={AX_Y} x2={px(p)} y2={AX_Y + 4} stroke="#ccc" strokeWidth={0.7} />
          <text x={px(p)} y={AX_Y + 14} fontSize="7" fill={MUTED} textAnchor="middle">
            ${p.toFixed(2)}
          </text>
        </g>
      ))}

      {beat >= 1 &&
        DEALS.map((d, i) => {
          const cx = px(d.price);
          const cy = DOT_CY + d.jY;
          const color = showZones ? ZONES[d.zone].color : MUTED;
          const pulse = beat === 3 && d.zone === "leakage";
          const glow = beat === 5 && d.zone === "conviction";

          return (
            <motion.g
              key={d.company}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              {pulse && (
                <motion.circle
                  cx={cx}
                  cy={cy}
                  fill="none"
                  stroke={RED}
                  strokeWidth={1.2}
                  initial={{ r: R + 2, opacity: 0 }}
                  animate={{
                    r: [R + 2, R + 12, R + 16],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              {glow && (
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={R + 4}
                  fill="none"
                  stroke={GREEN}
                  strokeWidth={1.5}
                  animate={{ opacity: [0.15, 0.45, 0.15] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              )}
              <circle cx={cx} cy={cy} r={R} fill={color} fillOpacity={0.85} />
              <text
                x={cx}
                y={cy - R - 4}
                fontSize="7.5"
                fill={color}
                textAnchor="middle"
                fontWeight="600"
              >
                ${d.price.toFixed(2)}
              </text>
              {beat === 1 && (
                <text
                  x={cx}
                  y={cy + R + 10}
                  fontSize="6.5"
                  fill={MUTED}
                  textAnchor="middle"
                  opacity={0.6}
                >
                  {d.company}
                </text>
              )}
            </motion.g>
          );
        })}
    </svg>
  );
}

/* ════════════════════════════════════════════
   Zoomed market-rate view — beat 4 only
   ════════════════════════════════════════════ */

function ZoomedMarketView() {
  const wfBaseY = Z_H - 12;
  const wfMaxV = 7;
  const wfSc = (wfBaseY - 80) / wfMaxV;
  const barW = 58;

  let running = 0;
  const bars: {
    label: string;
    value: number;
    cumulative: number;
    color: string;
    isTotal: boolean;
  }[] = [];
  for (const w of WATERFALL_ITEMS) {
    bars.push({ ...w, cumulative: running, isTotal: false });
    running += w.value;
  }
  bars.push({ label: "I2P Target", value: running, cumulative: 0, color: NAVY, isTotal: true });

  const nBars = bars.length;
  const wfGap = (Z_W - barW * nBars) / (nBars + 1);

  return (
    <svg
      viewBox={`0 0 ${Z_W} ${Z_H}`}
      className="w-full"
      role="img"
      aria-label="Zoomed view of market-rate deals with price driver waterfall"
    >
      {/* Zone background */}
      <rect x={0} y={0} width={Z_W} height={Z_H} fill={NAVY} fillOpacity={0.03} rx={4} />

      {/* Zone label */}
      <text x={Z_W / 2} y={14} fontSize="8" fill={NAVY} textAnchor="middle" fontWeight="600" opacity={0.5}>
        Market Rate
      </text>

      {/* Dots */}
      {MARKET_DEALS.map((d, i) => {
        const cx = zpx(d.price);
        const cy = Z_DOT_CY + d.jY * 0.6;
        const isHighlight = d.company === "Northern";

        return (
          <motion.g
            key={d.company}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            {isHighlight && (
              <motion.circle
                cx={cx}
                cy={cy}
                r={Z_R + 6}
                fill={NAVY}
                fillOpacity={0.06}
                stroke={NAVY}
                strokeWidth={1.5}
                strokeOpacity={0.2}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
            )}
            <circle cx={cx} cy={cy} r={Z_R} fill={NAVY} fillOpacity={isHighlight ? 0.9 : 0.5} />
            <text
              x={cx}
              y={cy - Z_R - 4}
              fontSize="9"
              fill={NAVY}
              textAnchor="middle"
              fontWeight="600"
            >
              ${d.price.toFixed(2)}
            </text>
            <text
              x={cx}
              y={cy + Z_R + 11}
              fontSize="7.5"
              fill={NAVY}
              textAnchor="middle"
              fontWeight={isHighlight ? 600 : 400}
              opacity={isHighlight ? 1 : 0.5}
            >
              {d.company}
            </text>
          </motion.g>
        );
      })}

      {/* Mini axis */}
      <line x1={Z_PL - 10} y1={Z_AX_Y} x2={Z_W - Z_PR + 10} y2={Z_AX_Y} stroke={NAVY} strokeWidth={0.5} strokeOpacity={0.15} />

      {/* Divider label */}
      <text x={Z_W / 2} y={74} fontSize="7.5" fill={NAVY} textAnchor="middle" fontWeight="600" opacity={0.7}>
        Northern Alloys — Price Drivers
      </text>

      {/* Waterfall baseline */}
      <line x1={wfGap} y1={wfBaseY} x2={Z_W - wfGap} y2={wfBaseY} stroke="#e0e0e0" strokeWidth={0.5} />

      {/* Waterfall bars */}
      {bars.map((bar, i) => {
        const x = wfGap + i * (barW + wfGap);
        let bH: number, bY: number;
        if (bar.isTotal) {
          bH = bar.value * wfSc;
          bY = wfBaseY - bH;
        } else {
          bH = Math.abs(bar.value) * wfSc;
          bY = bar.value >= 0
            ? wfBaseY - bar.cumulative * wfSc - bH
            : wfBaseY - bar.cumulative * wfSc;
        }
        return (
          <motion.g
            key={bar.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.3 + i * 0.1 }}
          >
            <rect
              x={x}
              y={bY}
              width={barW}
              height={bH}
              rx={2}
              fill={bar.color}
              fillOpacity={bar.isTotal ? 0.85 : 0.6}
            />
            <text
              x={x + barW / 2}
              y={bY - 3}
              fontSize="8"
              fontWeight="600"
              fill={bar.color}
              textAnchor="middle"
            >
              {bar.isTotal
                ? `$${bar.value.toFixed(2)}`
                : `${bar.value >= 0 ? "+" : "−"}$${Math.abs(bar.value).toFixed(2)}`}
            </text>
            <text
              x={x + barW / 2}
              y={wfBaseY + 10}
              fontSize="7"
              fill={MUTED}
              textAnchor="middle"
            >
              {bar.label}
            </text>
            {!bar.isTotal && i < bars.length - 1 && (
              <line
                x1={x + barW}
                y1={bar.value >= 0 ? bY : bY + bH}
                x2={x + barW + wfGap}
                y2={bar.value >= 0 ? bY : bY + bH}
                stroke="#d4d0cb"
                strokeWidth={0.5}
                strokeDasharray="2 1"
              />
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}
