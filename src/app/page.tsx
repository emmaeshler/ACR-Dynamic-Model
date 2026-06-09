"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sections } from "@/content/sections";
import { ConceptSection } from "@/components/concept-section";
import { SlideNav, type NavGroup } from "@/components/slide-nav";
import {
  DiagramRoadmap,
  getNodeColor,
  type DiagramNode,
} from "@/components/diagram-roadmap";
import {
  EmailQuotingSlide,
  ConfiguredProductsSlide,
  ConfiguredServicesSlide,
} from "@/components/quoting-apps-slide";
import {
  WalkthroughSlide,
  TOTAL_BEATS,
  BEAT_LABELS,
} from "@/components/walkthrough-slide";

type SlideConfig =
  | { kind: "intro" }
  | { kind: "transition" }
  | { kind: "walkthrough" }
  | {
      kind: "build";
      visibleNodes: DiagramNode[];
      activeNode: DiagramNode;
      title: string;
      description: string;
    }
  | { kind: "complete" }
  | { kind: "quoting"; component: "email" | "products" | "services" }
  | { kind: "section"; sectionIdx: number }
  | { kind: "end" };

interface SectionGroup {
  node: DiagramNode;
  navLabel: string;
  title: string;
  description: string;
  detailSlides: Array<
    | { kind: "quoting"; component: "email" | "products" | "services"; label: string }
    | { kind: "section"; sectionIdx: number; label: string }
  >;
}

const SECTION_GROUPS: SectionGroup[] = [
  {
    node: "execution",
    navLabel: "Execution",
    title: "Execution",
    description:
      "Quotes generated through email, chat, and configured products produce transactional data the model trains on.",
    detailSlides: [
      { kind: "section", sectionIdx: 0, label: "Execution Data" },
    ],
  },
  {
    node: "data",
    navLabel: "Deal Data",
    title: "Data",
    description:
      "Historical deal outcomes — wins, losses, and negotiated prices — form the training set the model learns from.",
    detailSlides: [
      { kind: "section", sectionIdx: 1, label: "The Problem" },
      { kind: "section", sectionIdx: 2, label: "Finding Structure" },
    ],
  },
  {
    node: "market",
    navLabel: "Market Signals",
    title: "Market Signals",
    description:
      "Competitor pricing, commodity indices, and external benchmarks are ingested as features that adjust model output in real time.",
    detailSlides: [
      { kind: "section", sectionIdx: 3, label: "Environmental Factors" },
      { kind: "section", sectionIdx: 9, label: "Market Shifts" },
    ],
  },
  {
    node: "expertise",
    navLabel: "Expertise",
    title: "Expertise",
    description:
      "Industry-specific pricing logic and your internal business rules are encoded as constraints and weight adjustments in the model.",
    detailSlides: [
      { kind: "section", sectionIdx: 4, label: "Industry Expertise" },
      { kind: "section", sectionIdx: 5, label: "In-House Expertise" },
    ],
  },
  {
    node: "model",
    navLabel: "The Model",
    title: "The Model",
    description:
      "One deterministic ML model processes everything — not generative AI, not rules-based. It calculates.",
    detailSlides: [
      { kind: "section", sectionIdx: 6, label: "One Model" },
      { kind: "section", sectionIdx: 7, label: "Why ML, Not Gen AI" },
      { kind: "section", sectionIdx: 8, label: "Optimal Curve" },
      { kind: "section", sectionIdx: 10, label: "It Learns" },
    ],
  },
  {
    node: "conviction",
    navLabel: "Conviction",
    title: "Conviction",
    description:
      "Each recommendation includes a confidence score. High-confidence quotes can auto-approve; low-confidence ones route to review.",
    detailSlides: [],
  },
  {
    node: "plan",
    navLabel: "Plan",
    title: "Plan",
    description:
      "The model outputs ceiling, floor, and target prices along with the drivers behind each — giving reps context, not just a number.",
    detailSlides: [
      { kind: "section", sectionIdx: 11, label: "Pricing Structures" },
    ],
  },
  {
    node: "negotiate",
    navLabel: "Negotiate",
    title: "Negotiate",
    description:
      "Guardrails define how far a rep can move from target before escalation. The model enforces concession strategy automatically.",
    detailSlides: [
      { kind: "section", sectionIdx: 12, label: "Maturity & Path Forward" },
    ],
  },
];

