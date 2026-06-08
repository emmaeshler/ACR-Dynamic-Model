"use client";

const P = "#00446a";
const O = "#D97C14";
const G = "#2e7d32";

/* ── SVG: Three data streams converging into ML model ── */
function ModelBuildingVisual() {
  const sources = [
    { y: 5, label: "Client Data", sub: "Transaction history", color: P },
    { y: 55, label: "Market Signals", sub: "Competitive + demand", color: O },
    { y: 105, label: "I2P Expertise", sub: "What to look for", color: G },
  ];

  return (
    <svg viewBox="0 0 380 160" className="w-full" role="img" aria-label="Three data streams — client data, market signals, and I2P expertise — converging into an ML model">
      {sources.map((s, i) => (
        <g key={i}>
          <rect x="5" y={s.y} width="135" height="40" rx="6" fill="white" stroke={s.color} strokeWidth="2" />
          <text x="72" y={s.y + 17} fontSize="10" fill={s.color} textAnchor="middle" fontWeight="600">{s.label}</text>
          <text x="72" y={s.y + 31} fontSize="8" fill="rgba(0,0,0,0.4)" textAnchor="middle">{s.sub}</text>
          {/* Connector lines */}
          <line x1="140" y1={s.y + 20} x2="210" y2="78" stroke={s.color} strokeWidth="2" />
          <circle cx="140" cy={s.y + 20} r="3" fill={s.color} />
        </g>
      ))}
      {/* Arrow head at convergence */}
      <polygon points="207,74 213,78 207,82" fill={P} />
      {/* ML Model box */}
      <rect x="215" y="50" width="155" height="56" rx="10" fill={P} />
      <text x="292" y="73" fontSize="13" fill="white" textAnchor="middle" fontWeight="700">ML Model</text>
      <text x="292" y="90" fontSize="9" fill="rgba(255,255,255,0.7)" textAnchor="middle">Deterministic Pricing</text>
    </svg>
  );
}

/* ── Low depth ── */
export function ModelComesLow() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold tracking-tight">We combine your data, market intelligence, and our expertise.</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Three inputs produce one smart output. Your transaction history tells us what has happened.
        Market and competitive signals tell us what is happening right now. INSIGHT2PROFIT&apos;s
        industry expertise tells us what to look for — and what most companies miss. The model
        synthesizes all three into pricing recommendations no single source could produce alone.
      </p>
    </div>
  );
}

/* ── Medium depth ── */
export function ModelComesMedium() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">Three streams, one model</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        The model is only as good as what feeds it. Client transaction history provides the ground
        truth — actual prices, volumes, win/loss outcomes, and customer behavior patterns. Market
        and competitive signals add context: commodity indices, competitor price moves, supply-demand
        shifts. INSIGHT2PROFIT&apos;s expertise is the third stream — decades of pricing engagements
        encoded as feature selection, weighting heuristics, and domain-specific guardrails that
        prevent the model from learning the wrong lessons.
      </p>
      <div className="mt-4 rounded-lg border bg-muted/30 p-4">
        <ModelBuildingVisual />
      </div>
    </div>
  );
}

/* ── High depth ── */
export function ModelComesHigh() {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold tracking-tight">Feature engineering and pipeline architecture</h3>
      <div className="mt-4 rounded-lg border bg-muted/30 p-4">
        <ModelBuildingVisual />
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-semibold text-foreground">Client transaction data</strong> is the
          backbone. Raw transactions are transformed into features: price trends per SKU-customer
          pair, volume elasticity curves, seasonal patterns, order frequency distributions, and
          margin profiles at every level of the product hierarchy. We normalize across time periods
          and account for one-time events (stockpiling, contract renegotiations) that would otherwise
          skew the signal.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Market and competitive signals</strong> are
          ingested from commodity indices, public filings, distributor feeds, and third-party pricing
          databases. These become exogenous features: raw material cost deltas, competitor price
          change velocity, regional demand indicators, and supply constraint flags. The model learns
          which external signals are predictive for which product segments — steel prices matter for
          fasteners, not for chemicals.
        </p>
        <p>
          <strong className="font-semibold text-foreground">I2P expertise as training signal</strong> is
          where this differs from a generic ML pipeline. Our pricing consultants&apos; domain
          knowledge is encoded three ways: (1) feature selection — which variables to include and
          which are noise, (2) label correction — flagging historical prices that were mistakes
          rather than market-reflective, and (3) constraint functions — business rules that bound
          the model&apos;s output space (e.g., never recommend below cost, cap increases at
          contractual limits). This expertise-as-code ensures the model converges to commercially
          sound recommendations, not just statistically optimal ones.
        </p>
        <p>
          The pipeline runs as a directed acyclic graph: ingestion, cleaning, feature engineering,
          training, validation, and deployment. Each stage has quality gates. If incoming data fails
          distribution checks against the training set, the pipeline flags a potential concept drift
          and routes to human review before retraining.
        </p>
      </div>
    </div>
  );
}
