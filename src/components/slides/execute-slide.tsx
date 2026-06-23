"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const TEAL = "#21A5D5";
const PURPLE = "#7B5EA7";
const GREY = "#B8BFC6";

export const EXECUTE_TOTAL_STEPS = 2;

/* ── Layout ──────────────────────────────────────────── */

const SVG_W = 960;
const SVG_H = 380;

const BOX_H = 200;

const MODEL_W = 230;
const MODEL_X = 365;
const MODEL_Y = 25;
const MODEL_CX = MODEL_X + MODEL_W / 2;
const MODEL_CY = MODEL_Y + BOX_H / 2;

const PROFILE_W = 260;
const PROFILE_X = 18;

const RESULT_CARD_W = 220;
const RESULT_CARD_X = MODEL_X + MODEL_W + 70;

/* ── Product ─────────────────────────────────────────── */

const PRODUCT_NAME = "Precision Bearing SKU #A-7200";
const LIST_PRICE = "$17.50";

/* ── Customer scenarios ──────────────────────────────── */

interface SliderAttribute {
  label: string;
  value: number;
}

interface CustomerScenario {
  label: string;
  segment: string;
  sliders: SliderAttribute[];
  color: string;
  price: string;
  delta: string;
  winProb: string;
  margin: string;
  narrative: string;
}

const CUSTOMERS: CustomerScenario[] = [
  {
    label: "Acme Industrial",
    segment: "High volume · loyal",
    sliders: [
      { label: "Order volume", value: 0.82 },
      { label: "Product specificity", value: 0.88 },
      { label: "Price sensitivity", value: 0.30 },
      { label: "Relationship depth", value: 0.90 },
    ],
    color: NAVY,
    price: "$19.24",
    delta: "+$1.74 above list",
    winProb: "68%",
    margin: "+9.9%",
    narrative: "Same product, but now the model layers in the customer — volume commitment, relationship depth, and win history push the price above list.",
  },
  {
    label: "MedSupply Co",
    segment: "Price-sensitive · contested",
    sliders: [
      { label: "Order volume", value: 0.45 },
      { label: "Product specificity", value: 0.20 },
      { label: "Price sensitivity", value: 0.75 },
      { label: "Relationship depth", value: 0.40 },
    ],
    color: TEAL,
    price: "$14.89",
    delta: "−$2.61 below list",
    winProb: "74%",
    margin: "+3.2%",
    narrative: "Different customer, different answer — high price sensitivity and competitive pressure pull the price below list to protect win rate.",
  },
  {
    label: "QuickParts LLC",
    segment: "Niche need · captive",
    sliders: [
      { label: "Order volume", value: 0.22 },
      { label: "Product specificity", value: 0.55 },
      { label: "Price sensitivity", value: 0.85 },
      { label: "Relationship depth", value: 0.15 },
    ],
    color: ORANGE,
    price: "$22.10",
    delta: "+$4.60 above list",
    winProb: "81%",
    margin: "+5.7%",
    narrative: "Same bearing, highest price — this buyer's niche application has few alternatives, so willingness to pay is the strongest of the three.",
  },
];

/* ── Bezier helpers ──────────────────────────────────── */

