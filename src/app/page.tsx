"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type NavGroup, SlideNav } from "@/components/slide-nav";
import { OverviewSlide, OVERVIEW_TOTAL_STEPS } from "@/components/slides/overview-slide";
import { OneModelSlide, ONE_MODEL_TOTAL_STEPS } from "@/components/slides/one-model";
import { PowerSlide, POWER_TOTAL_STEPS } from "@/components/slides/power-slide";
import { ExecuteSlide, EXECUTE_TOTAL_STEPS } from "@/components/slides/execute-slide";
import { RefineSlide, REFINE_TOTAL_STEPS } from "@/components/slides/refine-slide";
import { ProfitGrowthSlide, PROFIT_GROWTH_TOTAL_STEPS } from "@/components/slides/profit-growth-slide";
import { ClosingSummarySlide } from "@/components/slides/closing-summary";

type SlideKind =
  | "intro"
  | "overview"
  | "one-model"
  | "power"
  | "execute"
  | "refine"
  | "profit-growth"
  | "closing-summary"
  | "end";

interface SlideConfig {
  kind: SlideKind;
}

const SLIDES: SlideConfig[] = [
  { kind: "intro" },
  // Overview
  { kind: "overview" },
  // Section 1: Design
  { kind: "one-model" },
  // Section 2: Power
  { kind: "power" },
  // Section 3: Execute
  { kind: "execute" },
  // Section 4: Refine
  { kind: "refine" },
  // Section 5: Profit Growth
  { kind: "profit-growth" },
  { kind: "closing-summary" },
  { kind: "end" },
];

const OVERVIEW_INDEX = 1;
const ONE_MODEL_INDEX = 2;
const POWER_INDEX = 3;
const EXECUTE_INDEX = 4;
const REFINE_INDEX = 5;
const PROFIT_GROWTH_INDEX = 6;

const SUB_STEP_CONFIG: Record<number, number> = {
  [OVERVIEW_INDEX]: OVERVIEW_TOTAL_STEPS,
  [ONE_MODEL_INDEX]: ONE_MODEL_TOTAL_STEPS,
  [POWER_INDEX]: POWER_TOTAL_STEPS,
  [EXECUTE_INDEX]: EXECUTE_TOTAL_STEPS,
  [REFINE_INDEX]: REFINE_TOTAL_STEPS,
  [PROFIT_GROWTH_INDEX]: PROFIT_GROWTH_TOTAL_STEPS,
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Introduction",
    slides: [
      { index: 0, label: "Welcome" },
      { index: OVERVIEW_INDEX, label: "Overview", subStep: 0 },
      { index: OVERVIEW_INDEX, label: "The Model", subStep: 1 },
    ],
  },
  {
    label: "1 | Design",
    slides: [
      { index: ONE_MODEL_INDEX, label: "Inputs", subStep: 0 },
      { index: ONE_MODEL_INDEX, label: "Outputs", subStep: 1 },
    ],
  },
  {
    label: "2 | Power",
    slides: [
      { index: POWER_INDEX, label: "Overview", subStep: 0 },
      { index: POWER_INDEX, label: "Data Ingestion", subStep: 1 },
      { index: POWER_INDEX, label: "Analysis", subStep: 2 },
    ],
  },
  {
    label: "3 | Execute",
    slides: [
      { index: EXECUTE_INDEX, label: "Customer Pricing", subStep: 0 },
    ],
  },
  {
    label: "4 | Refine",
    slides: [
      { index: REFINE_INDEX, label: "Prices in Market", subStep: 0 },
      { index: REFINE_INDEX, label: "Market Responds", subStep: 1 },
      { index: REFINE_INDEX, label: "Segmentation", subStep: 2 },
      { index: REFINE_INDEX, label: "Refine: QuickParts", subStep: 3 },
      { index: REFINE_INDEX, label: "Refine: Acme", subStep: 4 },
      { index: REFINE_INDEX, label: "Refine: MedSupply", subStep: 5 },
    ],
  },
  {
    label: "5 | Profit Growth",
    slides: [
      { index: PROFIT_GROWTH_INDEX, label: "The Scale", subStep: 0 },
      { index: PROFIT_GROWTH_INDEX, label: "Status Quo", subStep: 1 },
      { index: PROFIT_GROWTH_INDEX, label: "Dynamic Model", subStep: 2 },
      { index: PROFIT_GROWTH_INDEX, label: "Model Scan", subStep: 3 },
      { index: PROFIT_GROWTH_INDEX, label: "Optimized", subStep: 4 },
    ],
  },
  {
    label: "Closing",
    slides: [
      { index: 7, label: "Summary" },
      { index: 8, label: "Thank You" },
    ],
  },
];

