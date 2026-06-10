"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BLUE, NAVY } from "./hub-spoke-diagram";

const AI_ORANGE = "#E56910";
const LIGHT_BLUE = "#D6EAF5";
const LIGHT_ORANGE = "#FDEBD6";

const stagger = (i: number, base = 0.15) => ({ delay: i * base });
const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

/* ─── Timeline constants ─── */

const MONTHS = 18;
const BAR_LEFT = 110;
const BAR_RIGHT = 720;
const barWidth = BAR_RIGHT - BAR_LEFT;

function monthX(m: number) {
  return BAR_LEFT + (m / MONTHS) * barWidth;
}

/* ─── Step 0: Traditional engagement timeline ─── */

function EngagementToday() {
  const trad = [
    { label: "data", start: 0, end: 5, color: NAVY, textColor: "white" },
    { label: "modeling", start: 5, end: 10, color: BLUE, textColor: "white" },
    { label: "implementation", start: 10, end: 15, color: LIGHT_BLUE, textColor: NAVY },
  ];
  const goLive = 15;
  const glX = monthX(goLive);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="rounded-2xl border bg-white px-4 py-5 shadow-sm">
        <svg viewBox="0 0 760 140" className="w-full">
          <MonthTicks />

          {/* Traditional row */}
          <text x="10" y="72" fontSize="13" fontWeight="700" fill="#1a1a1a">Traditional</text>
          {trad.map((p, i) => (
            <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ...stagger(i, 0.3) }}>
              <rect x={monthX(p.start)} y="55" width={monthX(p.end) - monthX(p.start) - 2} height="32" rx="6" fill={p.color} />
              <text x={(monthX(p.start) + monthX(p.end)) / 2} y="76" fontSize="11" fontWeight="600" fontStyle="italic" fill={p.textColor} textAnchor="middle">{p.label}</text>
            </motion.g>
          ))}

          {/* Go-Live marker */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0, duration: 0.4 }}>
            <line x1={glX} y1="45" x2={glX} y2="95" stroke={NAVY} strokeWidth="2.5" strokeDasharray="4 3" />
          </motion.g>
          <motion.g
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.4 }}
          >
            <rect x={glX - 55} y="100" width="110" height="26" rx="13" fill={NAVY} />
            <text x={glX} y="117" fontSize="11" fontWeight="700" fill="white" textAnchor="middle">
              Go-live · Month 15
            </text>
          </motion.g>
        </svg>
      </div>
    </div>
  );
}

/* ─── Step 1: Both timelines with go-live contrast ─── */

