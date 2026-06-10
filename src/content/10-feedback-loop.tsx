"use client";

import { PredictedVsActualVisual } from "@/components/visuals/predicted-vs-actual";

const P = "#00446a";
const O = "#D97C14";
const G = "#2e7d32";

/* ── SVG: Feedback loop — Detect → Analyze → Retrain → Deploy ── */
function FeedbackLoopVisual() {
  const steps = [
    { x: 160, y: 18, label: "Detect", sub: "Signal flagged", color: O },
    { x: 295, y: 80, label: "Analyze", sub: "Root cause found", color: P },
    { x: 160, y: 142, label: "Retrain", sub: "Model updated", color: G },
    { x: 25, y: 80, label: "Deploy", sub: "New prices live", color: P },
  ];

  return (
    <svg viewBox="0 0 420 190" className="w-full" role="img" aria-label="Circular feedback loop: Detect signal, Analyze root cause, Retrain model, Deploy new prices, then repeat">
      <path d="M220 30 C260 20,290 40,300 65" fill="none" stroke="#e0e0e0" strokeWidth="2" />
      <polygon points="297,62 303,68 306,60" fill="#e0e0e0" />
      <path d="M300 105 C290 130,260 150,220 150" fill="none" stroke="#e0e0e0" strokeWidth="2" />
      <polygon points="223,147 217,153 224,156" fill="#e0e0e0" />
      <path d="M110 150 C80 145,55 125,45 100" fill="none" stroke="#e0e0e0" strokeWidth="2" />
      <polygon points="48,103 42,97 39,105" fill="#e0e0e0" />
      <path d="M45 65 C55 40,80 22,110 20" fill="none" stroke="#e0e0e0" strokeWidth="2" />
      <polygon points="107,17 113,23 114,16" fill="#e0e0e0" />

      {steps.map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={s.y} width="110" height="40" rx="8" fill="white" stroke={s.color} strokeWidth="2" />
          <text x={s.x + 55} y={s.y + 17} fontSize="11" fill={s.color} textAnchor="middle" fontWeight="700">{s.label}</text>
          <text x={s.x + 55} y={s.y + 31} fontSize="8" fill="rgba(0,0,0,0.4)" textAnchor="middle">{s.sub}</text>
        </g>
      ))}

      <text x="195" y="86" fontSize="9" fill="rgba(0,0,0,0.3)" textAnchor="middle" fontWeight="500">Continuous</text>
      <text x="195" y="98" fontSize="9" fill="rgba(0,0,0,0.3)" textAnchor="middle" fontWeight="500">improvement</text>

      <text x="195" y="180" fontSize="7" fill="rgba(0,0,0,0.35)" textAnchor="middle">Every override, market shift, and outcome feeds the next cycle</text>
    </svg>
  );
}

/* ── Low depth: Visual hero + short caption ── */
export function FeedbackLoopLow() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-6">
        <FeedbackLoopVisual />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        It learns from every outcome and gets smarter over time.
      </p>
    </div>
  );
}

/* ── Medium depth: Narrative explanation ── */
export function FeedbackLoopMedium() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold tracking-tight">Every quote teaches the model.</h3>

      <div className="rounded-lg border bg-muted/30 p-4">
        <PredictedVsActualVisual />
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        A price goes out. The deal wins or loses — and the model sees the outcome. Predicted margin
        and win rate meet actual results — and the model adjusts. The orange dots show what the
        model predicted. The teal dots show what actually happened. Every gap is a learning signal.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Your goals change too. This year you&apos;re growing share. Next year you&apos;re harvesting
        margin. The same engine repoints — you change the objective, not the model. Early on,
        recommendations carry wider uncertainty. With each cycle, confidence intervals narrow.
        Fewer prices need manual adjustment — tighter bands, higher confidence, ready to approve.
      </p>
    </div>
  );
}

/* ── High depth ── */
export function FeedbackLoopHigh() {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold tracking-tight">Retraining pipeline, concept drift, and validation</h3>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-semibold text-foreground">Retraining pipeline.</strong>{" "}
          Retraining is triggered by two mechanisms: scheduled (weekly or biweekly) and event-driven
          (when monitoring detects a statistically significant distribution shift). A champion-challenger
          framework compares the retrained model against production on key metrics before promotion.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Concept drift handling.</strong>{" "}
          We detect concept drift through Population Stability Index (PSI) on feature distributions
          and Kolmogorov-Smirnov tests on prediction residuals. Mild drift triggers accelerated
          retraining. Severe drift (PSI above 0.25) triggers a full model rebuild with expanded
          feature selection.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Human overrides as training signal.</strong>{" "}
          When a rep overrides a recommendation and the deal closes, that override encodes domain
          knowledge the model lacked. We capture direction, magnitude, reason, and outcome. These
          become labeled training examples with higher weight in the next cycle. Over time, systematic
          overrides signal a blind spot — the model learns the pattern and override rate drops.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Improving precision.</strong>{" "}
          Margin capture rate typically improves from 60-65% in cycle one to 80-90% by cycle four.
          Override rate drops from 40-50% initially to 10-15% at maturity. Every recommendation
          ships with a 90% prediction interval that narrows from 8-12% of price early on to 2-4%
          at maturity.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Controlled experimentation.</strong>{" "}
          The highest-quality learning signal comes from controlled experiments — randomly varying
          prices on customer subsets and measuring outcomes against holdout groups. This gives the
          model causally clean data rather than relying solely on observational patterns. Experiments
          isolate the effect of a price change from seasonality, rep behavior, and market shifts,
          answering &ldquo;what actually happens when we change this price?&rdquo; rather than
          inferring it from historical correlation. Experiment results feed directly into the
          retraining pipeline with elevated weight.
        </p>
      </div>
    </div>
  );
}
