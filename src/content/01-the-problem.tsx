"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PriceDriftHero } from "@/components/visuals/price-drift-hero";

const NAVY = "#00446a";
const RED = "#c62828";
const GREEN = "#2e7d32";
const MUTED = "#7a7570";

/* ── Low depth: Visual hero ── */
export function ProblemLow() {
  return (
    <PriceDriftHero />
  );
}

/* ── Demand-curve geometry (module-level, computed once) ── */

const CL = 50, CT = 40, CW = 500, CH = 220;
const CB = CT + CH;
const SVG_W = CL + CW + 30;
const SVG_H = CB + 24;

function demandY(q: number) {
  return CT + CH * (1 - Math.pow(Math.max(0, 1 - q), 0.6));
}
function qx(q: number) { return CL + q * CW; }
function qAtPrice(p: number) { return 1 - Math.pow(p, 1 / 0.6); }

const CURVE_N = 80;
const CURVE_PTS: string[] = [];
for (let i = 0; i <= CURVE_N; i++) {
  const q = (i / CURVE_N) * 0.97;
  CURVE_PTS.push(`${qx(q)},${demandY(q)}`);
}
const CURVE_PATH = "M" + CURVE_PTS.join(" L");
const CURVE_FILL = `M${CL},${CB} L${CURVE_PTS.join(" L")} L${qx(0.97)},${CB} Z`;

function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface Deal { qn: number; pn: number; label?: string }
const DEALS: Deal[] = [
  { qn: 0.06, pn: 0.91, label: "$182" },
  { qn: 0.25, pn: 0.66, label: "$145" },
  { qn: 0.52, pn: 0.44, label: "$110" },
  { qn: 0.78, pn: 0.18, label: "$72" },
];
for (let i = 0; i < 28; i++) {
  const qn = hash(i * 3 + 10) * 0.88 + 0.04;
  const base = Math.pow(1 - qn, 0.6);
  const noise = (hash(i * 7 + 20) - 0.5) * 0.2;
  DEALS.push({ qn, pn: Math.max(0.06, Math.min(0.96, base + noise)) });
}

const SINGLE_P = 0.48;
const SPY = CT + CH * (1 - SINGLE_P);
const SQX = qx(qAtPrice(SINGLE_P));
const SINGLE_FILL = `M${CL},${CB} L${CL},${SPY} L${SQX},${SPY} L${SQX},${CB} Z`;

const TIER_P = [0.75, 0.55, 0.40, 0.25];
let tierPath = `M${CL},${CB}`;
let prevTQ = 0;
for (const tp of TIER_P) {
  const tq = qAtPrice(tp);
  tierPath += ` L${qx(prevTQ)},${CT + CH * (1 - tp)} L${qx(tq)},${CT + CH * (1 - tp)}`;
  prevTQ = tq;
}
tierPath += ` L${qx(prevTQ)},${CB} Z`;
const TIER_FILL = tierPath;

const ML_PTS: string[] = [];
for (let i = 0; i <= CURVE_N; i++) {
  const q = (i / CURVE_N) * 0.93;
  ML_PTS.push(`${qx(q)},${demandY(q)}`);
}
const ML_FILL = `M${CL},${CB} L${ML_PTS.join(" L")} L${qx(0.93)},${CB} Z`;

function dealCaptured(d: Deal, phase: number): boolean {
  if (phase <= 1) return false;
  if (phase === 2) return d.pn >= SINGLE_P;
  if (phase === 3) return TIER_P.some(t => d.pn >= t);
  return true;
}

const NARRATION = [
  { text: "Every customer is willing to pay a different price.", color: MUTED },
  { text: "This is what they’d pay. This is demand.", color: MUTED },
  { text: "One list price? You lose on both sides of the line.", color: RED },
  { text: "Manual tiers help — but margin still leaks at every step.", color: NAVY },
  { text: "ML prices each deal to its value. 92% captured.", color: GREEN },
];

const NAV_LABELS = ["Customers", "Demand", "List price", "Tiers", "ML price"];

