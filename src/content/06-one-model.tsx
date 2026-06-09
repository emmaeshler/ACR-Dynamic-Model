"use client";

const P = "#00446a";
const O = "#D97C14";
const G = "#2e7d32";
const BLUE = "#1B4F8A";

/* ── SVG: Four data streams converging into ML model ── */
function ConvergenceVisual() {
  const sources = [
    { y: 2, label: "Data Driven Insights", sub: "Transaction history", color: P },
    { y: 42, label: "Environmental Factors", sub: "Competitive + demand", color: O },
    { y: 82, label: "Industry Expertise", sub: "What to look for", color: G },
    { y: 122, label: "Your In-House Expertise", sub: "Rules + strategy", color: BLUE },
  ];

  return (
    <svg viewBox="0 0 420 180" className="w-full" role="img" aria-label="Four data streams — DDI, Environmental Factors, Industry Expertise, and In-House Expertise — converging into one ML model">
      {sources.map((s, i) => (
        <g key={i}>
          <rect x="5" y={s.y} width="155" height="34" rx="6" fill="white" stroke={s.color} strokeWidth="2" />
          <text x="82" y={s.y + 14} fontSize="9" fill={s.color} textAnchor="middle" fontWeight="600">{s.label}</text>
          <text x="82" y={s.y + 26} fontSize="7.5" fill="rgba(0,0,0,0.4)" textAnchor="middle">{s.sub}</text>
          <line x1="160" y1={s.y + 17} x2="240" y2="88" stroke={s.color} strokeWidth="2" />
          <circle cx="160" cy={s.y + 17} r="3" fill={s.color} />
        </g>
      ))}
      <polygon points="237,84 243,88 237,92" fill={P} />
      <rect x="245" y="60" width="165" height="56" rx="10" fill={P} />
      <text x="327" y="83" fontSize="13" fill="white" textAnchor="middle" fontWeight="700">ML Model</text>
      <text x="327" y="100" fontSize="9" fill="rgba(255,255,255,0.7)" textAnchor="middle">Deterministic Pricing</text>
    </svg>
  );
}

/* ── Low depth: Visual hero + short caption ── */
export function OneModelLow() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-6">
        <ConvergenceVisual />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Four inputs — your data, the market, our expertise, and your strategy — produce one smart output.
      </p>
    </div>
  );
}

/* ── Medium depth: Narrative explanation ── */
export function OneModelMedium() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">We combine four distinct inputs into a single model.</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Your transaction history tells us what has happened. Market and competitive signals tell us
        what is happening right now. INSIGHT2PROFIT&apos;s industry expertise tells us what to look
        for — and what most companies miss. Your in-house rules and strategy bend the output to fit
        how you run the business. The model synthesizes all four into pricing recommendations no
        single source could produce alone.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Each input enriches the others. Data alone misses context. Market signals alone miss your
        specific cost structure. Our expertise alone can&apos;t account for your unique constraints.
        Your rules alone don&apos;t optimize. Together, the model captures what any single
        perspective would miss.
      </p>
    </div>
  );
}

/* ── High depth ── */
export function OneModelHigh() {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold tracking-tight">Feature engineering and pipeline architecture</h3>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-semibold text-foreground">Client transaction data</strong> is the
          backbone. Raw transactions are transformed into features: price trends per SKU-customer
          pair, volume elasticity curves, seasonal patterns, order frequency distributions, and
          margin profiles at every level of the product hierarchy.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Market and competitive signals</strong> are
          ingested from commodity indices, public filings, distributor feeds, and third-party pricing
          databases. The model learns which external signals are predictive for which product
          segments — steel prices matter for fasteners, not for chemicals.
        </p>
        <p>
          <strong className="font-semibold text-foreground">I2P expertise as training signal</strong> is
          encoded three ways: (1) feature selection — which variables to include, (2) label
          correction — flagging historical prices that were mistakes, and (3) constraint
          functions — business rules that bound the model&apos;s output space.
        </p>
        <p>
          <strong className="font-semibold text-foreground">In-house expertise as guardrails</strong>{" "}
          defines the operating envelope: MAP constraints, contractual floors and ceilings, strategic
          pricing tiers, and customer-specific rules. These are encoded as hard constraints in the
          optimization, not soft suggestions the model can ignore.
        </p>
        <p>
          The pipeline runs as a directed acyclic graph: ingestion, cleaning, feature engineering,
          training, validation, and deployment. Each stage has quality gates. If incoming data fails
          distribution checks, the pipeline flags potential concept drift and routes to human review.
        </p>
      </div>
    </div>
  );
}