function sampleCubicBezier(
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

function FlowDot({
  path,
  color,
  delay,
}: {
  path: { sx: number; sy: number; cp1x: number; cp1y: number; cp2x: number; cp2y: number; ex: number; ey: number };
  color: string;
  delay: number;
}) {
  const { cxArr, cyArr } = sampleCubicBezier(
    path.sx, path.sy, path.cp1x, path.cp1y, path.cp2x, path.cp2y, path.ex, path.ey, 50,
  );

  return (
    <motion.circle
      r={4}
      fill={color}
      initial={{ opacity: 0 }}
      animate={{
        cx: cxArr,
        cy: cyArr,
        opacity: [0, 0.7, 0.7, 0.7, 0],
      }}
      transition={{ duration: 2, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ── Profile card with sliders (SVG) ─────────────────── */

function ProfileCard({ cust }: { cust: CustomerScenario }) {
  const y = MODEL_CY - BOX_H / 2;
  const cx = PROFILE_X + PROFILE_W / 2;
  const SLIDER_X = PROFILE_X + 16;
  const SLIDER_W = PROFILE_W - 32;

  return (
    <motion.g
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <rect
        x={PROFILE_X} y={y} width={PROFILE_W} height={BOX_H}
        rx={14} fill="white" stroke={cust.color} strokeWidth={1.5}
      />
      <rect x={PROFILE_X} y={y} width={PROFILE_W} height={34} rx={14} fill={cust.color} />
      <rect x={PROFILE_X} y={y + 20} width={PROFILE_W} height={14} fill={cust.color} />
      <text x={cx} y={y + 16} fontSize="13" fontWeight="700" fill="white" textAnchor="middle">
        {cust.label}
      </text>
      <text x={cx} y={y + 28} fontSize="9" fontWeight="500" fill="rgba(255,255,255,0.7)" textAnchor="middle">
        {cust.segment}
      </text>

      {cust.sliders.map((s, si) => {
        const sy = y + 52 + si * 38;
        return (
          <g key={s.label}>
            <text x={SLIDER_X} y={sy} fontSize="9.5" fontWeight="600" fill="#4A5568">
              {s.label}
            </text>
            <rect x={SLIDER_X} y={sy + 6} width={SLIDER_W} height={6} rx={3} fill="#E8ECF0" />
            <motion.rect
              x={SLIDER_X} y={sy + 6} height={6} rx={3} fill={cust.color}
              initial={{ width: 0 }}
              animate={{ width: SLIDER_W * s.value }}
              transition={{ duration: 0.6, delay: 0.15 + si * 0.08, ease: "easeOut" }}
            />
            <motion.circle
              cy={sy + 9} r={5} fill="white" stroke={cust.color} strokeWidth={2}
              initial={{ cx: SLIDER_X }}
              animate={{ cx: SLIDER_X + SLIDER_W * s.value }}
              transition={{ duration: 0.6, delay: 0.15 + si * 0.08, ease: "easeOut" }}
            />
          </g>
        );
      })}
    </motion.g>
  );
}

/* ── Result card ─────────────────────────────────────── */

function ResultCard({ cust }: { cust: CustomerScenario }) {
  const y = MODEL_CY - BOX_H / 2;
  const cx = RESULT_CARD_X + RESULT_CARD_W / 2;
  return (
    <motion.g
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
    >
      <rect
        x={RESULT_CARD_X} y={y} width={RESULT_CARD_W} height={BOX_H}
        rx={14} fill="white" stroke={PURPLE} strokeWidth={1.5}
      />
      <text x={cx} y={y + 24} fontSize="8.5" fontWeight="700" fill="#4A5568" textAnchor="middle" letterSpacing="0.1em">
        RECOMMENDED PRICE
      </text>
      <motion.text
        x={cx} y={y + 68} fontSize="34" fontWeight="800" fill={cust.color} textAnchor="middle"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.35, type: "spring", stiffness: 200 }}
      >
        {cust.price}
      </motion.text>
      <motion.text
        x={cx} y={y + 90} fontSize="11" fontWeight="600" textAnchor="middle"
        fill={cust.price > LIST_PRICE ? "#2e7d32" : "#c62828"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {cust.delta}
      </motion.text>

      <line x1={RESULT_CARD_X + 20} y1={y + 106} x2={RESULT_CARD_X + RESULT_CARD_W - 20} y2={y + 106} stroke="#E8ECF0" strokeWidth={1} />

      <text x={RESULT_CARD_X + 24} y={y + 130} fontSize="10" fill="#4A5568">
        Win probability
      </text>
      <text x={RESULT_CARD_X + RESULT_CARD_W - 24} y={y + 130} fontSize="12" fontWeight="700" fill={cust.color} textAnchor="end">
        {cust.winProb}
      </text>

      <text x={RESULT_CARD_X + 24} y={y + 154} fontSize="10" fill="#4A5568">
        Margin impact
      </text>
      <text x={RESULT_CARD_X + RESULT_CARD_W - 24} y={y + 154} fontSize="12" fontWeight="700" fill={cust.color} textAnchor="end">
        {cust.margin}
      </text>

      {/* List price reference */}
      <line x1={RESULT_CARD_X + 20} y1={y + 168} x2={RESULT_CARD_X + RESULT_CARD_W - 20} y2={y + 168} stroke="#E8ECF0" strokeWidth={1} />
      <text x={cx} y={y + 186} fontSize="9" fill={GREY} textAnchor="middle">
        List: {LIST_PRICE} / unit
      </text>
    </motion.g>
  );
}

/* ── Hero product display (step 0) ───────────────────── */

function ProductHero() {
  const cx = SVG_W / 2;
  const cy = SVG_H / 2 - 20;

  const EXIT_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];

  return (
    <motion.g>
      {/* Card background — contracts toward model box on exit */}
      <motion.rect
        x={cx - 180} y={cy - 80} width={360} height={160}
        rx={20} fill="white" stroke={NAVY} strokeWidth={2}
        variants={{
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
          exit: { opacity: 0, scale: 0.45, y: MODEL_CY - cy, transition: { duration: 0.55, ease: EXIT_EASE } },
        }}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Product name — fades quickly on exit */}
      <motion.g
        variants={{
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.4 } },
          exit: { opacity: 0, transition: { duration: 0.15 } },
        }}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <rect x={cx - 90} y={cy - 72} width={180} height={22} rx={11} fill={`${NAVY}0D`} />
        <text x={cx} y={cy - 57} fontSize="10" fontWeight="600" fill={NAVY} textAnchor="middle" letterSpacing="0.08em">
          {PRODUCT_NAME}
        </text>
      </motion.g>

      {/* Price — flies up to model center and shrinks on exit */}
      <motion.text
        x={cx} y={cy + 10} fontSize="52" fontWeight="800" fill={NAVY} textAnchor="middle"
        variants={{
          initial: { opacity: 0, scale: 0.7 },
          animate: { opacity: 1, scale: 1, transition: { delay: 0.4, duration: 0.5, type: "spring", stiffness: 150, damping: 15 } },
          exit: {
            y: MODEL_CY - (cy + 10),
            scale: 0.18,
            opacity: 0,
            transition: { duration: 0.65, ease: EXIT_EASE },
          },
        }}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ transformOrigin: `${cx}px ${cy + 10}px` }}
      >
        {LIST_PRICE}
      </motion.text>

      <motion.text
        x={cx} y={cy + 32} fontSize="13" fontWeight="500" fill={GREY} textAnchor="middle"
        variants={{
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { delay: 0.7 } },
          exit: { opacity: 0, transition: { duration: 0.12 } },
        }}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        current list price
      </motion.text>

      <motion.text
        x={cx} y={cy + 52} fontSize="11" fill={GREY} textAnchor="middle"
        variants={{
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { delay: 0.8 } },
          exit: { opacity: 0, transition: { duration: 0.12 } },
        }}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        per unit
      </motion.text>
    </motion.g>
  );
}

