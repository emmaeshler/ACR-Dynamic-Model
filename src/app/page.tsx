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
  | { kind: "walkthrough" }
  | { kind: "transition" }
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
      "Every quote your team generates — email, chat, configured products — creates execution data that feeds the model.",
    detailSlides: [
      { kind: "quoting", component: "email", label: "Email Quoting" },
      { kind: "quoting", component: "products", label: "Configured Products" },
      { kind: "quoting", component: "services", label: "Configured Services" },
    ],
  },
  {
    node: "data",
    navLabel: "Deal Data",
    title: "Data",
    description:
      "Your deal history — won, lost, and negotiated outcomes. The raw material the model learns from.",
    detailSlides: [
      { kind: "section", sectionIdx: 0, label: "The Problem" },
      { kind: "section", sectionIdx: 1, label: "Finding Structure" },
    ],
  },
  {
    node: "market",
    navLabel: "Market Signals",
    title: "Market Signals",
    description:
      "Competitor pricing, market conditions, and external benchmarks that put your deals in context.",
    detailSlides: [
      { kind: "section", sectionIdx: 2, label: "Environmental Factors" },
      { kind: "section", sectionIdx: 8, label: "Market Shifts" },
    ],
  },
  {
    node: "expertise",
    navLabel: "Expertise",
    title: "Expertise",
    description:
      "Our industry knowledge combined with your in-house pricing rules and strategy.",
    detailSlides: [
      { kind: "section", sectionIdx: 3, label: "Industry Expertise" },
      { kind: "section", sectionIdx: 4, label: "In-House Expertise" },
    ],
  },
  {
    node: "model",
    navLabel: "The Model",
    title: "The Model",
    description:
      "Four inputs converge into one deterministic ML engine — it doesn't guess, it calculates.",
    detailSlides: [
      { kind: "section", sectionIdx: 5, label: "One Model" },
      { kind: "section", sectionIdx: 6, label: "Why ML, Not Gen AI" },
      { kind: "section", sectionIdx: 7, label: "Optimal Curve" },
      { kind: "section", sectionIdx: 9, label: "It Learns" },
    ],
  },
  {
    node: "conviction",
    navLabel: "Conviction",
    title: "Conviction",
    description:
      "The model assigns a confidence level — high-confidence quotes auto-approve, low-confidence get flagged for review.",
    detailSlides: [],
  },
  {
    node: "plan",
    navLabel: "Plan",
    title: "Plan",
    description:
      "Pricing drivers and talking points that arm your team for the customer conversation.",
    detailSlides: [
      { kind: "section", sectionIdx: 10, label: "Pricing Structures" },
    ],
  },
  {
    node: "negotiate",
    navLabel: "Negotiate",
    title: "Negotiate",
    description:
      "Guardrails and escalation paths — the model guides negotiations within your strategy.",
    detailSlides: [
      { kind: "section", sectionIdx: 11, label: "Maturity & Path Forward" },
    ],
  },
];

const SLIDES: SlideConfig[] = [];
const NAV_GROUPS: NavGroup[] = [];

SLIDES.push({ kind: "intro" });
NAV_GROUPS.push({
  label: "Introduction",
  slides: [{ index: 0, label: "Welcome" }],
});

const WALKTHROUGH_INDEX = SLIDES.length;
SLIDES.push({ kind: "walkthrough" });
NAV_GROUPS.push({
  label: "Overview",
  slides: BEAT_LABELS.map((label, i) => ({
    index: WALKTHROUGH_INDEX,
    label,
    subStep: i,
  })),
});

const TRANSITION_INDEX = SLIDES.length;
SLIDES.push({ kind: "transition" });

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
  const [wtRevealed, setWtRevealed] = useState(false);
  const total = SLIDES.length;

  const isWalkthrough = SLIDES[slide]?.kind === "walkthrough";

  useEffect(() => {
    if (!isWalkthrough || wtRevealed) return;
    const timer = setTimeout(() => setWtRevealed(true), 3200);
    return () => clearTimeout(timer);
  }, [isWalkthrough, wtRevealed]);

  const navigate = useCallback(
    (index: number, subStep?: number) => {
      if (subStep !== undefined) {
        if (index >= 0 && index < total) {
          setSlide(index);
          setWtBeat(subStep);
        }
        return;
      }

      if (isWalkthrough && index === slide + 1 && wtBeat < TOTAL_BEATS - 1) {
        setWtBeat((b) => b + 1);
        return;
      }
      if (isWalkthrough && index === slide - 1 && wtBeat > 0) {
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
      <main className="flex min-h-screen flex-col items-center justify-start pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
          >
            {config.kind === "intro" && <IntroSlide />}
            {config.kind === "walkthrough" && (
              <WalkthroughSlide beat={wtBeat} skipEntrance={wtRevealed} />
            )}
            {config.kind === "transition" && (
              <TransitionSlide
                onDiveDeeper={() => navigate(TRANSITION_INDEX + 1)}
                onWrapUp={() => navigate(END_INDEX)}
              />
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
          </motion.div>
        </AnimatePresence>
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
          stroke="rgba(255,255,255,0.03)"
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
          stroke="rgba(255,255,255,0.03)"
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
          opacity={i % 5 === 0 ? 0.15 : 0.06}
        />
      ))}

      {/* Rising curve — the "optimal curve" motif */}
      <path
        d="M80 520 C200 510, 300 480, 450 420 S700 300, 900 250 S1050 210, 1140 190"
        fill="none"
        stroke="rgba(229,105,16,0.12)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M80 540 C200 530, 300 500, 450 450 S700 340, 900 290 S1050 250, 1140 230"
        fill="none"
        stroke="rgba(33,165,213,0.08)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
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
          How We Build a{" "}
          <span className="relative inline-block">
            Pricing Model
            <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#E56910]" />
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
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 text-center"
      >
        <span
          className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          {title}
        </span>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
          {description}
        </p>
      </motion.div>
      <div className="relative mx-auto w-full">
        <DiagramRoadmap visibleNodes={visibleNodes} activeNode={activeNode} />
      </div>
    </div>
  );
}

function CompletePictureSlide() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 text-center">
        <span className="mb-2 inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          The Complete Picture
        </span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          ML Pricing Model
        </h2>
        <p className="mt-2 text-muted-foreground">
          Four inputs converge into one model — continuously learning from
          outcomes, driving pricing decisions on the right.
        </p>
      </div>
      <div className="relative mx-auto w-full">
        <DiagramRoadmap animated />
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
    />
  );
}

function TransitionSlide({
  onDiveDeeper,
  onWrapUp,
}: {
  onDiveDeeper: () => void;
  onWrapUp: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Want to go deeper?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          We can walk through each component in detail, or wrap up here.
        </p>
      </motion.div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6">
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          onClick={onDiveDeeper}
          className="group relative overflow-hidden rounded-xl border-2 border-[#00446a] bg-[#00446a] px-8 py-5 text-left transition-all hover:shadow-lg sm:w-64"
        >
          <span className="block text-lg font-semibold text-white">
            Dive Deeper
          </span>
          <span className="mt-1 block text-sm text-white/70">
            Walk through each piece of the model
          </span>
          <span className="mt-3 inline-block text-xs font-medium text-white/50">
            Press Next →
          </span>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          onClick={onWrapUp}
          className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white px-8 py-5 text-left transition-all hover:border-gray-300 hover:shadow-md sm:w-64"
        >
          <span className="block text-lg font-semibold text-gray-800">
            That&apos;s All For Now
          </span>
          <span className="mt-1 block text-sm text-muted-foreground">
            Jump to wrap-up
          </span>
        </motion.button>
      </div>
    </div>
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
