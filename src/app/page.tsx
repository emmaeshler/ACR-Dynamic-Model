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

type SlideConfig =
  | { kind: "intro" }
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
NAV_GROUPS.push({
  label: "Closing",
  slides: [
    { index: SLIDES.length - 2, label: "Complete Picture" },
    { index: SLIDES.length - 1, label: "Thank You" },
  ],
});

export default function Home() {
  const [slide, setSlide] = useState(0);
  const total = SLIDES.length;

  const navigate = useCallback(
    (index: number) => {
      if (index >= 0 && index < total) setSlide(index);
    },
    [total],
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
        total={total}
        groups={NAV_GROUPS}
        onNavigate={navigate}
      />
    </>
  );
}

function IntroSlide() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        Model Walkthrough
      </span>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        How We Build a Pricing Model
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        Four inputs — your data, the market, our expertise, and your strategy —
        produce one smart output. Walk through how the model works, why we chose
        ML, and how it learns over time.
      </p>
      <p className="mt-8 text-sm text-muted-foreground">
        Use arrow keys or the navigation below to move through slides →
      </p>
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
