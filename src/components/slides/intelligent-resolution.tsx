"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const TEAL = "#21A5D5";
const GREEN = "#2e7d32";

export const RESOLUTION_TOTAL_STEPS = 4;

interface NarrativeSegment {
  text: string;
  bold?: boolean;
  color?: string;
  underline?: boolean;
}

const STEP_NARRATIVES: NarrativeSegment[][] = [
  [
    { text: "A real customer email arrives — " },
    { text: "ambiguous product descriptions", bold: true, color: ORANGE, underline: true },
    { text: ", " },
    { text: "non-standard formats", bold: true, color: TEAL, underline: true },
    { text: ", " },
    { text: "shorthand only an insider would recognize", bold: true, color: NAVY, underline: true },
    { text: "." },
  ],
  [
    { text: "The AI agent dissects every token — " },
    { text: "normalizing units", bold: true, color: ORANGE },
    { text: ", " },
    { text: "resolving aliases", bold: true, color: TEAL },
    { text: ", and " },
    { text: "matching against the product master", bold: true, color: NAVY },
    { text: " in real time." },
  ],
  [
    { text: "Ambiguity resolved. A " },
    { text: "verified, configured quote", bold: true, color: GREEN, underline: true },
    { text: " — ready to send." },
  ],
];

function HighlightNarrative({ segments, isIntro }: { segments: NarrativeSegment[]; isIntro: boolean }) {
  return (
    <span>
      {segments.map((seg, si) => {
        if (!seg.bold) {
          return <span key={si}>{seg.text}</span>;
        }
        return (
          <span key={si} className="relative inline">
            <motion.span
              style={{ fontWeight: 700, color: seg.color || NAVY }}
              initial={{ opacity: isIntro ? 0.4 : 1 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: isIntro ? 0.4 + si * 0.15 : 0 }}
            >
              {seg.text}
            </motion.span>
            {seg.underline && isIntro && (
              <motion.span
                className="absolute bottom-0 left-0 h-[2px] rounded-full"
                style={{ backgroundColor: seg.color || NAVY }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.6, delay: 0.6 + si * 0.15, ease: "easeOut" }}
              />
            )}
          </span>
        );
      })}
    </span>
  );
}

interface Annotation {
  id: string;
  text: string;
  title: string;
  detail: string;
  color: string;
  delay: number;
}

const ANNOTATIONS: Annotation[] = [
  { id: "insulator", text: "INSULATOR", title: "Token Extraction", detail: "Product type identified → STANDOFF (Rigid Insulation)", color: TEAL, delay: 0.2 },
  { id: "voltage", text: "2.7KV", title: "Unit Normalization", detail: "Non-standard unit → 2700V (catalog format)", color: ORANGE, delay: 0.8 },
  { id: "thread", text: "3/8-16", title: "Fuzzy SKU Lookup", detail: "Ambiguous spec → 3/8×16×9/16 (thread matched)", color: NAVY, delay: 1.4 },
  { id: "vendor", text: "MAR-BAL", title: "Vendor Resolution", detail: "Shorthand → MAR-BAL INC. (verified vendor)", color: TEAL, delay: 2.0 },
  { id: "variant", text: "R4225-S5", title: "Variant Disambiguation", detail: "S5 suffix → A5 (metric variant rejected)", color: GREEN, delay: 2.6 },
];

function HighlightedToken({
  annotation,
  active,
}: {
  annotation: Annotation;
  active: boolean;
}) {
  return (
    <motion.span
      className="relative inline-block rounded px-0.5 font-semibold"
      animate={{
        backgroundColor: active ? `${annotation.color}20` : "transparent",
        color: active ? annotation.color : "inherit",
        borderBottom: active ? `2px solid ${annotation.color}` : "2px solid transparent",
      }}
      transition={{ duration: 0.7, delay: active ? annotation.delay : 0 }}
    >
      {annotation.text}
    </motion.span>
  );
}