const SLIDES: SlideConfig[] = [];
const NAV_GROUPS: NavGroup[] = [];

SLIDES.push({ kind: "intro" });
SLIDES.push({ kind: "transition" });
SLIDES.push({ kind: "walkthrough" });
const WALKTHROUGH_INDEX = 2;
NAV_GROUPS.push({
  label: "Introduction",
  slides: [
    { index: 0, label: "Welcome" },
    { index: 1, label: "Overview" },
  ],
});
NAV_GROUPS.push({
  label: "Overview",
  slides: BEAT_LABELS.slice(1).map((label, i) => ({
    index: WALKTHROUGH_INDEX,
    label,
    subStep: i + 1,
  })),
});

const accumulated: DiagramNode[] = [];

for (const group of SECTION_GROUPS) {
  accumulated.push(group.node);
  const navSlides: { index: number; label: string }[] = [];

  SLIDES.push({
    kind: "build",
    visibleNodes: [...accumulated],
    activeNode: group.node,
    title: group.title,
    description: group.description,
  });
  navSlides.push({ index: SLIDES.length - 1, label: group.title });

  for (const detail of group.detailSlides) {
    if (detail.kind === "quoting") {
      SLIDES.push({ kind: "quoting", component: detail.component });
    } else {
      SLIDES.push({ kind: "section", sectionIdx: detail.sectionIdx });
    }
    navSlides.push({ index: SLIDES.length - 1, label: detail.label });
  }

  NAV_GROUPS.push({ label: group.navLabel, slides: navSlides });
}

SLIDES.push({ kind: "complete" });
SLIDES.push({ kind: "end" });
const END_INDEX = SLIDES.length - 1;
NAV_GROUPS.push({
  label: "Closing",
  slides: [
    { index: SLIDES.length - 2, label: "Complete Picture" },
    { index: END_INDEX, label: "Thank You" },
  ],
});

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [wtBeat, setWtBeat] = useState(0);
  const total = SLIDES.length;
  const isWalkthrough = slide === WALKTHROUGH_INDEX;

  const navigate = useCallback(
    (index: number, subStep?: number) => {
      if (subStep !== undefined) {
        if (index >= 0 && index < total) {
          setSlide(index);
          if (index === WALKTHROUGH_INDEX) setWtBeat(subStep);
        }
        return;
      }
      if (isWalkthrough && index === slide + 1 && wtBeat < TOTAL_BEATS - 1) {
        setWtBeat((b) => b + 1);
        return;
      }
      if (isWalkthrough && index === slide - 1 && wtBeat > 1) {
        setWtBeat((b) => b - 1);
        return;
      }
      if (!isWalkthrough && index === WALKTHROUGH_INDEX && slide === WALKTHROUGH_INDEX + 1) {
        setSlide(index);
        setWtBeat(TOTAL_BEATS - 1);
        return;
      }
      if (index >= 0 && index < total) {
        setSlide(index);
        if (index === WALKTHROUGH_INDEX) setWtBeat(1);
      }
    },
    [total, slide, isWalkthrough, wtBeat],
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
      <main className="flex min-h-screen flex-col items-center justify-start pt-14 pb-16">
        <div key={slide} className="w-full animate-fade-in">
          {config.kind === "intro" && <IntroSlide />}
          {config.kind === "transition" && <TransitionSlide />}
          {config.kind === "walkthrough" && (
            <WalkthroughSlide beat={wtBeat} skipEntrance={wtBeat > 0} />
          )}
          {config.kind === "build" && (
            <BuildStepSlide
              visibleNodes={config.visibleNodes}
              activeNode={config.activeNode}
              title={config.title}
              description={config.description}
            />
          )}
          {config.kind === "complete" && <CompletePictureSlide />}
          {config.kind === "quoting" && config.component === "email" && (
            <EmailQuotingSlide />
          )}
          {config.kind === "quoting" && config.component === "products" && (
            <ConfiguredProductsSlide />
          )}
          {config.kind === "quoting" && config.component === "services" && (
            <ConfiguredServicesSlide />
          )}
          {config.kind === "section" && (
            <SectionSlide section={sections[config.sectionIdx]} />
          )}
          {config.kind === "end" && (
            <EndSlide onRestart={() => navigate(0)} />
          )}
        </div>
      </main>
      <SlideNav
        current={slide}
        currentSubStep={isWalkthrough ? wtBeat : undefined}
        total={total}
        groups={NAV_GROUPS}
        onNavigate={navigate}
      />
    </>
  );
}

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

      {/* Subtle grid lines */}
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

      {/* Abstract data dots — pricing scatter feel */}
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

      {/* Rising curve — the "optimal curve" motif */}
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