function CaptureAnimation() {
  const [phase, setPhase] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || phase >= NARRATION.length - 1) return;
    const t = setTimeout(() => setPhase(p => p + 1), phase === 0 ? 3000 : 4000);
    return () => clearTimeout(t);
  }, [phase, auto]);

  function goTo(i: number) { setAuto(false); setPhase(i); }

  const captured = DEALS.filter(d => dealCaptured(d, phase)).length;
  const showDots = phase >= 0;
  const showCurve = phase >= 1;
  const showAxes = phase >= 0;

  return (
    <div>
      {/* Narrator caption */}
      <div className="mb-3 min-h-[28px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="text-center text-sm font-medium"
            style={{ color: NARRATION[phase].color }}
          >
            {NARRATION[phase].text}
          </motion.p>
        </AnimatePresence>
      </div>

      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" role="img" aria-label="Demand curve margin capture">
        {/* Axes */}
        {showAxes && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <line x1={CL} y1={CT - 4} x2={CL} y2={CB} stroke="#e5e7eb" />
            <line x1={CL} y1={CB} x2={CL + CW + 4} y2={CB} stroke="#e5e7eb" />
            <text x={CL - 12} y={CT + CH / 2} fontSize="9" fill="#b0ada8" textAnchor="middle"
              transform={`rotate(-90,${CL - 12},${CT + CH / 2})`}>Willingness to Pay</text>
            <text x={CL + CW / 2} y={CB + 16} fontSize="9" fill="#b0ada8" textAnchor="middle">Deals (volume)</text>
          </motion.g>
        )}

        <defs>
          <filter id="badge-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Total possible area — faint, phase 1+ */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.path d={CURVE_FILL} fill="#f8f7f6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }} />
          )}
        </AnimatePresence>

        {/* Phase-specific captured fill */}
        <AnimatePresence mode="wait">
          {phase >= 2 && (
            <motion.path
              key={`fill-${phase}`}
              d={phase === 2 ? SINGLE_FILL : phase === 3 ? TIER_FILL : ML_FILL}
              fill={NARRATION[phase].color} fillOpacity={0.15}
              stroke={NARRATION[phase].color} strokeWidth={1} strokeOpacity={0.3}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>

        {/* Leaked area above list price — phase 2 */}
        <AnimatePresence>
          {phase === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.6, duration: 0.4 }}>
              <path
                d={`M${CL},${SPY} ${CURVE_PTS.filter((_, i) => {
                  const q = (i / CURVE_N) * 0.97;
                  return q <= qAtPrice(SINGLE_P);
                }).join(" L")} L${qx(qAtPrice(SINGLE_P))},${SPY} Z`}
                fill={RED} fillOpacity={0.06}
              />
              <text x={qx(0.12)} y={SPY - 16} fontSize="9" fill={RED} fontWeight="600" opacity={0.6}>margin left on table</text>
              <text x={qx(qAtPrice(SINGLE_P)) + 20} y={CB - 16} fontSize="9" fill={RED} fontWeight="600" opacity={0.6}>deals that walked</text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Price lines per phase */}
        <AnimatePresence>
          {phase === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <motion.line x1={CL} y1={SPY} x2={SQX} y2={SPY}
                stroke={RED} strokeWidth={2.5} strokeDasharray="6 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
              <text x={SQX + 8} y={SPY + 4} fontSize="10" fontWeight="700" fill={RED} opacity={0.7}>your list price</text>
            </motion.g>
          )}
          {phase === 3 && TIER_P.map((tp, i) => (
            <motion.line key={`tier-${i}`}
              x1={CL} y1={CT + CH * (1 - tp)} x2={qx(qAtPrice(tp))} y2={CT + CH * (1 - tp)}
              stroke={NAVY} strokeWidth={1.8} strokeDasharray="4 3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            />
          ))}
          {phase === 4 && (
            <motion.path d={CURVE_PATH} fill="none" stroke={GREEN} strokeWidth="3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </AnimatePresence>

        {/* Faint demand curve — phase 1+ */}
        {showCurve && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <motion.path d={CURVE_PATH} fill="none" stroke="#aaa" strokeWidth="2" strokeDasharray="5 3"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 1.0 }} />
            <motion.text x={qx(0.88)} y={demandY(0.88) - 8} fontSize="10" fontStyle="italic" fill="#999"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}>demand curve</motion.text>
          </motion.g>
        )}

        {/* Deal dots */}
        {showDots && DEALS.map((d, i) => {
          const cx = qx(d.qn);
          const cy = CT + CH * (1 - d.pn);
          const cap = dealCaptured(d, phase);
          const fill = phase <= 1 ? MUTED : cap ? GREEN : "#e57373";
          const op = phase <= 1 ? 0.5 : cap ? 0.85 : 0.2;
          const r = phase <= 1 ? 5 : cap ? 6 : 4;
          return (
            <motion.circle key={i} cx={cx} cy={cy}
              fill={fill}
              stroke={phase <= 1 ? "white" : "none"}
              strokeWidth={phase <= 1 ? 1 : 0}
              initial={{ opacity: 0, r: 0 }}
              animate={{ opacity: op, r }}
              transition={{ duration: 0.4, delay: phase === 0 ? 0.3 + i * 0.04 : 0 }}
            />
          );
        })}

        {/* Price labels on anchor deals (phase 0–1) */}
        <AnimatePresence>
          {phase <= 1 && DEALS.slice(0, 4).map((d, i) => {
            const dx = qx(d.qn);
            const dy = CT + CH * (1 - d.pn);
            return (
              <motion.g key={`price-${i}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ delay: phase === 0 ? 0.6 + i * 0.15 : 0, duration: 0.3 }}>
                <line x1={dx + 6} y1={dy} x2={dx + 16} y2={dy - 6} stroke="#c4c0bb" strokeWidth={0.6} />
                <rect x={dx + 16} y={dy - 17} width={38} height={20} rx={4} fill="white" stroke="#e5e7eb" strokeWidth={0.6} />
                <text x={dx + 35} y={dy - 4} fontSize="11" fontWeight="600" fill="#1a1a1a" textAnchor="middle">{d.label}</text>
              </motion.g>
            );
          })}
        </AnimatePresence>

        {/* Capture percentage badge — phase 2+ */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.g
              key={`pct-${phase}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.35 }}
            >
              <rect x={SVG_W - 126} y={CT} width={115} height={50} rx={8}
                fill="white" stroke={NARRATION[phase].color} strokeWidth={1.5} strokeOpacity={0.5}
                filter="url(#badge-shadow)" />
              <text x={SVG_W - 68} y={CT + 28} fontSize="24" fontWeight="800"
                fill={NARRATION[phase].color} textAnchor="middle" opacity={0.9}>
                {phase === 2 ? "54%" : phase === 3 ? "78%" : "92%"}
              </text>
              <text x={SVG_W - 68} y={CT + 43} fontSize="9" fill={MUTED} textAnchor="middle">
                {captured}/{DEALS.length} deals
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* Nav bar */}
      <div className="mt-2 flex items-center justify-center gap-3">
        <button onClick={() => goTo(Math.max(0, phase - 1))} disabled={phase <= 0}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30">
          <svg viewBox="0 0 16 16" className="size-4"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className="flex items-center gap-2">
          {NAV_LABELS.map((label, i) => (
            <button key={i} onClick={() => goTo(i)} className="flex flex-col items-center gap-1">
              <div className="rounded-full transition-all"
                style={{ width: i === phase ? 20 : 8, height: 8, backgroundColor: i === phase ? NARRATION[i].color : i < phase ? NARRATION[i].color + "60" : "#d1d5db" }} />
              <span className="text-[9px] font-medium transition-opacity"
                style={{ color: i === phase ? NARRATION[i].color : "#9ca3af", opacity: i === phase ? 1 : 0.7 }}>{label}</span>
            </button>
          ))}
        </div>
        <button onClick={() => goTo(Math.min(NARRATION.length - 1, phase + 1))} disabled={phase >= NARRATION.length - 1}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30">
          <svg viewBox="0 0 16 16" className="size-4"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}

/* ── Medium depth: Visual-first narrated animation ── */
export function ProblemMedium() {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <CaptureAnimation />
    </div>
  );
}

