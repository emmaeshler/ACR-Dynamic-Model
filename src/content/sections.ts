import type { ComponentType } from "react";

export interface SectionDefinition {
  slug: string;
  order: number;
  title: string;
  caption: string;
  low: ComponentType;
  medium: ComponentType;
  high: ComponentType;
  highSummary: string;
}

import { ExecutionLow, ExecutionMedium, ExecutionHigh } from "./00-execution";
import { ProblemLow, ProblemMedium, ProblemHigh } from "./01-the-problem";
import { DDILow, DDIMedium, DDIHigh } from "./02-finding-structure";
import { EnvFactorsLow, EnvFactorsMedium, EnvFactorsHigh } from "./03-environmental-factors";
import { IndustryExpLow, IndustryExpMedium, IndustryExpHigh } from "./04-industry-expertise";
import { InHouseExpLow, InHouseExpMedium, InHouseExpHigh } from "./05-in-house-expertise";
import { OneModelLow, OneModelMedium, OneModelHigh } from "./06-one-model";
import { WhyMLLow, WhyMLMedium, WhyMLHigh } from "./07-why-ml-not-genai";
import { OptimalCurveLow, OptimalCurveMedium, OptimalCurveHigh } from "./08-optimal-curve";
import { MarketShiftLow, MarketShiftMedium, MarketShiftHigh } from "./09-market-shift";
import { FeedbackLoopLow, FeedbackLoopMedium, FeedbackLoopHigh } from "./10-feedback-loop";
import { PricingStructuresLow, PricingStructuresMedium, PricingStructuresHigh } from "./11-pricing-structures";
import { MaturityLow, MaturityMedium, MaturityHigh } from "./12-maturity";

export const sections: SectionDefinition[] = [
  {
    slug: "execution",
    order: 0,
    title: "Execution Data",
    caption: "Every customer interaction becomes training data.",
    low: ExecutionLow,
    medium: ExecutionMedium,
    high: ExecutionHigh,
    highSummary: "Email, configured products & service quoting tools",
  },
  {
    slug: "the-problem",
    order: 1,
    title: "The Problem",
    caption: "No model. Pricing isn't learning or adapting.",
    low: ProblemLow,
    medium: ProblemMedium,
    high: ProblemHigh,
    highSummary: "Revenue leakage quantification & margin erosion",
  },
  {
    slug: "finding-structure",
    order: 2,
    title: "Finding Structure in the Data",
    caption: "Same product, wildly different prices — the structure is hiding.",
    low: DDILow,
    medium: DDIMedium,
    high: DDIHigh,
    highSummary: "Attributes, knobs & auto-tuned pricing",
  },
  {
    slug: "environmental-factors",
    order: 3,
    title: "Environmental Factors",
    caption: "Your price looks optimal — until you see where competitors landed.",
    low: EnvFactorsLow,
    medium: EnvFactorsMedium,
    high: EnvFactorsHigh,
    highSummary: "Signal ingestion & auto-retune mechanics",
  },
  {
    slug: "industry-expertise",
    order: 4,
    title: "Our Industry Expertise",
    caption: "List price isn't pocket price. We know where to look.",
    low: IndustryExpLow,
    medium: IndustryExpMedium,
    high: IndustryExpHigh,
    highSummary: "Pocket price methodology & leak identification",
  },
  {
    slug: "in-house-expertise",
    order: 5,
    title: "Your In-House Expertise",
    caption: "Your rules and strategy bend the math to fit your business.",
    low: InHouseExpLow,
    medium: InHouseExpMedium,
    high: InHouseExpHigh,
    highSummary: "Constraint functions & guardrail architecture",
  },
  {
    slug: "one-model",
    order: 6,
    title: "One Model",
    caption: "Four inputs converge into one deterministic engine.",
    low: OneModelLow,
    medium: OneModelMedium,
    high: OneModelHigh,
    highSummary: "Feature engineering & pipeline architecture",
  },
  {
    slug: "why-ml-not-genai",
    order: 7,
    title: "Why ML, Not Gen AI",
    caption: "Deterministic, not probabilistic.",
    low: WhyMLLow,
    medium: WhyMLMedium,
    high: WhyMLHigh,
    highSummary: "Why LLMs fail at pricing decisions",
  },
  {
    slug: "optimal-curve",
    order: 8,
    title: "The Optimal Curve",
    caption: "More transactions, better curve fit.",
    low: OptimalCurveLow,
    medium: OptimalCurveMedium,
    high: OptimalCurveHigh,
    highSummary: "Objective function & elasticity modeling",
  },
  {
    slug: "market-shift",
    order: 9,
    title: "When the Market Shifts",
    caption: "Something changes — the model sees it first.",
    low: MarketShiftLow,
    medium: MarketShiftMedium,
    high: MarketShiftHigh,
    highSummary: "Detection algorithms & threshold tuning",
  },
  {
    slug: "feedback-loop",
    order: 10,
    title: "It Learns",
    caption: "Every outcome feeds the next cycle.",
    low: FeedbackLoopLow,
    medium: FeedbackLoopMedium,
    high: FeedbackLoopHigh,
    highSummary: "Retraining pipeline, drift detection & validation",
  },
  {
    slug: "pricing-structures",
    order: 11,
    title: "Pricing Structures",
    caption: "Three structures, increasing precision.",
    low: PricingStructuresLow,
    medium: PricingStructuresMedium,
    high: PricingStructuresHigh,
    highSummary: "Synthesize, steer, experiment & optimize stages",
  },
  {
    slug: "maturity",
    order: 12,
    title: "Maturity & Path Forward",
    caption: "Where you are and where you're headed.",
    low: MaturityLow,
    medium: MaturityMedium,
    high: MaturityHigh,
    highSummary: "Control surfaces unlocked at each maturity level",
  },
];
