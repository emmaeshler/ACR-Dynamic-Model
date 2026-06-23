"use client";

import { motion } from "framer-motion";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const TEAL = "#21A5D5";

const COMPLEXITY_ITEMS = [
  "Finish Type", "Material Grade", "Surface Treatment", "Edge Profile",
  "Base Thickness", "Copper Weight", "Layer Count", "Impedance Control",
  "Via Type", "Solder Mask", "Silkscreen", "Panelization",
  "Stack-up Config", "Drill Aspect Ratio", "UL Rating",
];

const KEY_INPUTS = [
  { icon: "👤", label: "Customer", items: ["End market", "Customer importance"] },
  { icon: "📦", label: "Product", items: ["Key material", "Finish material", "Thickness", "Hardware", "Quantity"] },
  { icon: "📋", label: "Deal Context", items: ["Leadtime", "Plant capacity"] },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.4 },
});

export function ResolutionAlgorithmSlide() {
  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-6xl flex-col justify-center gap-4 px-6">
      <motion.div {...fadeUp(0)}>
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Intelligent Resolution
        </h2>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Translates ambiguous customer requests into configured quotes
        </p>
      </motion.div>

      <motion.div
        className="rounded-md border border-muted px-4 py-2 text-center"
        {...fadeUp(0.1)}
      >
        <span className="text-xs font-semibold tracking-wide" style={{ color: NAVY }}>
          EXAMPLE: Specialty Parts Manufacturer
        </span>
      </motion.div>

      <div className="grid grid-cols-[1fr_auto_1fr_auto_1.5fr] items-start gap-3">
        {/* Configuration Complexity */}
        <motion.div className="rounded-lg border bg-card" {...fadeUp(0.15)}>
          <div className="rounded-t-lg border-b px-3 py-2" style={{ backgroundColor: `${NAVY}08` }}>
            <p className="text-xs font-bold tracking-wide">Configuration Complexity</p>
          </div>
          <div className="p-3">
            <p className="mb-2 text-[10px] text-muted-foreground">
              Existing logic overcomplicates configuration without improving quality of recommendation
            </p>
            <div className="flex flex-wrap gap-1">
              {COMPLEXITY_ITEMS.map((item, i) => (
                <motion.span
                  key={item}
                  className="rounded bg-muted/60 px-1.5 py-0.5 text-[9px] text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 + (i % 3) * 0.15 }}
                  transition={{ delay: 0.2 + i * 0.02 }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div className="flex items-center self-center" {...fadeUp(0.3)}>
          <svg width="32" height="32" viewBox="0 0 32 32">
            <path d="M6 16h20M21 11l5 5-5 5" fill="none" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={0.4} />
          </svg>
        </motion.div>

        {/* Key Inputs */}
        <motion.div className="rounded-lg border bg-card" {...fadeUp(0.25)}>
          <div className="rounded-t-lg border-b px-3 py-2" style={{ backgroundColor: `${TEAL}08` }}>
            <p className="text-xs font-bold tracking-wide">Define Key Inputs</p>
          </div>
          <div className="p-3">
            <p className="mb-3 text-[10px] text-muted-foreground">
              We use data science to identify key value drivers
            </p>
            <div className="space-y-2.5">
              {KEY_INPUTS.map((group) => (
                <div key={group.label} className="flex gap-2">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs" style={{ backgroundColor: `${TEAL}15` }}>
                    {group.icon}
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold">{group.label}</p>
                    <p className="text-[10px] text-muted-foreground">{group.items.join(" · ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div className="flex items-center self-center" {...fadeUp(0.35)}>
          <svg width="32" height="32" viewBox="0 0 32 32">
            <path d="M6 16h20M21 11l5 5-5 5" fill="none" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={0.4} />
          </svg>
        </motion.div>

        {/* Resolution Algorithm */}
        <motion.div className="rounded-lg border bg-card" {...fadeUp(0.35)}>
          <div className="rounded-t-lg border-b px-3 py-2" style={{ backgroundColor: `${ORANGE}08` }}>
            <p className="text-xs font-bold tracking-wide">Resolution Algorithm</p>
          </div>
          <div className="p-3">
            <p className="mb-3 text-[10px] text-muted-foreground">
              Translate ambiguous requests into configured quotes; facilitating iteration where additional context is needed
            </p>

            {/* Algorithm flow */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded border px-2 py-1 text-[10px] font-medium">Inbound Request</div>
                <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0 text-muted-foreground/40"><path d="M3 8h10M10 5l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
              </div>
              <div className="flex items-center gap-1.5">
                {["Token Extraction", "Fuzzy Match", "Variant Disambiguation"].map((step, i) => (
                  <div key={step} className="flex items-center gap-1.5">
                    <div className="rounded-md px-2 py-1 text-[9px] font-medium" style={{ backgroundColor: `${ORANGE}12`, color: ORANGE }}>
                      {step}
                    </div>
                    {i < 2 && <span className="text-[10px] text-muted-foreground">+</span>}
                  </div>
                ))}
                <span className="text-[10px] text-muted-foreground">=</span>
                <div className="rounded-md px-2 py-1 text-[9px] font-medium" style={{ backgroundColor: `${TEAL}12`, color: TEAL }}>
                  6 / 8 Inputs Identified
                </div>
              </div>
            </div>

            {/* Confidence scoring */}
            <div className="mt-3 flex items-center gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: ORANGE }}>86%</div>
                <p className="text-[9px] text-muted-foreground">Confidence</p>
              </div>
              <svg width="48" height="20" viewBox="0 0 48 20" className="shrink-0">
                <path d="M4 10h40M38 5l6 5-6 5" fill="none" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round" opacity={0.3} />
              </svg>
              <div className="flex flex-col items-center">
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="16" fill="none" stroke={TEAL} strokeWidth="2" opacity={0.2} />
                  <path d="M20 20 L20 4" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round">
                    <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="3s" repeatCount="indefinite" />
                  </path>
                </svg>
                <p className="text-[9px] text-muted-foreground">User Iteration</p>
              </div>
              <svg width="48" height="20" viewBox="0 0 48 20" className="shrink-0">
                <path d="M4 10h40M38 5l6 5-6 5" fill="none" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round" opacity={0.3} />
              </svg>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: "#2e7d32" }}>98%</div>
                <p className="text-[9px] text-muted-foreground">Confidence</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