/* ── High depth: Interactive leakage calculator ── */

const SLIDER_TRACK = "h-1.5 rounded-full bg-gray-200 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00446a] [&::-webkit-slider-thumb]:shadow-md";

function fmt$(v: number) {
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

function LeakageCalculator() {
  const [revenue, setRevenue] = useState(200);
  const [margin, setMargin] = useState(25);
  const [deviation, setDeviation] = useState(5);

  const revM = revenue * 1e6;
  const grossProfit = revM * (margin / 100);
  const underpricedPct = deviation * 0.6;
  const overpricedPct = deviation * 0.45;
  const underpricedLeak = grossProfit * (underpricedPct / 100);
  const overpricedLeak = grossProfit * (overpricedPct / 100);
  const totalLeak = underpricedLeak + overpricedLeak;
  const captureRate = 0.92;
  const recoverable = totalLeak * captureRate;
  const leakPctOfRev = ((totalLeak / revM) * 100).toFixed(1);

  const underPct = totalLeak > 0 ? (underpricedLeak / totalLeak) * 100 : 50;
  const overPct = 100 - underPct;
  const recoverPct = captureRate * 100;

  return (
    <div className="space-y-5">
      {/* Sliders */}
      <div className="grid grid-cols-3 gap-5">
        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <label className="text-xs font-medium text-muted-foreground">Annual Revenue</label>
            <span className="text-sm font-bold" style={{ color: NAVY }}>{fmt$(revM)}</span>
          </div>
          <input
            type="range" min={50} max={500} step={10} value={revenue}
            onChange={(e) => setRevenue(Number(e.target.value))}
            className={SLIDER_TRACK}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <label className="text-xs font-medium text-muted-foreground">Gross Margin</label>
            <span className="text-sm font-bold" style={{ color: NAVY }}>{margin}%</span>
          </div>
          <input
            type="range" min={10} max={50} step={1} value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className={SLIDER_TRACK}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <label className="text-xs font-medium text-muted-foreground">Avg Price Deviation</label>
            <span className="text-sm font-bold" style={{ color: NAVY }}>{deviation}%</span>
          </div>
          <input
            type="range" min={1} max={12} step={0.5} value={deviation}
            onChange={(e) => setDeviation(Number(e.target.value))}
            className={SLIDER_TRACK}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-[1fr_1fr] gap-5">
        {/* Left: visual breakdown */}
        <div className="space-y-3">
          {/* Gross profit context */}
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium text-muted-foreground">Gross Profit</span>
            <span className="font-bold" style={{ color: NAVY }}>{fmt$(grossProfit)}</span>
          </div>
          <div className="h-2 w-full rounded-full" style={{ backgroundColor: NAVY + "15" }}>
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (totalLeak / grossProfit) * 100 * 8)}%`, backgroundColor: RED + "40" }}
            />
          </div>

          {/* Leakage breakdown bar */}
          <div>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="font-medium" style={{ color: RED }}>Total Leakage</span>
              <span className="font-bold" style={{ color: RED }}>{fmt$(totalLeak)}</span>
            </div>
            <div className="flex h-8 overflow-hidden rounded-lg">
              <div
                className="flex items-center justify-center transition-all duration-300"
                style={{ width: `${underPct}%`, backgroundColor: RED, opacity: 0.75 }}
              >
                <span className="text-[10px] font-semibold text-white">
                  Underpriced {fmt$(underpricedLeak)}
                </span>
              </div>
              <div
                className="flex items-center justify-center transition-all duration-300"
                style={{ width: `${overPct}%`, backgroundColor: "#d84315", opacity: 0.75 }}
              >
                <span className="text-[10px] font-semibold text-white">
                  Overpriced {fmt$(overpricedLeak)}
                </span>
              </div>
            </div>
          </div>

          {/* Recoverable bar */}
          <div>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="font-medium" style={{ color: GREEN }}>Recoverable</span>
              <span className="font-bold" style={{ color: GREEN }}>{fmt$(recoverable)}</span>
            </div>
            <div className="h-8 overflow-hidden rounded-lg" style={{ backgroundColor: GREEN + "12" }}>
              <div
                className="flex h-8 items-center justify-center rounded-lg transition-all duration-300"
                style={{ width: `${recoverPct}%`, backgroundColor: GREEN, opacity: 0.2 }}
              >
                <span className="text-[10px] font-bold" style={{ color: GREEN }}>
                  92% capture rate
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: headline numbers */}
        <div className="flex flex-col gap-3">
          <div className="rounded-lg border px-4 py-3" style={{ borderColor: RED + "30", backgroundColor: RED + "05" }}>
            <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Addressable leakage</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold" style={{ color: RED }}>{fmt$(totalLeak)}</span>
              <span className="text-xs font-medium text-muted-foreground">{leakPctOfRev}% of revenue</span>
            </div>
          </div>
          <div className="rounded-lg border px-4 py-3" style={{ borderColor: GREEN + "30", backgroundColor: GREEN + "05" }}>
            <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Model-recoverable</div>
            <div className="mt-1 text-2xl font-bold" style={{ color: GREEN }}>{fmt$(recoverable)}</div>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Underpriced deals give away margin. Overpriced deals lose volume — compounding over cycles.
            The model closes the gap in both directions.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ProblemHigh() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">Quantify your leakage</h3>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Adjust to your business. See how static pricing bleeds margin — and what a model can recover.
      </p>
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <LeakageCalculator />
      </div>
    </div>
  );
}