function EngagementWithAi() {
  const trad = [
    { label: "data", start: 0, end: 5, color: NAVY, textColor: "white" },
    { label: "modeling", start: 5, end: 10, color: BLUE, textColor: "white" },
    { label: "implementation", start: 10, end: 15, color: LIGHT_BLUE, textColor: NAVY },
  ];

  const tradGoLive = 15;
  const futureGoLive = 5;

  const future = [
    { label: "data + modeling + impl.", start: 0, end: 5, color: AI_ORANGE, textColor: "white", dashed: false },
    { label: "Train agent & model", start: 5, end: 10, color: LIGHT_ORANGE, textColor: AI_ORANGE, dashed: false },
    { label: "Iterate", start: 10, end: 13, color: "transparent", textColor: AI_ORANGE, dashed: true },
    { label: "Iterate", start: 13, end: 16, color: "transparent", textColor: AI_ORANGE, dashed: true },
  ];

  const tradMid = (i: number) => (monthX(trad[i].start) + monthX(trad[i].end)) / 2;
  const futureMid = (monthX(0) + monthX(5)) / 2;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="rounded-2xl border bg-white px-4 py-5 shadow-sm">
        <svg viewBox="0 0 760 270" className="w-full">
          <MonthTicks />

          {/* Traditional row */}
          <text x="10" y="72" fontSize="13" fontWeight="700" fill="#1a1a1a" opacity="0.5">Traditional</text>
          {trad.map((p, i) => (
            <g key={i} opacity="0.4">
              <rect x={monthX(p.start)} y="55" width={monthX(p.end) - monthX(p.start) - 2} height="32" rx="6" fill={p.color} />
              <text x={(monthX(p.start) + monthX(p.end)) / 2} y="76" fontSize="11" fontWeight="600" fontStyle="italic" fill={p.textColor} textAnchor="middle">{p.label}</text>
            </g>
          ))}

          {/* Traditional go-live */}
          <g opacity="0.4">
            <line x1={monthX(tradGoLive)} y1="48" x2={monthX(tradGoLive)} y2="92" stroke={NAVY} strokeWidth="2" strokeDasharray="4 3" />
          </g>
          <rect x={monthX(tradGoLive) - 40} y="95" width="80" height="22" rx="11" fill={NAVY} opacity="0.4" />
          <text x={monthX(tradGoLive)} y="110" fontSize="10" fontWeight="700" fill="white" textAnchor="middle" opacity="0.6">Month 15</text>

          {/* Transformation arrows — each trad phase converges into the compressed AI block */}
          {trad.map((_, i) => (
            <motion.path
              key={`arrow-${i}`}
              d={`M${tradMid(i)},90 C${tradMid(i)},115 ${futureMid},135 ${futureMid},155`}
              fill="none"
              stroke={AI_ORANGE}
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
            />
          ))}

          {/* "All 3 compress" label */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <text x={futureMid + 60} y="130" fontSize="9" fontWeight="600" fill={AI_ORANGE} textAnchor="start">
              All three phases compress
            </text>
          </motion.g>

          {/* Future row */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <text x="10" y="172" fontSize="13" fontWeight="700" fill={AI_ORANGE}>With AI</text>
            {future.map((p, i) => {
              const bx = monthX(p.start);
              const bw = monthX(p.end) - monthX(p.start) - 2;
              const cx = bx + bw / 2;
              return (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.6 + i * 0.15 }}>
                  <rect
                    x={bx} y="155" width={bw} height="32" rx="6"
                    fill={p.dashed ? "transparent" : p.color}
                    stroke={p.dashed ? AI_ORANGE : "none"}
                    strokeWidth={p.dashed ? 2 : 0}
                    strokeDasharray={p.dashed ? "6 4" : undefined}
                  />
                  <text x={cx} y="175" fontSize="10" fontWeight="600" fill={p.textColor} textAnchor="middle">{p.label}</text>
                </motion.g>
              );
            })}
          </motion.g>

          {/* Future go-live markers */}
          <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.4 }}>
            <line x1={monthX(futureGoLive)} y1="150" x2={monthX(futureGoLive)} y2="195" stroke={AI_ORANGE} strokeWidth="2.5" strokeDasharray="4 3" />
            <rect x={monthX(futureGoLive) - 42} y="198" width="84" height="22" rx="11" fill={AI_ORANGE} />
            <text x={monthX(futureGoLive)} y="213" fontSize="10" fontWeight="700" fill="white" textAnchor="middle">v1 · Month 5</text>
          </motion.g>
          <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.4 }}>
            <line x1={monthX(13)} y1="190" x2={monthX(13)} y2="198" stroke={AI_ORANGE} strokeWidth="1.5" />
            <text x={monthX(13)} y="210" fontSize="9" fontWeight="600" fontStyle="italic" fill={AI_ORANGE} textAnchor="middle">v2</text>
          </motion.g>
          <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.4 }}>
            <line x1={monthX(16)} y1="190" x2={monthX(16)} y2="198" stroke={AI_ORANGE} strokeWidth="1.5" />
            <text x={monthX(16)} y="210" fontSize="9" fontWeight="600" fontStyle="italic" fill={AI_ORANGE} textAnchor="middle">v3</text>
          </motion.g>

          {/* Time saved callout — big, centered */}
          <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5, duration: 0.4 }}>
            <rect x={monthX(futureGoLive) + 10} y="230" width="180" height="28" rx="14" fill={AI_ORANGE} />
            <text x={monthX(futureGoLive) + 100} y="248" fontSize="12" fontWeight="800" fill="white" textAnchor="middle">
              First go-live 10mo sooner
            </text>
          </motion.g>
        </svg>
      </div>
    </div>
  );
}