/* ── Main slide ──────────────────────────────────────── */

export function ExecuteSlide({
  step,
}: {
  step: number;
  onAnimationDone?: () => void;
}) {
  const [selected, setSelected] = useState(0);
  const cust = CUSTOMERS[selected];
  const isHero = step === 0;

  const inCurvePath = () => {
    const sy = MODEL_CY;
    const sx = PROFILE_X + PROFILE_W;
    return `M ${sx} ${sy} C ${sx + 40} ${sy}, ${MODEL_X - 40} ${MODEL_CY}, ${MODEL_X} ${MODEL_CY}`;
  };

  const outCurvePath = () => {
    return `M ${MODEL_X + MODEL_W} ${MODEL_CY} C ${MODEL_X + MODEL_W + 40} ${MODEL_CY}, ${RESULT_CARD_X - 40} ${MODEL_CY}, ${RESULT_CARD_X} ${MODEL_CY}`;
  };

  const inPathObj = {
    sx: PROFILE_X + PROFILE_W, sy: MODEL_CY,
    cp1x: PROFILE_X + PROFILE_W + 40, cp1y: MODEL_CY,
    cp2x: MODEL_X - 40, cp2y: MODEL_CY,
    ex: MODEL_X, ey: MODEL_CY,
  };

  const outPathObj = {
    sx: MODEL_X + MODEL_W, sy: MODEL_CY,
    cp1x: MODEL_X + MODEL_W + 40, cp1y: MODEL_CY,
    cp2x: RESULT_CARD_X - 40, cp2y: MODEL_CY,
    ex: RESULT_CARD_X, ey: MODEL_CY,
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-6xl flex-col items-center justify-center px-6 pt-8 relative">
      <motion.span
        className="mb-1 inline-block rounded-full px-3 py-0.5 text-[10px] font-bold tracking-[0.2em] uppercase"
        style={{ backgroundColor: `${NAVY}10`, color: NAVY }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Execute
      </motion.span>
      <motion.h2
        className="text-center text-2xl font-bold tracking-tight sm:text-3xl"
        style={{ color: NAVY }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        The model in action — one product, three prices
      </motion.h2>

      {/* Narrative area */}
      <div className="flex min-h-[3rem] items-center justify-center px-4 mb-4">
        <AnimatePresence mode="wait">
          {isHero ? (
            <motion.p
              key="hero-narrative"
              className="max-w-2xl text-center text-[1.05rem] leading-relaxed"
              style={{ color: NAVY }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              You&apos;ve seen the model generate a recommended price for a product.<br />But the <span style={{ fontWeight: 700, color: PURPLE }}>right price also depends on who&apos;s buying</span>.
            </motion.p>
          ) : (
            <motion.p
              key={`cust-${selected}`}
              className="max-w-2xl text-center text-[1.05rem] leading-relaxed"
              style={{ color: NAVY }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              {cust.narrative}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Diagram */}
      <div className="relative w-full max-w-5xl flex-1 min-h-0 overflow-hidden">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-full">

          <AnimatePresence mode="wait">
            {isHero ? (
              <ProductHero key="hero" />
            ) : (
              <motion.g
                key="interactive"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                {/* Flow curves */}
                <AnimatePresence mode="wait">
                  <motion.g key={selected}>
                    <motion.path
                      d={inCurvePath()}
                      fill="none" stroke={cust.color} strokeWidth={1.5} strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.35 }}
                      transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    />
                    <motion.path
                      d={outCurvePath()}
                      fill="none" stroke={PURPLE} strokeWidth={1.5} strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.35 }}
                      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    />
                    <FlowDot path={inPathObj} color={cust.color} delay={0.3} />
                    <FlowDot path={outPathObj} color={PURPLE} delay={0.6} />
                  </motion.g>
                </AnimatePresence>

                {/* Profile card (left) */}
                <AnimatePresence mode="wait">
                  <ProfileCard key={selected} cust={cust} />
                </AnimatePresence>

                {/* Result card (right) */}
                <AnimatePresence mode="wait">
                  <ResultCard key={selected} cust={cust} />
                </AnimatePresence>

                {/* Model processing pulse */}
                <AnimatePresence mode="wait">
                  <motion.rect
                    key={selected}
                    x={MODEL_X - 4} y={MODEL_Y - 4}
                    width={MODEL_W + 8} height={BOX_H + 8}
                    rx={20} fill="none" stroke={cust.color} strokeWidth={2}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.35, 0.1, 0] }}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
                  />
                </AnimatePresence>

                {/* Absorption glow — price landing pulse */}
                <motion.rect
                  x={MODEL_X - 10} y={MODEL_Y - 10}
                  width={MODEL_W + 20} height={BOX_H + 20}
                  rx={22} fill="none" stroke={NAVY} strokeWidth={2.5}
                  initial={{ opacity: 0.6, scale: 0.92 }}
                  animate={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
                  style={{ transformOrigin: `${MODEL_CX}px ${MODEL_CY}px` }}
                />
                <motion.rect
                  x={MODEL_X - 4} y={MODEL_Y - 4}
                  width={MODEL_W + 8} height={BOX_H + 8}
                  rx={18} fill="none" stroke={NAVY} strokeWidth={1.5}
                  initial={{ opacity: 0.4, scale: 0.96 }}
                  animate={{ opacity: 0, scale: 1.06 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  style={{ transformOrigin: `${MODEL_CX}px ${MODEL_CY}px` }}
                />

                {/* Center model box */}
                <motion.g
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  style={{ transformOrigin: `${MODEL_CX}px ${MODEL_CY}px` }}
                >
                  <rect x={MODEL_X} y={MODEL_Y} width={MODEL_W} height={BOX_H} rx={16} fill={NAVY} />

                  {/* Product tag */}
                  <rect x={MODEL_CX - 70} y={MODEL_Y + 16} width={140} height={20} rx={10} fill="rgba(255,255,255,0.08)" />
                  <text x={MODEL_CX} y={MODEL_Y + 30} fontSize="8" fontWeight="600" fill="rgba(255,255,255,0.45)" textAnchor="middle" letterSpacing="0.06em">
                    {PRODUCT_NAME}
                  </text>

                  <text x={MODEL_CX} y={MODEL_CY - 8} fontSize="18" fontWeight="700" fill="white" textAnchor="middle">
                    Pricing Model
                  </text>
                  <text x={MODEL_CX} y={MODEL_CY + 12} fontSize="11" fill="rgba(255,255,255,0.6)" textAnchor="middle">
                    ML-powered optimization
                  </text>

                  {/* List price reference — flashes on absorption */}
                  <rect x={MODEL_CX - 50} y={MODEL_CY + 28} width={100} height={20} rx={10} fill="rgba(255,255,255,0.08)" />
                  <motion.text
                    x={MODEL_CX} y={MODEL_CY + 42} fontSize="10" fontWeight="600" textAnchor="middle"
                    initial={{ fill: "rgba(255,255,255,1)", scale: 1.3 }}
                    animate={{ fill: "rgba(255,255,255,0.5)", scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    style={{ transformOrigin: `${MODEL_CX}px ${MODEL_CY + 38}px` }}
                  >
                    List: {LIST_PRICE} / unit
                  </motion.text>

                  {/* Processing bar */}
                  <motion.rect
                    x={MODEL_CX - 30} y={MODEL_CY + 58} height={3} rx={1.5} fill="rgba(255,255,255,0.2)"
                    animate={{ width: [40, 55, 30, 50, 40] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Feature indicators at bottom */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.rect
                      key={i}
                      x={MODEL_CX - 50 + i * 22} y={MODEL_CY + 72}
                      width={16} height={4} rx={2}
                      fill="rgba(255,255,255,0.1)"
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}
                </motion.g>

                {/* Connector line */}
                <line
                  x1={MODEL_CX} y1={MODEL_Y + BOX_H}
                  x2={MODEL_CX} y2={MODEL_Y + BOX_H + 24}
                  stroke={GREY} strokeWidth={1} strokeDasharray="3 3" opacity={0.4}
                />

                {/* Customer chips */}
                {CUSTOMERS.map((c, ci) => {
                  const isSelected = ci === selected;
                  const chipW = 120;
                  const chipH = 30;
                  const chipGap = 12;
                  const totalW = CUSTOMERS.length * chipW + (CUSTOMERS.length - 1) * chipGap;
                  const chipX = MODEL_CX - totalW / 2 + ci * (chipW + chipGap);
                  const chipY = MODEL_Y + BOX_H + 24;
                  return (
                    <motion.g
                      key={c.label}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelected(ci)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + ci * 0.08 }}
                    >
                      <motion.rect
                        x={chipX} y={chipY}
                        width={chipW} height={chipH}
                        rx={chipH / 2}
                        animate={{
                          fill: isSelected ? c.color : "white",
                          stroke: c.color,
                        }}
                        strokeWidth={isSelected ? 2 : 1.2}
                        transition={{ duration: 0.25 }}
                      />
                      <text
                        x={chipX + chipW / 2}
                        y={chipY + chipH / 2 + 1}
                        fontSize="10.5"
                        fontWeight="600"
                        fill={isSelected ? "white" : c.color}
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ pointerEvents: "none" }}
                      >
                        {c.label}
                      </text>
                    </motion.g>
                  );
                })}
              </motion.g>
            )}
          </AnimatePresence>

        </svg>
      </div>
    </div>
  );
}
