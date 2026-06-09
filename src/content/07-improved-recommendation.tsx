"use client";

const P = "#00446a";
const G = "#2e7d32";

/* ── SVG: Improving results — tighter confidence band over time ── */
function ImprovedRecVisual() {
  const pts: [number, number][] = [
    [35, 82], [55, 78], [75, 74], [100, 69], [125, 65], [150, 61],
    [175, 57], [200, 53], [225, 50], [250, 47], [275, 44],
  ];

  return (
    <svg viewBox="0 0 340 140" className="w-full" role="img" aria-label="Chart showing recommendation accuracy improving over time with a tightening confidence band">
      <line x1="25" y1="115" x2="310" y2="115" stroke="#ddd" strokeWidth="1" />
      <line x1="25" y1="15" x2="25" y2="115" stroke="#ddd" strokeWidth="1" />
      <text x="10" y="65" fontSize="8" fill="rgba(0,0,0,0.35)" textAnchor="middle" transform="rotate(-90,10,65)">Accuracy</text>
      <text x="170" y="128" fontSize="8" fill="rgba(0,0,0,0.35)" textAnchor="middle">Retraining cycles</text>

      {/* Confidence band — starts wide, narrows */}
      <path
        d="M35 72 C85 66,145 56,200 49 S260 43,275 40
           L275 48 C260 50,200 57,145 65 S85 76,35 92 Z"
        fill={G}
        opacity="0.08"
      />

      {/* Upper bound of band */}
      <path
        d="M35 72 C85 66,145 56,200 49 S260 43,275 40"
        fill="none"
        stroke={G}
        strokeWidth="1"
        strokeDasharray="4 2"
        opacity="0.4"
      />
      {/* Lower bound of band */}
      <path
        d="M35 92 C85 76,145 65,200 57 S260 50,275 48"
        fill="none"
        stroke={G}
        strokeWidth="1"
        strokeDasharray="4 2"
        opacity="0.4"
      />

      {/* Data points */}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill={G} opacity="0.65" />
      ))}

      {/* Main trend line */}
      <path
        d="M35 82 C85 72,145 60,205 52 S265 45,275 43"
        fill="none"
        stroke={G}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Callout: band width annotations */}
      <line x1="35" y1="72" x2="35" y2="92" stroke={P} strokeWidth="1" opacity="0.5" />
      <text x="42" y="84" fontSize="7" fill={P} opacity="0.6">wide</text>

      <line x1="275" y1="40" x2="275" y2="48" stroke={P} strokeWidth="1" opacity="0.5" />
      <text x="282" y="46" fontSize="7" fill={P} opacity="0.6">tight</text>

      {/* Result badge */}
      <rect x="200" y="70" width="115" height="30" rx="6" fill={G} />
      <text x="257" y="85" fontSize="9" fill="white" textAnchor="middle" fontWeight="600">&#x2191; Better each cycle</text>
      <text x="257" y="96" fontSize="7" fill="rgba(255,255,255,0.8)" textAnchor="middle">Ready to approve</text>
    </svg>
  );
}

/* ── Low depth: Visual hero + short caption ── */
export function ImprovedRecLow() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-6">
        <ImprovedRecVisual />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Better results every cycle — tighter, smarter, ready to approve.
      </p>
    </div>
  );
}

/* ── Medium depth: Narrative explanation ── */
export function ImprovedRecMedium() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">Tighter bands, higher confidence</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        This is the payoff. Each time the model retrains, recommendations get more precise.
        Confidence intervals narrow. Fewer prices need manual adjustment. The pre-call strategy
        that comes out is ready to use — talking points, competitive positioning, and a price
        the data supports. Over time, the system requires less human intervention and delivers
        more value.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Early on, the confidence band is wide — the model is still learning and its recommendations
        carry significant uncertainty. With each cycle, the band tightens as the model incorporates
        more outcomes, more overrides, and more market data. The end state is a recommendation
        that arrives with a narrow confidence interval — the reviewer can trust it, approve it
        quickly, and focus their energy on the edge cases that genuinely need human judgment.
      </p>
    </div>
  );
}

/* ── High depth ── */
export function ImprovedRecHigh() {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold tracking-tight">Validation, confidence intervals, and the &ldquo;ready to approve&rdquo; threshold</h3>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-semibold text-foreground">Before/after metrics.</strong>{" "}
          We measure improvement across four dimensions with each retraining cycle. Margin capture
          rate typically improves from 60-65% in cycle one to 80-90% by cycle four. Win rate
          stability is maintained within a 2-percentage-point band even as prices increase.
          Override rate drops from 40-50% initially to 10-15% at maturity. Price consistency
          improves by 30-40%, meaning less arbitrary pricing variance across the sales team.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Confidence intervals.</strong>{" "}
          Every recommendation ships with a 90% prediction interval. Early in the model&apos;s life,
          this interval may span 8-12% of the recommended price (e.g., $100 +/- $5). At maturity,
          it narrows to 2-4%. The interval width is computed from the ensemble&apos;s prediction
          variance across its constituent trees — a natural measure of model uncertainty for that
          specific input.
        </p>
        <p>
          <strong className="font-semibold text-foreground">A/B validation.</strong>{" "}
          Before a retrained model fully replaces the prior version, we run a controlled rollout.
          A random subset of engagements (typically 20-30%) receives recommendations from the new
          model while the rest continues on the current model. We compare outcomes over a two-week
          window. The new model must show statistically significant improvement (p &lt; 0.05) on at
          least one primary metric without degradation on the others.
        </p>
        <p>
          <strong className="font-semibold text-foreground">What &ldquo;ready to approve&rdquo; means.</strong>{" "}
          A recommendation reaches &ldquo;ready to approve&rdquo; status when three conditions are met:
          (1) the prediction interval is within the configured threshold for that product segment,
          (2) the recommendation passes all business rule checks (margin floors, contractual limits,
          anti-trust constraints), and (3) the model&apos;s confidence score for that specific
          input exceeds the segment-level threshold.
        </p>
      </div>
    </div>
  );
}
