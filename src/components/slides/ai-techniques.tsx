"use client";

import { motion } from "framer-motion";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const TEAL = "#21A5D5";

const ROWS = [
  {
    dimension: "Data Type",
    ml: { title: "Structured Input Data", desc: "Transactions, discounts, customer segments" },
    genai: { title: "Unstructured Input Data", desc: "Works best with information like emails, notes, comments" },
  },
  {
    dimension: "Core Capability",
    ml: { title: "Prediction and Forecasting", desc: "Price sensitivity, win probability, demand response" },
    genai: { title: "Summarization and Contextualizing", desc: "Recommendation explanations, sentiment analysis" },
  },
  {
    dimension: "Logic Mechanism",
    ml: { title: "Deterministic and Repeatable", desc: "The same model and inputs provide the same output" },
    genai: { title: "Non-Deterministic", desc: "Can provide different outputs given the same input" },
  },
  {
    dimension: "Business Application",
    ml: { title: "Data-Driven Recommendations", desc: "Optimizes for the best output given known constraints" },
    genai: { title: "Natural-Language Reasoning", desc: "Supports data-driven workflows to improve usability" },
  },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.4 },
});

export function AiTechniquesSlide() {
  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-5xl flex-col justify-center gap-6 px-6">
      <motion.div {...fadeUp(0)}>
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          AI Techniques
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-base font-medium tracking-tight sm:text-lg" style={{ color: NAVY }}>
          You just saw the model crunch numbers <em>and</em> explain its reasoning — those come from two different types of AI working together.
        </p>
      </motion.div>

      {/* Header pills */}
      <motion.div className="flex justify-center gap-4" {...fadeUp(0.1)}>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-sm" style={{ backgroundColor: NAVY }} />
          <span className="rounded-full px-4 py-1.5 text-sm font-semibold text-white" style={{ backgroundColor: NAVY }}>
            Machine Learning
          </span>
        </div>
        <div className="relative flex items-center">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-background px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
            vs
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full px-4 py-1.5 text-sm font-semibold text-white" style={{ backgroundColor: TEAL }}>
            Generative AI
          </span>
          <div className="size-3 rounded-sm" style={{ backgroundColor: TEAL }} />
        </div>
      </motion.div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-1/5 border-b bg-muted/30 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Dimension
              </th>
              <th className="w-2/5 border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: NAVY, backgroundColor: `${NAVY}06` }}>
                Machine Learning
              </th>
              <th className="w-2/5 border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: TEAL, backgroundColor: `${TEAL}06` }}>
                Generative AI
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <motion.tr
                key={row.dimension}
                className="border-b last:border-b-0"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.35 }}
              >
                <td className="bg-muted/15 px-4 py-3">
                  <span className="text-xs font-bold" style={{ color: NAVY }}>{row.dimension}</span>
                </td>
                <td className="px-4 py-3" style={{ backgroundColor: `${NAVY}03` }}>
                  <p className="text-sm font-semibold">{row.ml.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{row.ml.desc}</p>
                </td>
                <td className="px-4 py-3" style={{ backgroundColor: `${TEAL}03` }}>
                  <p className="text-sm font-semibold">{row.genai.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{row.genai.desc}</p>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