const MODEL_WORDS = ["Pricing", "Quoting", "Margin", "Deal Score", "Win Rate"];

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

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-center gap-3">
          <I2PLogoMark className="size-8" />
          <span className="text-sm font-semibold tracking-[0.2em] text-white/60 uppercase">
            Insight2Profit
          </span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          <span className="block">How We Build a</span>
          <span className="inline-flex items-baseline gap-[0.3em]">
            <RotatingWord />
            <span>Model</span>
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
          Your transaction history, market intelligence, our industry expertise,
          and your business rules come together in one model — built to find the
          right price for every deal and adapt as conditions change.
        </p>

        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-white/40">
          <span>Use arrow keys or tap Next to begin</span>
          <span className="inline-block animate-pulse">→</span>
        </div>
      </div>
    </div>
  );
}

const WALKTHROUGH_STEPS: {
  nodes: DiagramNode[];
  active?: DiagramNode;
  label: string;
}[] = [
  {
    nodes: ["execution", "data", "market", "expertise"],
    active: "execution",
    label: "It starts with your data",
  },
  {
    nodes: ["execution", "data", "market", "expertise", "model"],
    active: "model",
    label: "One model processes everything",
  },
  {
    nodes: [
      "execution", "data", "market", "expertise",
      "model", "conviction", "plan", "negotiate",
    ],
    active: "plan",
    label: "And produces actionable outputs",
  },
];

function TransitionSlide() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= WALKTHROUGH_STEPS.length - 1) return;
    const timer = setTimeout(() => setStep((s) => s + 1), 1800);
    return () => clearTimeout(timer);
  }, [step]);

  const current = WALKTHROUGH_STEPS[step];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="relative mx-auto w-full">
        <DiagramRoadmap
          visibleNodes={current.nodes}
          activeNode={current.active}
        />
      </div>
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8 text-center"
      >
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {current.label}
        </h2>
      </motion.div>
    </div>
  );
}

function BuildStepSlide({
  visibleNodes,
  activeNode,
  title,
  description,
}: {
  visibleNodes: DiagramNode[];
  activeNode: DiagramNode;
  title: string;
  description: string;
}) {
  const color = getNodeColor(activeNode);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="relative mx-auto w-full">
        <DiagramRoadmap visibleNodes={visibleNodes} activeNode={activeNode} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8 text-center"
      >
        <span
          className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          {title}
        </span>
        <h2 className="mx-auto mt-3 max-w-2xl text-lg font-medium text-foreground">
          {description}
        </h2>
      </motion.div>
    </div>
  );
}

function CompletePictureSlide() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="relative mx-auto w-full">
        <DiagramRoadmap animated />
      </div>
      <div className="mt-8 text-center">
        <span className="mb-2 inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          The Complete Picture
        </span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          ML Pricing Model
        </h2>
        <p className="mt-2 font-medium text-foreground">
          Four input categories feed one model. Each deal outcome retrains the
          weights, producing three output types on the right.
        </p>
      </div>
    </div>
  );
}

function SectionSlide({
  section,
}: {
  section: (typeof sections)[number];
}) {
  return (
    <ConceptSection
      slug={section.slug}
      order={section.order}
      title={section.title}
      caption={section.caption}
      low={section.low}
      medium={section.medium}
      high={section.high}
      highSummary={section.highSummary}
    />
  );
}

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
