"use client";

const P = "#00446a";

/* ── SVG: Static pricing vs dynamic market ── */
function ProblemVisual() {
  const market =
    "M55 130 C95 95,140 55,180 65 S240 110,270 82 S320 30,360 40 S410 62,430 50";
  const staticY = 100;
  const gapFill = `M55 ${staticY} C95 95,140 55,180 65 S240 110,270 82 S320 30,360 40 S410 62,430 50 L430 ${staticY} Z`;

  return (
    <svg viewBox="0 0 470 195" className="w-full" role="img" aria-label="Chart showing market price fluctuating while your price stays flat, highlighting lost value">
      {/* Y-axis */}
      <line x1="50" y1="10" x2="50" y2="160" stroke="#e0e0e0" strokeWidth="1" />
      <text x="15" y="90" fontSize="10" fill="rgba(0,0,0,0.4)" textAnchor="middle" fontWeight="500" transform="rotate(-90,15,90)">Price</text>
      {/* X-axis */}
      <line x1="50" y1="160" x2="445" y2="160" stroke="#e0e0e0" strokeWidth="1" />
      <text x="248" y="175" fontSize="10" fill="rgba(0,0,0,0.4)" textAnchor="middle" fontWeight="500">Time</text>

      {/* Gap fill */}
      <path d={gapFill} fill="#c62828" opacity="0.1" />

      {/* Market line */}
      <path d={market} fill="none" stroke={P} strokeWidth="3" />
      {[
        [55, 130], [120, 72], [180, 65], [240, 100], [270, 82],
        [320, 30], [360, 40], [410, 56], [430, 50],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={P} />
      ))}

      {/* Static price line */}
      <line x1="55" y1={staticY} x2="430" y2={staticY} stroke="#c62828" strokeWidth="3" strokeDasharray="8 5" />

      {/* Gap callout */}
      <line x1="360" y1="40" x2="360" y2={staticY} stroke="#c62828" strokeWidth="1.5" />
      <line x1="354" y1="40" x2="366" y2="40" stroke="#c62828" strokeWidth="1.5" />
      <line x1="354" y1={staticY} x2="366" y2={staticY} stroke="#c62828" strokeWidth="1.5" />
      <text x="382" y="65" fontSize="11" fill="#c62828" fontWeight="600">Lost</text>
      <text x="382" y="78" fontSize="11" fill="#c62828" fontWeight="600">value</text>

      {/* Legend */}
      <line x1="130" y1="188" x2="150" y2="188" stroke={P} strokeWidth="3" />
      <text x="155" y="192" fontSize="9" fill="rgba(0,0,0,0.5)">Market price</text>
      <line x1="260" y1="188" x2="280" y2="188" stroke="#c62828" strokeWidth="2.5" strokeDasharray="5 3" />
      <text x="285" y="192" fontSize="9" fill="rgba(0,0,0,0.5)">Your static price</text>
    </svg>
  );
}

/* ── Low depth ── */
export function ProblemLow() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold tracking-tight">We&apos;re leaving money on the table.</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        When pricing stays static, the market moves without you. Competitors adjust, raw material
        costs shift, and customer willingness-to-pay changes — but your price sheet doesn&apos;t.
        Every day that gap widens, you&apos;re either overcharging and losing deals, or undercharging
        and giving away margin.
      </p>
    </div>
  );
}

/* ── Medium depth ── */
export function ProblemMedium() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">Static pricing vs. a dynamic market</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        The blue line is what the market is actually doing — prices fluctuate with demand, competition,
        and supply. The dashed red line is your price: flat. The shaded area between them is value
        you&apos;re either leaving on the table or losing to competitors who adapt faster. Over a
        full fiscal year, that gap compounds into millions in unrealized revenue.
      </p>
      <div className="mt-4 rounded-lg border bg-muted/30 p-4">
        <ProblemVisual />
      </div>
    </div>
  );
}

/* ── High depth ── */
export function ProblemHigh() {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold tracking-tight">Quantifying revenue leakage</h3>
      <div className="mt-4 rounded-lg border bg-muted/30 p-4">
        <ProblemVisual />
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          Revenue leakage from static pricing is not a single-point failure — it compounds.
          Price elasticity of demand means that even small deviations from optimal price produce
          disproportionate volume or margin losses. A price set 5% below market on high-elasticity
          products can yield 15-20% margin erosion once volume effects are accounted for.
        </p>
        <p>
          The quantification approach starts with historical transaction data: for every SKU-customer
          pair, we calculate the realized price vs. a market-adjusted benchmark over the same period.
          The integral of that gap — positive and negative — gives us the total addressable leakage.
          Typically this falls between 2-8% of gross revenue for industrial and distribution businesses.
        </p>
        <p>
          Static pricing also creates a ratchet effect. When market prices drop, your static price
          becomes uncompetitive and you lose volume. When market prices rise, you capture none of the
          upside. Over multiple cycles, this asymmetry compounds: you absorb the downside of every
          market move while missing the upside. The model&apos;s job is to close that gap in both
          directions — capturing upside when the market supports it and defending volume when it doesn&apos;t.
        </p>
      </div>
    </div>
  );
}
