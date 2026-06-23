"use client";

import { motion } from "framer-motion";
import { ChevronPipeline } from "./chevron-pipeline";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const TEAL = "#21A5D5";
const GREEN = "#2e7d32";
const RED = "#c62828";

interface Scenario {
  id: string;
  price: string;
  traits: string[];
  response: { volume: string; winRate: string };
  adjustment: string;
  newId: string;
  newPrice: string;
  newTraits: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "A",
    price: "$17.96",
    traits: ["Strategic Customer", "Specialized Product", "High Product Mix", "Industrial End Market", "40% Win Rate"],
    response: { volume: "Flat", winRate: "Up" },
    adjustment: "++",
    newId: "A2",
    newPrice: "$19.24",
    newTraits: ["Strategic Customer", "Specialized Product", "High Product Mix", "Industrial End Market", "43% Win Rate"],
  },
  {
    id: "B",
    price: "$16.73",
    traits: ["Strategic Customer", "Specialized Product", "Low Product Mix", "Healthcare End Market", "40% Win Rate"],
    response: { volume: "Down", winRate: "Down" },
    adjustment: "–",
    newId: "B2",
    newPrice: "$14.89",
    newTraits: ["Strategic Customer", "Specialized Product", "Low Product Mix", "Healthcare End Market", "38% Win Rate"],
  },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.4 },
});

function ScenarioCard({ label, price, traits, color }: { label: string; price: string; traits: string[]; color: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded-md px-2 py-0.5 text-xs font-bold text-white" style={{ backgroundColor: color }}>
          {label}
        </span>
        <span className="text-lg font-bold">{price}</span>
      </div>
      <div className="space-y-0.5">
        {traits.map((t) => (
          <p key={t} className="text-[10px] text-muted-foreground">{t}</p>
        ))}
      </div>
    </div>
  );
}

export function ScenarioExamplesSlide() {
  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-6xl flex-col justify-center gap-4 px-6">
      <motion.div {...fadeUp(0)}>
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Dynamic Model – Scenario Examples
        </h2>
      </motion.div>

      <motion.div {...fadeUp(0.1)}>
        <ChevronPipeline activeStep="Outputs" />
      </motion.div>

      {/* Column headers */}
      <motion.div className="grid grid-cols-4 gap-4" {...fadeUp(0.15)}>
        {["Inputs / Segment", "Market Response", "Adjustment", "Dynamic Response"].map((h) => (
          <div key={h} className="rounded-md py-1.5 text-center text-[10px] font-bold tracking-wider uppercase" style={{ backgroundColor: `${NAVY}10`, color: NAVY }}>
            {h}
          </div>
        ))}
      </motion.div>

      {/* Scenarios */}
      {SCENARIOS.map((s, si) => (
        <motion.div key={s.id} className="grid grid-cols-4 gap-4" {...fadeUp(0.2 + si * 0.1)}>
          {/* Input/Segment */}
          <ScenarioCard label={s.id} price={s.price} traits={s.traits} color={si === 0 ? NAVY : TEAL} />

          {/* Market Response */}
          <div className="flex flex-col items-center justify-center rounded-lg border p-3">
            <div className="space-y-1.5 text-center">
              <div className="flex items-center justify-center gap-2 text-xs">
                <span className="text-muted-foreground">Volume:</span>
                <span className="font-semibold" style={{ color: s.response.volume === "Down" ? RED : NAVY }}>
                  {s.response.volume}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs">
                <span className="text-muted-foreground">Win-Rate:</span>
                <span className="font-semibold" style={{ color: s.response.winRate === "Down" ? RED : GREEN }}>
                  {s.response.winRate}
                </span>
              </div>
            </div>
          </div>

          {/* Adjustment */}
          <div className="flex items-center justify-center rounded-lg border p-3">
            <span
              className="text-3xl font-bold"
              style={{ color: s.adjustment === "++" ? GREEN : RED }}
            >
              {s.adjustment}
            </span>
          </div>

          {/* Dynamic Response */}
          <ScenarioCard label={s.newId} price={s.newPrice} traits={s.newTraits} color={si === 0 ? NAVY : TEAL} />
        </motion.div>
      ))}
    </div>
  );
}