const AUTO_ANIM_SLIDES = new Set<SlideKind>([]);

const DEFAULT_DONE_MS = 2000;

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);
  const total = SLIDES.length;

  const maxSteps = SUB_STEP_CONFIG[slide] ?? 0;
  const hasSubSteps = maxSteps > 0;

  useEffect(() => {
    setAnimationDone(false);
    const kind = SLIDES[slide]?.kind;
    if (!AUTO_ANIM_SLIDES.has(kind)) {
      const t = setTimeout(() => setAnimationDone(true), DEFAULT_DONE_MS);
      return () => clearTimeout(t);
    }
  }, [slide, subStep]);

  const markAnimationDone = useCallback(() => setAnimationDone(true), []);

  const navigate = useCallback(
    (index: number, targetSubStep?: number) => {
      if (targetSubStep !== undefined) {
        if (index >= 0 && index < total) {
          setSlide(index);
          setSubStep(targetSubStep);
        }
        return;
      }

      const currentMax = SUB_STEP_CONFIG[slide] ?? 0;

      // Forward within sub-steps
      if (index === slide + 1 && currentMax > 0 && subStep < currentMax - 1) {
        setSubStep((s) => s + 1);
        return;
      }
      // Back within sub-steps
      if (index === slide - 1 && currentMax > 0 && subStep > 0) {
        setSubStep((s) => s - 1);
        return;
      }

      if (index >= 0 && index < total) {
        // Going back into a sub-step slide from the next slide → land on last step
        const targetMax = SUB_STEP_CONFIG[index] ?? 0;
        if (index < slide && targetMax > 0 && slide === index + 1) {
          setSlide(index);
          setSubStep(targetMax - 1);
          return;
        }

        setSlide(index);
        setSubStep(0);
      }
    },
    [total, slide, subStep],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        navigate(slide + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        navigate(slide - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slide, navigate]);

  const config = SLIDES[slide];

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-start pt-14 pb-16 overflow-x-hidden">
        <AnimatePresence mode="wait">
        <motion.div
          key={slide}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          {config.kind === "intro" && <IntroSlide />}
          {config.kind === "overview" && <OverviewSlide step={subStep} />}
          {config.kind === "one-model" && (
            <OneModelSlide
              step={subStep}
              onAutoAdvance={() => navigate(slide + 1)}
            />
          )}
          {config.kind === "power" && <PowerSlide step={subStep} />}
          {config.kind === "execute" && <ExecuteSlide step={subStep} />}
          {config.kind === "refine" && <RefineSlide step={subStep} />}
          {config.kind === "profit-growth" && (
            <ProfitGrowthSlide
              step={subStep}
              onAutoAdvance={() => navigate(slide + 1)}
            />
          )}
          {config.kind === "closing-summary" && <ClosingSummarySlide />}
          {config.kind === "end" && <EndSlide onRestart={() => navigate(0)} />}
        </motion.div>
        </AnimatePresence>
      </main>
      <SlideNav
        current={slide}
        currentSubStep={hasSubSteps ? subStep : undefined}
        total={total}
        groups={NAV_GROUPS}
        onNavigate={navigate}
        animationDone={animationDone}
      />
    </>
  );
}

/* ── Download Button (client-only) ───────────────────────────── */

function DownloadButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(!document.getElementById("__export_root"));
  }, []);
  if (!show) return null;
  return (
    <a
      href="/Inside Your Dynamic Model - INSIGHT2PROFIT.html"
      download="Inside Your Dynamic Model - INSIGHT2PROFIT.html"
      className="absolute right-6 top-6 z-20 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
    >
      Download as HTML
    </a>
  );
}

/* ── Intro Slide ──────────────────────────────────────────────── */

function I2PLogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
      <rect x="0" y="0" width="15" height="15" rx="2" fill="#EF8B1D" />
      <rect x="19" y="0" width="15" height="15" rx="2" fill="#E56910" />
      <rect x="0" y="19" width="15" height="15" rx="2" fill="#00446A" />
      <rect x="19" y="19" width="15" height="15" rx="2" fill="#E56910" />
    </svg>
  );
}

function IntroBackdrop() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1200 700"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="intro-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00446A" />
          <stop offset="100%" stopColor="#06283D" />
        </linearGradient>
      </defs>
      <rect width="1200" height="700" fill="url(#intro-grad)" />

      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={100 * i}
          y1="0"
          x2={100 * i}
          y2="700"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={100 * i}
          x2="1200"
          y2={100 * i}
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1"
        />
      ))}

      {[
        [180, 180, 3], [220, 260, 2], [310, 150, 2.5], [370, 310, 2],
        [440, 200, 3.5], [520, 280, 2], [560, 140, 2.5], [640, 240, 3],
        [710, 170, 2], [780, 300, 2.5], [830, 190, 2], [900, 260, 3],
        [960, 150, 2.5], [1020, 220, 2], [1060, 310, 2.5],
        [150, 450, 2], [250, 520, 2.5], [380, 480, 3], [490, 540, 2],
        [600, 460, 2.5], [720, 510, 2], [850, 470, 3], [950, 530, 2.5],
        [1050, 490, 2],
      ].map(([cx, cy, r], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill={i % 5 === 0 ? "#E56910" : i % 3 === 0 ? "#21A5D5" : "white"}
          opacity={i % 5 === 0 ? 0.3 : 0.14}
        />
      ))}

      <path
        d="M80 520 C200 510, 300 480, 450 420 S700 300, 900 250 S1050 210, 1140 190"
        fill="none"
        stroke="rgba(229,105,16,0.22)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M80 540 C200 530, 300 500, 450 450 S700 340, 900 290 S1050 250, 1140 230"
        fill="none"
        stroke="rgba(33,165,213,0.15)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const MODEL_WORDS = ["Design", "Power", "Execute", "Refine", "Grow"];

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % MODEL_WORDS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="relative inline-flex flex-col items-start overflow-hidden align-bottom" style={{ height: "1.15em" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={MODEL_WORDS[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="inline-block whitespace-nowrap"
        >
          {MODEL_WORDS[index]}
        </motion.span>
      </AnimatePresence>
      <span className="absolute -bottom-0.5 left-0 h-1 w-full rounded-full bg-[#E56910]" />
    </span>
  );
}

function IntroSlide() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <IntroBackdrop />

      <DownloadButton />

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-center gap-3">
          <I2PLogoMark className="size-8" />
          <span className="text-sm font-semibold tracking-[0.2em] text-white/60 uppercase">
            Insight2Profit
          </span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          <span className="block">Inside Your</span>
          <span className="block">Dynamic Model</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
          See how your pricing model turns data into decisions — and decisions into measurable profit.
        </p>

        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-white/40">
          <span>Tap Next or press → to walk through the story</span>
          <span className="inline-block animate-pulse">→</span>
        </div>
      </div>
    </div>
  );
}

/* ── End Slide ────────────────────────────────────────────────── */

function EndSlide({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        End of Walkthrough
      </span>
      <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Thank You
      </h2>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        Questions? Let&apos;s discuss how this model can work for your business.
      </p>
      <button
        onClick={onRestart}
        className="mt-10 rounded-lg bg-[#00446a] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#00446a]/90"
      >
        ← Start Over
      </button>
    </div>
  );
}