function EmailCard({ step, analyzing }: { step: number; analyzing: boolean }) {

  const token = (a: Annotation) => (
    <HighlightedToken annotation={a} active={analyzing} />
  );

  return (
    <div className="w-full max-w-xl rounded-xl border bg-card shadow-sm">
      <div
        className="flex items-center gap-2 rounded-t-xl border-b px-4 py-2.5"
        style={{ backgroundColor: `${NAVY}08` }}
      >
        <span className="text-sm">📧</span>
        <span className="text-xs font-bold tracking-wide" style={{ color: NAVY }}>
          INBOUND QUOTE REQUEST
        </span>
      </div>
      <div className="space-y-2 p-3.5">
        <div className="flex gap-6 text-xs">
          <span><span className="font-semibold text-muted-foreground">FROM:</span> buyer@industrialco.com</span>
          <span><span className="font-semibold text-muted-foreground">SUBJ:</span> Quote Request — Insulators</span>
        </div>

        <div className="rounded-lg bg-slate-50 p-3.5 text-sm leading-[1.8] text-foreground/80">
          <p className="italic text-muted-foreground">
            &ldquo;I need price for the following:&rdquo;
          </p>
          <div className="mt-2 space-y-0.5 font-mono text-sm">
            <p>
              {token(ANNOTATIONS[0])},{" "}
              {token(ANNOTATIONS[1])},{" "}
              {token(ANNOTATIONS[2])}
            </p>
            <p>
              {token(ANNOTATIONS[3])},{" "}
              {token(ANNOTATIONS[4])}
            </p>
          </div>
          <p className="mt-3 text-xs italic text-muted-foreground">
            Quote quantities: 1 / 5 / 10 / 25 / 50 / 100
          </p>
        </div>

        <AnimatePresence>
          {step === 0 && !analyzing && (
            <motion.div
              className="rounded-lg bg-amber-50 px-3.5 py-2 text-[11px] dark:bg-amber-950/30"
              exit={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="font-bold text-amber-700">⚠ RESOLUTION CHALLENGES</span>
              <p className="mt-0.5 text-muted-foreground">
                2.7KV ≠ catalog format · 3/8-16 ambiguous · Suffix variant (S5 vs A5)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AnnotationCards() {
  return (
    <div className="grid w-full max-w-4xl grid-cols-5 gap-2.5">
      {ANNOTATIONS.map((a) => (
        <motion.div
          key={a.id}
          className="rounded-lg border bg-white p-3 shadow-sm"
          style={{ borderTopWidth: 3, borderTopColor: a.color }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: a.delay + 0.3, duration: 0.6 }}
        >
          <p className="text-xs font-bold" style={{ color: a.color }}>
            {a.title}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            {a.detail}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function ConnectorArrows() {
  return (
    <div className="flex w-full max-w-xl justify-around py-1">
      {ANNOTATIONS.map((a) => (
        <motion.div
          key={a.id}
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: a.delay + 0.2, duration: 0.5 }}
        >
          <svg width="2" height="20" className="overflow-visible">
            <motion.line
              x1="1" y1="0" x2="1" y2="20"
              stroke={a.color}
              strokeWidth={1.5}
              strokeDasharray="3 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: a.delay + 0.2, duration: 0.5 }}
            />
            <motion.polygon
              points="-3,20 1,26 5,20"
              fill={a.color}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: a.delay + 0.5 }}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function ConfiguredQuote() {
  return (
    <motion.div
      className="w-full max-w-2xl rounded-xl border bg-card shadow-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="flex items-center justify-between rounded-t-xl border-b px-5 py-3"
        style={{ backgroundColor: `${GREEN}08` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">✅</span>
          <span className="text-xs font-bold tracking-wide" style={{ color: GREEN }}>
            CONFIGURED QUOTE — READY TO SEND
          </span>
        </div>
        <motion.span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
          style={{ backgroundColor: `${GREEN}15`, color: GREEN }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          HIGH CONFIDENCE
        </motion.span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Prepared for
            </p>
            <p className="text-sm font-bold" style={{ color: NAVY }}>
              Industrial Co. — buyer@industrialco.com
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Matched SKU
            </p>
            <p className="text-base font-bold tracking-wide" style={{ color: NAVY }}>
              STAOFFR4225A5
            </p>
          </div>
        </div>

        <motion.div
          className="mt-4 rounded-lg bg-slate-50 p-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Resolved Product
          </p>
          <p className="mt-1 text-sm" style={{ color: NAVY }}>
            STANDOFF, Rigid Insulation, R4225, 2700V, 2.25&quot;H, 3/8×16×9/16
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Vendor: MAR-BAL INC. &nbsp;·&nbsp; Model: R4225A5 (variant S5→A5 resolved)
          </p>
        </motion.div>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Quantity Pricing
          </p>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-[11px]">
              <thead>
                <tr style={{ backgroundColor: `${NAVY}06` }}>
                  <th className="px-3 py-2 text-left font-semibold" style={{ color: NAVY }}>Qty</th>
                  <th className="px-3 py-2 text-right font-semibold" style={{ color: NAVY }}>Unit Price</th>
                  <th className="px-3 py-2 text-right font-semibold" style={{ color: NAVY }}>Ext. Price</th>
                  <th className="px-3 py-2 text-right font-semibold" style={{ color: NAVY }}>Discount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { qty: 1, unit: "$124.50", ext: "$124.50", disc: "—" },
                  { qty: 5, unit: "$118.28", ext: "$591.38", disc: "5%" },
                  { qty: 10, unit: "$112.05", ext: "$1,120.50", disc: "10%" },
                  { qty: 25, unit: "$105.83", ext: "$2,645.63", disc: "15%" },
                  { qty: 50, unit: "$99.60", ext: "$4,980.00", disc: "20%" },
                  { qty: 100, unit: "$93.38", ext: "$9,337.50", disc: "25%" },
                ].map((row, i) => (
                  <motion.tr
                    key={row.qty}
                    className="border-t"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.06 }}
                  >
                    <td className="px-3 py-1.5 font-medium">{row.qty}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums">{row.unit}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums">{row.ext}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">{row.disc}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          className="mt-4 flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {ANNOTATIONS.map((a) => (
            <span
              key={a.id}
              className="rounded-full px-2 py-0.5 text-[9px] font-semibold"
              style={{ backgroundColor: `${a.color}12`, color: a.color }}
            >
              {a.title} ✓
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function IntelligentResolutionSlide({ step = 0 }: { step: number }) {
  // step 0: subtitle only
  // step 1: email card appears
  // step 2: analysis annotations
  // step 3: resolved quote
  const analyzing = step >= 2;
  const narrativeStep = Math.min(step, 2);
  const segments = STEP_NARRATIVES[narrativeStep];
  const introPhase = step === 0;

  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-6xl flex-col items-center gap-2 px-6 pt-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2
          className="text-center text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ color: NAVY }}
        >
          Intelligent Resolution
        </h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={narrativeStep}
            className="mx-auto mt-1 max-w-2xl text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HighlightNarrative segments={segments} isIntro={introPhase} />
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Main content */}
      <div className="flex w-full flex-1 items-start justify-center overflow-hidden pt-2">
        <AnimatePresence mode="wait">
          {step <= 2 ? (
            <motion.div
              key="analysis"
              className="flex w-full flex-col items-center gap-1"
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {step >= 1 && (
                <EmailCard step={step} analyzing={analyzing} />
              )}

              {analyzing && (
                <motion.div
                  className="flex w-full flex-col items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <ConnectorArrows />
                  <AnnotationCards />
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="quote"
              className="flex w-full items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ConfiguredQuote />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
