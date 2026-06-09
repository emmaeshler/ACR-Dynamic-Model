"use client";

const P = "#00446a";
const O = "#D97C14";
const G = "#2e7d32";

function StructuresVisual() {
  const structures = [
    { x: 10, label: "List & Discount", sub: "Wide variance", spread: 40, color: P },
    { x: 155, label: "Levels", sub: "Tier-governed", spread: 24, color: O },
    { x: 300, label: "Target Price", sub: "Tight precision", spread: 10, color: G },
  ];

  return (
    <svg viewBox="0 0 440 170" className="w-full" role="img" aria-label="Three pricing structures shown as cards with decreasing variance bands: List and Discount (wide), Levels (moderate), Target Price (tight)">
      {structures.map((s, i) => (
        <g key={i}>
          <rect x={s.x} y="10" width="130" height="120" rx="8" fill="white" stroke={s.color} strokeWidth="2" />
          <text x={s.x + 65} y="30" fontSize="10" fill={s.color} textAnchor="middle" fontWeight="700">{s.label}</text>
          <text x={s.x + 65} y="42" fontSize="8" fill="rgba(0,0,0,0.4)" textAnchor="middle">{s.sub}</text>

          <line x1={s.x + 20} y1="80" x2={s.x + 110} y2="80" stroke={s.color} strokeWidth="1.5" />
          <rect x={s.x + 65 - s.spread} y="60" width={s.spread * 2} height="40" rx="4" fill={s.color} opacity="0.1" />

          {Array.from({ length: 12 }, (_, j) => {
            const seed = (i * 100 + j * 17 + 7) % 97;
            const offset = ((seed / 97) - 0.5) * s.spread * 1.8;
            return (
              <circle
                key={j}
                cx={s.x + 65 + offset}
                cy={65 + (seed % 30)}
                r="3"
                fill={s.color}
                opacity="0.5"
              />
            );
          })}
        </g>
      ))}

      <line x1="148" y1="140" x2="292" y2="140" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
      <polygon points="145,140 152,137 152,143" fill="rgba(0,0,0,0.2)" />
      <polygon points="295,140 288,137 288,143" fill="rgba(0,0,0,0.2)" />
      <text x="220" y="155" fontSize="8" fill="rgba(0,0,0,0.35)" textAnchor="middle">Increasing precision</text>
    </svg>
  );
}

/* ── Low depth: Visual hero ── */
export function PricingStructuresLow() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-6">
        <StructuresVisual />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Three structures, increasing precision. The model can power any of them.
      </p>
    </div>
  );
}

/* ── Medium depth: Structures v3 hub narrative + three structures ── */
export function PricingStructuresMedium() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">The value of modeling is not replacing these structures — it&apos;s making them smarter.</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Predictive machine learning updates each pricing policy toward micro-segment norms, finding
        the &ldquo;typical&rdquo; price for each deal context. The result: fewer exceptions, tighter
        spread, more profit captured. A dynamic model creates more and better-aligned price guidance
        that captures more customer willingness to pay — each additional price point fills a gap
        under the demand curve that a rigid policy leaves on the table.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        <strong className="font-semibold text-foreground">List &amp; Discount:</strong>{" "}
        Net Price = List Price × (1 − Discount%). Products carry a list price; customers receive a
        discount off list. Simple to administer but wide variance — reps negotiate freely, creating
        the most policy exceptions. A reference policy typically has 5–10 common discounts, whereas
        a model can set 2–10× more, creating more market-relevant price points — fewer exceptions
        and more profit by matching willingness to pay.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        <strong className="font-semibold text-foreground">Levels:</strong>{" "}
        Customers and products map to discrete price tiers via a grid. The price IS the level — no
        separate list and discount. Governed and simpler, but rigid — some deals fall between tiers.
        Mid-range products get the best policy guidance; low-revenue products are neglected and
        high-revenue products face competitive pressure that overrides policy. A model corrects both.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        <strong className="font-semibold text-foreground">Target Price:</strong>{" "}
        Each deal receives a specific target price recommendation. Product, customer, and order
        attributes (20+ simultaneously) produce a unique price per deal with floor, target, and
        stretch guidance. Tightest corridor, fewest exceptions. Peer group models use 3–5 variables
        to bucket deals; an ML model uses 20+ attributes — consistent accuracy regardless of peer size.
      </p>
    </div>
  );
}

/* ── High depth: Structures v3 four stages with specific mechanics ── */
export function PricingStructuresHigh() {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold tracking-tight">Synthesize → Steer → Experiment → Optimize</h3>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-semibold text-foreground">Synthesize — Typical Price.</strong>{" "}
          A percentile-based machine learning model finds the typical price from historical
          transaction patterns, replacing rigid reference points with data-driven baselines. For
          List &amp; Discount, two models work in parallel: a <em>List Price Model</em> sets the
          typical list using product attributes (cost basis, category, competitive positioning,
          volume history — typically 8–15 attributes), while a <em>Discount Model</em> estimates
          the typical discount each customer should receive based on customer attributes (revenue
          size, industry, wallet share, tenure — typically 10–20 attributes). For Levels, a
          quantile-based model determines where price levels should sit based on natural demand
          breakpoints, and a second model assigns customers to the closest level.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Steer — Policy Aligned Price.</strong>{" "}
          The ML baseline reflects what <em>has</em> happened. Steering adjusts it toward what{" "}
          <em>should</em> happen through two channels. <em>Strategic overrides</em>: pricing
          managers review synthesized prices and adjust based on go-forward strategy. <em>Automated
          rules</em> encode recurring business logic — list price rules respond to signals like
          inventory tightness (↑ nudge list up), input cost index (↑ pass through rising costs),
          and market benchmarks (↕ align to competitive rate). Discount rules adjust for growth
          targets (↓ deepen for wallet share expansion), stable low-growth accounts (↑ tighten to
          harvest margin), over-discounted history (↑ correct deals ML typical would perpetuate),
          and churn risk (→ hold to protect at-risk renewals).
        </p>
        <p>
          <strong className="font-semibold text-foreground">Experiment — Alternative Price.</strong>{" "}
          Controlled tests measure the causal impact of price changes before rolling them out
          broadly. A subset of customers is randomly assigned a different price, and win rates,
          revenue, and retention are tracked against a holdout group at the current price. This
          isolates the effect of the price change from seasonality, rep behavior, and market
          shifts — answering &ldquo;what actually happens when we change this price?&rdquo;
          rather than inferring it from historical correlation.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Optimize — Desired Outcome.</strong>{" "}
          Causal econometric models estimate how sensitive each customer or product segment is to
          price changes — the price elasticity. Using win/loss outcomes, deal attributes, and
          experiment results, the model estimates P(win) at each price point and finds the price
          that maximizes expected profit (win probability × margin). Output: optimal price per
          segment with floor, target, and stretch guidance.
        </p>
      </div>
    </div>
  );
}
