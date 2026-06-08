import type { ComponentType } from "react";

export interface SectionDefinition {
  slug: string;
  order: number;
  title: string;
  caption: string;
  low: ComponentType;
  medium: ComponentType;
  high: ComponentType;
}

import { ProblemLow, ProblemMedium, ProblemHigh } from "./01-the-problem";
import { ModelComesLow, ModelComesMedium, ModelComesHigh } from "./02-model-comes-together";
import { WhyMLLow, WhyMLMedium, WhyMLHigh } from "./03-why-ml-not-genai";
import { ModelRunningLow, ModelRunningMedium, ModelRunningHigh } from "./04-model-running";
import { ComplicationLow, ComplicationMedium, ComplicationHigh } from "./05-complication";
import { LessonLow, LessonMedium, LessonHigh } from "./06-lesson-opportunity";
import { ImprovedRecLow, ImprovedRecMedium, ImprovedRecHigh } from "./07-improved-recommendation";

export const sections: SectionDefinition[] = [
  {
    slug: "the-problem",
    order: 1,
    title: "The Problem",
    caption: "No model. Pricing isn’t learning or adapting.",
    low: ProblemLow,
    medium: ProblemMedium,
    high: ProblemHigh,
  },
  {
    slug: "model-comes-together",
    order: 2,
    title: "How the Model Comes Together",
    caption: "Client data + environmental signals → ML.",
    low: ModelComesLow,
    medium: ModelComesMedium,
    high: ModelComesHigh,
  },
  {
    slug: "why-ml-not-genai",
    order: 3,
    title: "Why ML, Not Gen AI",
    caption: "Deterministic, not probabilistic.",
    low: WhyMLLow,
    medium: WhyMLMedium,
    high: WhyMLHigh,
  },
  {
    slug: "model-running",
    order: 4,
    title: "The Model Running",
    caption: "More transactions, better curve fit.",
    low: ModelRunningLow,
    medium: ModelRunningMedium,
    high: ModelRunningHigh,
  },
  {
    slug: "complication",
    order: 5,
    title: "Complication",
    caption: "Something changes — the model sees it.",
    low: ComplicationLow,
    medium: ComplicationMedium,
    high: ComplicationHigh,
  },
  {
    slug: "lesson-opportunity",
    order: 6,
    title: "Lesson + Opportunity",
    caption: "The model trains on itself and gets smarter.",
    low: LessonLow,
    medium: LessonMedium,
    high: LessonHigh,
  },
  {
    slug: "improved-recommendation",
    order: 7,
    title: "Improved Recommendation",
    caption: "Comes back around — better than before.",
    low: ImprovedRecLow,
    medium: ImprovedRecMedium,
    high: ImprovedRecHigh,
  },
];
