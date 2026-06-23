"use client";

import { motion } from "framer-motion";
import { ChevronPipeline } from "./chevron-pipeline";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const TEAL = "#21A5D5";
const GREEN = "#2e7d32";

const INPUTS = [
  { label: "Internal Data", color: NAVY },
  { label: "External Data", color: TEAL },
  { label: "INSIGHT Industry Expertise", color: ORANGE },
  { label: "Business Expertise", color: GREEN },
];

const SEGMENTS = [
  { label: "Customer", dots: [[40,35],[55,45],[35,50],[50,30],[60,55]] },
  { label: "Consumption", dots: [[40,35],[30,50],[55,40],[45,55],[35,30]] },
  { label: "Deal Context", dots: [[50,30],[40,45],[55,55],[35,35],[60,45]] },
];

const PARAM_ROWS = [
  { lever: "Customer Importance", a: "+2.5%", b: "–", c: "–" },
  { lever: "Product Importance", a: "–", b: "–3.0%", c: "+1.2%" },
  { lever: "Volume Trend", a: "–1.7%", b: "+2.3%", c: "–" },
  { lever: "End Market", a: "+3.4%", b: "–", c: "–2.6%" },
];

const OUTPUT_ROWS = [
  { seg: "A", price: "$17.96", winRate: "%" },
  { seg: "B", price: "$16.73", winRate: "" },
  { seg: "C", price: "$18.44", winRate: "" },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay, duration: 0.4 },
});

export function FullPipelineSlide() {
  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-6xl flex-col justify-center gap-4 px-6">
      <motion.div {...fadeUp(0)}>
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Dynamic Model
        </h2>
      </motion.div>

      <motion.div {...fadeUp(0.1)}>
        <ChevronPipeline />
      </motion.div>

      <div className="grid grid-cols-[0.8fr_1.2fr_1.2fr_0.8fr] gap-3">
        {/* INPUTS */}
        <motion.div className="space-y-2" {...fadeUp(0.15)}>
          {INPUTS.map((inp) => (
            <div key={inp.label} className="rounded-lg border p-2.5" style={{ borderLeftWidth: 3, borderLeftColor: inp.color }}>
              <p className="text-[10px] font-semibold">{inp.label}</p>
            </div>
          ))}
        </motion.div>

        {/* SEGMENTATION */}
        <motion.div className="rounded-lg border p-3" {...fadeUp(0.25)}>
          <div className="grid grid-cols-3 gap-2">
            {SEGMENTS.map((seg) => (
              <div key={seg.label} className="text-center">
                <svg viewBox="0 0 80 70" className="mx-auto w-full max-w-[80px]">
                  {seg.dots.map(([cx, cy], i) => (
                    <motion.circle
                      key={i}
                      cx={cx} cy={cy} r={5}
                      fill={[NAVY, TEAL, ORANGE][SEGMENTS.indexOf(seg)]}
                      fillOpacity={0.5}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.35 + i * 0.04 }}
                    />
                  ))}
                  <circle cx={45} cy={42} r={22} fill="none" stroke={[NAVY, TEAL, ORANGE][SEGMENTS.indexOf(seg)]} strokeWidth={0.8} strokeOpacity={0.2} strokeDasharray="3 2" />
                </svg>
                <p className="mt-1 text-[9px] font-semibold text-muted-foreground">{seg.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* PARAMETERS */}
        <motion.div className="rounded-lg border p-3" {...fadeUp(0.35)}>
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b">
                <th className="py-1 text-left font-semibold text-muted-foreground">Lever</th>
                <th className="py-1 text-center font-semibold" style={{ color: NAVY }}>A</th>
                <th className="py-1 text-center font-semibold" style={{ color: TEAL }}>B</th>
                <th className="py-1 text-center font-semibold" style={{ color: ORANGE }}>C</th>
              </tr>
            </thead>
            <tbody>
              {PARAM_ROWS.map((row) => (
                <tr key={row.lever} className="border-b border-muted/30">
                  <td className="py-1 font-medium">{row.lever}</td>
                  <td className="py-1 text-center">{row.a}</td>
                  <td className="py-1 text-center">{row.b}</td>
                  <td className="py-1 text-center">{row.c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* OUTPUTS */}
        <motion.div className="rounded-lg border p-3" {...fadeUp(0.45)}>
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b">
                <th className="py-1 text-left font-semibold text-muted-foreground">Seg</th>
                <th className="py-1 text-center font-semibold">Price Reco</th>
                <th className="py-1 text-center font-semibold">P. Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {OUTPUT_ROWS.map((row, i) => (
                <tr key={row.seg} className="border-b border-muted/30">
                  <td className="py-1 font-bold" style={{ color: [NAVY, TEAL, ORANGE][i] }}>{row.seg}</td>
                  <td className="py-1 text-center font-medium">{row.price}</td>
                  <td className="py-1 text-center">{row.winRate}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Feedback arrow hint */}
          <motion.div
            className="mt-3 flex items-center gap-1 text-[9px] text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M12 4v6a2 2 0 01-2 2H6M6 12l-3-3 3-3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Outcomes retrain model
          </motion.div>
        </motion.div>
      </div>

      {/* Strategic guidance bar */}
      <motion.div
        className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-2.5"
        {...fadeUp(0.55)}
      >
        <span className="rounded-md bg-[#00446A] px-3 py-1 text-[10px] font-semibold text-white">
          + Strategic Guidance
        </span>
        <span className="text-xs text-muted-foreground">Commercially Viable Segments</span>
        <span className="mx-1 text-muted-foreground/40">·</span>
        <span className="text-xs text-muted-foreground">Priority Aligned Parameters</span>
        <span className="mx-1 text-muted-foreground/40">·</span>
        <span className="text-xs text-muted-foreground">Intelligent Market Response</span>
      </motion.div>
    </div>
  );
}
