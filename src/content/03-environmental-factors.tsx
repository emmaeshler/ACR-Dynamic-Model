"use client";

const P = "#00446a";
const O = "#D97C14";

function CompetitorCloudVisual() {
  let seed = 17;
  function rand() {
    seed = (seed * 16807 + 0) % 2147483647;
    return seed / 2147483647;
  }
  const competitors: [number, number][] = [];
  for (let i = 0; i < 28; i++) {
    competitors.push([80 + rand() * 300, 40 + rand() * 80]);
  }

  return (
    <svg viewBox="0 0 440 170" className="w-full" role="img" aria-label="Your price point at $4.84 shown against a cloud of 28 competitor quotes sitting lower, revealing your price is above market">
      <line x1="30" y1="10" x2="30" y2="140" stroke="#e0e0e0" strokeWidth="1" />
      <line x1="30" y1="140" x2="420" y2="140" stroke="#e0e0e0" strokeWidth="1" />
      <text x="14" y="78" fontSize="9" fill="rgba(0,0,0,0.35)" textAnchor="middle" transform="rotate(-90,14,78)">Price</text>

      {competitors.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={P} opacity="0.25" />
      ))}

      <rect x="295" y="20" width="110" height="20" rx="4" fill="rgba(0,0,0,0.04)" />
      <text x="350" y="34" fontSize="9" fill="rgba(0,0,0,0.4)" textAnchor="middle">Competitor cloud</text>

      <line x1="50" y1="28" x2="400" y2="28" stroke={O} strokeWidth="2" strokeDasharray="6 3" />
      <circle cx="210" cy="28" r="7" fill={O} />
      <text x="210" y="18" fontSize="10" fill={O} textAnchor="middle" fontWeight="600">Your $4.84</text>

      <line x1="210" y1="35" x2="210" y2="70" stroke="#c62828" strokeWidth="1.5" strokeDasharray="3 2" />
      <text x="210" y="84" fontSize="9" fill="#c62828" textAnchor="middle" fontWeight="500">Gap</text>

      <line x1="100" y1="162" x2="116" y2="162" stroke={O} strokeWidth="2.5" strokeDasharray="4 2" />
      <text x="120" y="166" fontSize="8" fill="rgba(0,0,0,0.5)">Your price</text>
      <circle cx="200" cy="162" r="4" fill={P} opacity="0.3" />
      <text x="208" y="166" fontSize="8" fill="rgba(0,0,0,0.5)">Competitor quotes (28)</text>
    </svg>
  );
}

/* ── Low depth: Visual hero ── */
export function EnvFactorsLow() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-6">
        <CompetitorCloudVisual />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Inside your four walls the price looks optimal. Then you see where competitors landed.
      </p>
    </div>
  );
}

/* ── Medium depth: Story v2 EF beats 6-9 ── */
export function EnvFactorsMedium() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">Your price needs context the market provides.</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        On its own, $4.84 looks like a healthy price — solid margin, steady win rate. Nothing
        inside your own numbers says otherwise. But drop the competitor price cloud onto the same
        axis — 28 quotes for the same SKU — and your $4.84 is sitting well above where the market
        actually settled. Same number, different position.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        The model watches three external feeds continuously: competitor prices, input costs, and
        market indices — including published benchmarks like the Producer Price Index. Together they
        turn a number from &ldquo;optimal&rdquo; into &ldquo;optimal for what the world looks like
        today.&rdquo; When a competitor cuts and the whole market band slides down, your price
        re-anchors automatically — no rebuild, no project, no waiting on a quarterly refresh.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        These signals translate directly into automated pricing rules. When inventory tightness
        rises, the model nudges list prices up to protect margin on scarce items. When input costs
        spike — raw materials, freight, components — the increase passes through to pricing
        automatically. When a market benchmark shifts, affected product prices realign without
        manual intervention.
      </p>
    </div>
  );
}

/* ── High depth ── */
export function EnvFactorsHigh() {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold tracking-tight">External signal ingestion and auto-retune</h3>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-semibold text-foreground">Signal sources.</strong>{" "}
          Three categories of external data feed the model: (1) competitor pricing from web scrapes,
          distributor feeds, and third-party databases, (2) input cost indices — PPI, commodity
          spot prices, freight rate benchmarks, and (3) macro indicators — GDP growth, housing
          starts, manufacturing PMI — that correlate with demand in specific verticals.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Relevance filtering.</strong>{" "}
          Not every signal matters for every product. The model learns which external variables are
          predictive for which product segments through Granger causality testing. Steel prices
          correlate with fastener pricing; they&apos;re noise for chemical products. Only signals
          that pass predictive validation are retained per segment.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Auto-retune mechanics.</strong>{" "}
          When an external signal moves beyond its normal range (2+ standard deviations from its
          30-day mean), the model triggers an accelerated retune cycle. Feature weights shift to
          reflect the new market condition, and price recommendations update within 24-48 hours.
          No full model rebuild is required — only the affected feature coefficients are re-estimated.
        </p>
      </div>
    </div>
  );
}
