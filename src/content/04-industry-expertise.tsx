"use client";

const P = "#00446a";
const O = "#D97C14";

function WaterfallVisual() {
  const bars = [
    { label: "List", value: 100, y: 20, color: P },
    { label: "Vol. Rebate", value: -4, y: 50, color: "#c62828" },
    { label: "Freight", value: -3, y: 70, color: "#c62828" },
    { label: "Pay Terms", value: -2.5, y: 90, color: "#c62828" },
    { label: "Exp. Quote", value: -1.5, y: 110, color: "#c62828" },
    { label: "Returns", value: -1, y: 130, color: "#c62828" },
  ];

  const pocketPct = 88;
  const scale = (v: number) => 40 + (v / 100) * 340;

  return (
    <svg viewBox="0 0 440 175" className="w-full" role="img" aria-label="Waterfall chart showing list price of $100 reduced by volume rebates, freight, payment terms, expired quotes, and returns to a pocket price of $88">
      <line x1="40" y1="10" x2="40" y2="160" stroke="#e0e0e0" strokeWidth="1" />

      <rect x={scale(0)} y={bars[0].y} width={scale(100) - scale(0)} height="18" rx="3" fill={P} />
      <text x={scale(50)} y={bars[0].y + 13} fontSize="9" fill="white" textAnchor="middle" fontWeight="600">List $100</text>

      {bars.slice(1).map((b, i) => {
        const prevEnd = 100 + bars.slice(1, i + 1).reduce((s, bb) => s + bb.value, 0);
        const x1 = scale(prevEnd + b.value);
        const w = scale(prevEnd) - x1;
        return (
          <g key={i}>
            <rect x={x1} y={b.y} width={w} height="14" rx="2" fill={b.color} opacity="0.7" />
            <text x={x1 - 4} y={b.y + 10} fontSize="8" fill="rgba(0,0,0,0.5)" textAnchor="end">{b.label}</text>
            <text x={x1 + w / 2} y={b.y + 10} fontSize="7.5" fill="white" textAnchor="middle" fontWeight="500">{b.value}%</text>
            <line x1={scale(prevEnd)} y1={b.y - 4} x2={scale(prevEnd)} y2={b.y + 2} stroke="#e0e0e0" strokeWidth="1" strokeDasharray="2 1" />
          </g>
        );
      })}

      <rect x={scale(0)} y="150" width={scale(pocketPct) - scale(0)} height="18" rx="3" fill={O} />
      <text x={scale(pocketPct / 2)} y="163" fontSize="9" fill="white" textAnchor="middle" fontWeight="600">Pocket ${pocketPct}</text>
      <line x1={scale(pocketPct)} y1="144" x2={scale(pocketPct)} y2="150" stroke="#e0e0e0" strokeWidth="1" strokeDasharray="2 1" />

      <text x={scale(pocketPct) + 8} y="163" fontSize="9" fill={O} fontWeight="600">&#x2190; This is the number we model</text>
    </svg>
  );
}

/* ── Low depth: Visual hero ── */
export function IndustryExpLow() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-6">
        <WaterfallVisual />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        List price is where most analyses stop. The pocket price — 12-18% lower — is what you actually keep.
      </p>
    </div>
  );
}

/* ── Medium depth: Story v2 IEXP beats 10-13 ── */
export function IndustryExpMedium() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">We know where to look — we&apos;ve measured it across the industry.</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        The number on the quote and the invoice is the easy one to look at — and it&apos;s where most
        pricing analyses start and end. But every transaction passes through a handful of leaks:
        volume rebates, freight allowances, payment-term discounts, expired-quote re-pricing, return
        adjustments. Each shaves off a little; together they add up.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        What actually lands on your P&amp;L is the pocket price — typically 12 to 18% below list.
        That&apos;s the number we model. That&apos;s the number we optimize. One client hadn&apos;t
        noticed a 4% expired-quote leak until we mapped it. Having seen these patterns across many
        businesses, we know which leaks usually matter most — and where to start.
      </p>
    </div>
  );
}

/* ── High depth ── */
export function IndustryExpHigh() {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold tracking-tight">Leak identification and pocket price methodology</h3>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-semibold text-foreground">Waterfall decomposition.</strong>{" "}
          We reconstruct the full price waterfall from ERP data: list price → invoice price →
          pocket price. Each step is a measurable leak. The waterfall is computed per SKU-customer
          pair to identify which leaks hit which segments hardest. Aggregate waterfalls mask
          segment-level problems.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Common leak patterns.</strong>{" "}
          Across industrial and distribution clients, the largest leaks are typically volume
          rebates (3-6% of list), freight absorption (1-3%), payment-term discounts (1-2%), and
          expired-quote honor pricing (1-4%). The order varies by industry, but the pattern is
          remarkably consistent. We prioritize investigation based on cross-industry benchmarks.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Pocket price as model target.</strong>{" "}
          The model is trained on pocket price, not list or invoice. This matters because optimizing
          list price while ignoring leaks can actually increase leakage — reps compensate for higher
          list by granting larger discounts. By targeting pocket price directly, the model optimizes
          the number that hits the P&amp;L.
        </p>
      </div>
    </div>
  );
}