/* ─── SVG helpers ─── */

function MonthTicks() {
  return (
    <g>
      {Array.from({ length: Math.floor(MONTHS / 2) + 1 }, (_, i) => {
        const m = i * 2;
        const x = monthX(m);
        return (
          <g key={i}>
            <line x1={x} y1="25" x2={x} y2="30" stroke="#d1d5db" strokeWidth="1" />
            <text x={x} y="20" fontSize="10" fill="#9ca3af" textAnchor="middle">{m}</text>
          </g>
        );
      })}
      <line x1={BAR_LEFT} y1="30" x2={BAR_RIGHT} y2="30" stroke="#e5e7eb" strokeWidth="1" />
    </g>
  );
}

function GoLiveFlag({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <text x={x} y={y} fontSize="10" fontWeight="600" fontStyle="italic" fill={color} textAnchor="middle">{label}</text>
  );
}

/* ─── Step 2: Model lifecycle (traditional) ─── */

const MODEL_PHASES = [
  { label: "Data Collection", duration: "3 mo", color: BLUE },
  { label: "Feature Engineering", duration: "2 mo", color: NAVY },
  { label: "Training", duration: "2 mo", color: "#E56910" },
  { label: "Deployment", duration: "2 mo", color: "#22c55e" },
  { label: "Wait for Outcomes", duration: "4 mo", color: "#6b7280" },
  { label: "Retrain", duration: "2 mo", color: NAVY },
];

function ModelLifecycle() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            One Model Iteration Cycle
          </h3>
          <motion.span
            {...fadeUp}
            transition={{ delay: 1.2 }}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-muted-foreground"
          >
            ~15 months total
          </motion.span>
        </div>

        <div className="mt-5 flex gap-2">
          {MODEL_PHASES.map((p, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ duration: 0.4, ...stagger(i, 0.15) }}
              className="flex flex-1 flex-col items-center"
            >
              <div
                className="flex h-16 w-full items-center justify-center rounded-xl border-2 px-1 text-center text-[11px] font-semibold text-white"
                style={{ backgroundColor: p.color, borderColor: p.color }}
              >
                {p.label}
              </div>
              <span className="mt-1.5 text-[10px] text-muted-foreground">{p.duration}</span>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp} transition={{ delay: 1.0 }} className="mt-4 flex justify-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <svg viewBox="0 0 20 12" className="h-3 w-5">
              <path d="M2,6 L16,6 M12,2 L16,6 L12,10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Sequential — each phase waits for the last
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Step 3: AI-accelerated model lifecycle ─── */

const AI_PHASES = [
  { label: "Auto-Ingestion", duration: "1 mo" },
  { label: "Automated Discovery", duration: "2 wk" },
  { label: "Continuous Training", duration: "1 mo" },
  { label: "Real-Time Deploy", duration: "1 wk" },
  { label: "Streaming Outcomes", duration: "1 mo" },
  { label: "Auto-Retrain", duration: "Continuous" },
];

