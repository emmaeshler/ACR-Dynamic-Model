"use client";

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
    <svg viewBox="0 0 370 190" className="w-full" role="img" aria-label="Circular feedback loop: Detect signal, Analyze root cause, Retrain model, Deploy new prices, then repeat">
      {/* Circular arrows connecting steps */}
      <path d="M220 30 C260 20,290 40,300 65" fill="none" stroke="#e0e0e0" strokeWidth="2" />
      <polygon points="297,62 303,68 306,60" fill="#e0e0e0" />
      <path d="M300 105 C290 130,260 150,220 150" fill="none" stroke="#e0e0e0" strokeWidth="2" />
      <polygon points="223,147 217,153 224,156" fill="#e0e0e0" />
      <path d="M110 150 C80 145,55 125,45 100" fill="none" stroke="#e0e0e0" strokeWidth="2" />
      <polygon points="48,103 42,97 39,105" fill="#e0e0e0" />
      <path d="M45 65 C55 40,80 22,110 20" fill="none" stroke="#e0e0e0" strokeWidth="2" />
      <polygon points="107,17 113,23 114,16" fill="#e0e0e0" />

      {/* Step boxes */}
      {steps.map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={s.y} width="110" height="40" rx="8" fill="white" stroke={s.color} strokeWidth="2" />
          <text x={s.x + 55} y={s.y + 17} fontSize="11" fill={s.color} textAnchor="middle" fontWeight="700">{s.label}</text>
          <text x={s.x + 55} y={s.y + 31} fontSize="8" fill="rgba(0,0,0,0.4)" textAnchor="middle">{s.sub}</text>
        </g>
      ))}

      {/* Center label */}
      <text x="185" y="86" fontSize="9" fill="rgba(0,0,0,0.3)" textAnchor="middle" fontWeight="500">Continuous</text>
      <text x="185" y="98" fontSize="9" fill="rgba(0,0,0,0.3)" textAnchor="middle" fontWeight="500">improvement</text>

      <text x="185" y="180" fontSize="7" fill="rgba(0,0,0,0.35)" textAnchor="middle">Every override, market shift, and outcome feeds the next cycle</text>
    </svg>
  );
}

/* ── Low depth: Visual hero + short caption ── */
export function LessonLow() {
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
export function LessonMedium() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">The feedback loop that drives improvement</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        This is the core value of the system. Every deal closed, every deal lost, every price
        override by a rep, every market shift — all of it feeds back into the model. The next
        cycle&apos;s recommendations are better because they incorporate what happened in the last one.
        It&apos;s a compounding advantage that widens over time.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        The cycle runs continuously. When a signal is detected, analysts investigate and confirm
        the root cause. The model retrains on the updated data, incorporating the new pattern.
        Updated recommendations deploy. When a salesperson adjusts a recommended price and wins
        the deal, that outcome teaches the model something it didn&apos;t know. The overrides
        aren&apos;t errors — they&apos;re training data.
      </p>
    </div>
  );
}

/* ── High depth ── */
export function LessonHigh() {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold tracking-tight">Retraining pipeline and concept drift handling</h3>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-semibold text-foreground">Retraining pipeline.</strong>{" "}
          Retraining is triggered by two mechanisms: scheduled (weekly or biweekly cadence) and
          event-driven (when monitoring detects a statistically significant distribution shift in
          key features or outcomes). The pipeline ingests all new transaction data since the last
          training run, re-engineers features, retrains the ensemble, and validates against a
          held-out test set that is refreshed each cycle. A champion-challenger framework compares
          the retrained model against the current production model on key metrics before promotion.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Concept drift handling.</strong>{" "}
          Concept drift — when the statistical relationship between features and optimal price
          changes over time — is the primary risk to model accuracy. We detect it through
          Population Stability Index (PSI) on feature distributions and Kolmogorov-Smirnov tests
          on prediction residuals. Mild drift triggers accelerated retraining. Severe drift — a
          PSI above 0.25 on critical features — triggers a full model rebuild with expanded
          feature selection, because the old feature set may no longer be predictive.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Human overrides as training signal.</strong>{" "}
          When a sales rep overrides a model recommendation and the deal closes, that override
          encodes domain knowledge the model lacked. We capture overrides with metadata —
          the direction (up/down), magnitude, stated reason, and outcome. These become labeled
          training examples with higher weight in the next training cycle. Over time, systematic
          overrides in a segment signal a blind spot: the model learns the pattern and the override
          rate drops.
        </p>
      </div>
    </div>
  );
}