function AiModelLifecycle() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Model Iteration — Traditional vs AI
          </h3>
        </div>

        {/* Traditional — faded */}
        <div className="mt-4 flex gap-2 opacity-30">
          {MODEL_PHASES.map((p, i) => (
            <div key={i} className="flex flex-1 flex-col items-center">
              <div
                className="flex h-12 w-full items-center justify-center rounded-lg border px-1 text-center text-[10px] font-medium"
                style={{ borderColor: p.color + "60", color: p.color }}
              >
                {p.label}
              </div>
              <span className="mt-1 text-[9px] text-muted-foreground">{p.duration}</span>
            </div>
          ))}
        </div>

        <div className="my-2 flex items-center gap-2 px-2">
          <div className="h-px flex-1 bg-border" />
          <motion.span
            {...fadeUp}
            transition={{ delay: 0.3 }}
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: AI_ORANGE }}
          >
            With AI
          </motion.span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* AI — highlighted */}
        <div className="flex gap-2">
          {AI_PHASES.map((p, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ duration: 0.4, ...stagger(i, 0.12) }}
              className="flex flex-1 flex-col items-center"
            >
              <div
                className="flex h-14 w-full items-center justify-center rounded-xl border-2 px-1 text-center text-[11px] font-semibold"
                style={{ borderColor: AI_ORANGE, backgroundColor: AI_ORANGE + "12", color: AI_ORANGE }}
              >
                {p.label}
              </div>
              <span className="mt-1.5 text-[10px] font-medium" style={{ color: AI_ORANGE }}>{p.duration}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <motion.div {...fadeUp} transition={{ delay: 0.8 }} className="flex items-center gap-2">
            <span className="text-sm font-bold line-through" style={{ color: NAVY }}>15 months</span>
            <svg viewBox="0 0 20 12" className="h-3 w-5 text-muted-foreground">
              <path d="M2,6 L16,6 M12,2 L16,6 L12,10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="text-sm font-bold" style={{ color: AI_ORANGE }}>~4 months</span>
          </motion.div>
          <motion.span
            {...fadeUp}
            transition={{ delay: 1.0 }}
            className="rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: AI_ORANGE }}
          >
            3.5× faster
          </motion.span>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 4: Payoff — model metrics + business ROI ─── */

function PayoffCards() {
  const modelMetrics = [
    { label: "Time to First Model", before: "15 mo", after: "4 mo" },
    { label: "Iteration Cycles in Year 1", before: "1", after: "3" },
    { label: "Model Accuracy at Month 15", before: "82%", after: "91%" },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {modelMetrics.map((m, i) => (
          <motion.div
            key={i}
            {...fadeUp}
            transition={{ duration: 0.4, ...stagger(i, 0.15) }}
            className="rounded-xl border bg-white p-4 text-center shadow-sm"
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{m.label}</p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="text-lg font-bold text-muted-foreground/50 line-through">{m.before}</span>
              <svg viewBox="0 0 16 10" className="h-2.5 w-4 text-muted-foreground">
                <path d="M1,5 L13,5 M10,2 L13,5 L10,8" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span className="text-lg font-bold" style={{ color: AI_ORANGE }}>{m.after}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div {...fadeUp} transition={{ delay: 0.6 }} className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider" style={{ color: AI_ORANGE }}>
          Better Model → Better Prices → Better ROI
        </h3>
        <div className="flex gap-4">
          <div className="flex-1 rounded-xl border-2 p-4" style={{ borderColor: NAVY }}>
            <p className="text-xs font-medium text-muted-foreground">Traditional</p>
            <p className="mt-1 text-3xl font-extrabold" style={{ color: NAVY }}>
              8× <span className="text-sm font-semibold text-muted-foreground">ROI</span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">Month 15</p>
          </div>
          <div className="flex-1 rounded-xl border-2 p-4" style={{ borderColor: AI_ORANGE }}>
            <p className="text-xs font-medium" style={{ color: AI_ORANGE }}>Future</p>
            <p className="mt-1 text-3xl font-extrabold" style={{ color: AI_ORANGE }}>
              10× <span className="text-sm font-semibold text-muted-foreground">ROI</span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">Month 15</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main component ─── */

const STEP_COMPONENTS = [
  EngagementToday,
  EngagementWithAi,
  ModelLifecycle,
  AiModelLifecycle,
  PayoffCards,
];

export function AiAccelerationViz({ step }: { step: number }) {
  const StepComponent = STEP_COMPONENTS[step] ?? STEP_COMPONENTS[0];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <StepComponent />
      </motion.div>
    </AnimatePresence>
  );
}
