"use client";

const P = "#00446a";
const O = "#D97C14";
const G = "#2e7d32";

/* ── SVG: Signal detection — market shift caught in data ── */
function MarketShiftVisual() {
  return (
    <svg viewBox="0 0 420 180" className="w-full" role="img" aria-label="Chart showing a stable pricing trend that suddenly shifts, with the model detecting the signal early">
      <line x1="40" y1="10" x2="40" y2="145" stroke="#e0e0e0" strokeWidth="1" />
      <line x1="40" y1="145" x2="400" y2="145" stroke="#e0e0e0" strokeWidth="1" />
      <text x="12" y="80" fontSize="9" fill="rgba(0,0,0,0.4)" textAnchor="middle" fontWeight="500" transform="rotate(-90,12,80)">Win Rate</text>
      <text x="220" y="160" fontSize="9" fill="rgba(0,0,0,0.4)" textAnchor="middle" fontWeight="500">Time</text>

      <path d="M50 50 C80 48,110 52,140 49 S170 51,200 50" fill="none" stroke={G} strokeWidth="2.5" />
      {[[50,50],[80,48],[110,52],[140,49],[170,51],[200,50]].map(([x, y], i) => (
        <circle key={`s${i}`} cx={x} cy={y} r="3.5" fill={G} opacity="0.7" />
      ))}

      <rect x="205" y="8" width="70" height="138" rx="4" fill="#c62828" opacity="0.06" />
      <text x="240" y="22" fontSize="8" fill="#c62828" textAnchor="middle" fontWeight="600">Market shift</text>

      <path d="M200 50 C215 55,230 68,245 78 S270 95,285 105" fill="none" stroke="#c62828" strokeWidth="2.5" strokeDasharray="6 3" />
      {[[215,58],[230,68],[245,78],[260,90],[275,100],[285,105]].map(([x, y], i) => (
        <circle key={`d${i}`} cx={x} cy={y} r="3.5" fill="#c62828" opacity="0.7" />
      ))}

      <path d="M285 105 C300 98,320 80,340 65 S365 52,385 48" fill="none" stroke={P} strokeWidth="2.5" />
      {[[300,92],[320,75],[340,65],[360,55],[385,48]].map(([x, y], i) => (
        <circle key={`r${i}`} cx={x} cy={y} r="3.5" fill={P} opacity="0.8" />
      ))}

      <line x1="285" y1="105" x2="285" y2="130" stroke={O} strokeWidth="1.5" />
      <circle cx="285" cy="105" r="6" fill="none" stroke={O} strokeWidth="2" />
      <rect x="244" y="126" width="82" height="16" rx="4" fill={O} opacity="0.12" stroke={O} strokeWidth="1" />
      <text x="285" y="137" fontSize="8" fill={O} textAnchor="middle" fontWeight="600">Signal detected</text>

      <line x1="80" y1="173" x2="96" y2="173" stroke={G} strokeWidth="2.5" />
      <text x="100" y="176" fontSize="8" fill="rgba(0,0,0,0.5)">Stable</text>
      <line x1="150" y1="173" x2="166" y2="173" stroke="#c62828" strokeWidth="2.5" strokeDasharray="4 2" />
      <text x="170" y="176" fontSize="8" fill="rgba(0,0,0,0.5)">Disruption</text>
      <line x1="240" y1="173" x2="256" y2="173" stroke={P} strokeWidth="2.5" />
      <text x="260" y="176" fontSize="8" fill="rgba(0,0,0,0.5)">Model corrects</text>
    </svg>
  );
}

/* ── Low depth: Visual hero + short caption ── */
export function MarketShiftLow() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-6">
        <MarketShiftVisual />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        The market shifted. The model caught it before it became a problem.
      </p>
    </div>
  );
}

/* ── Medium depth: Narrative explanation ── */
export function MarketShiftMedium() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">The market moves. Every price moves with it.</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        A competitor cuts. An input cost spikes. The index ticks. Environmental factors catch it
        the moment it happens — and every price in your system retunes to the new world. No
        project. No rebuild. No waiting on a quarterly refresh.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        The green line shows a stable period — win rates are consistent, pricing is working. Then
        something changes. The dashed red line shows the impact — win rates start declining. Without
        the model, you wouldn&apos;t notice until the quarterly review. With it, the signal is
        detected at the inflection point (orange circle), and corrective pricing recommendations
        begin immediately. The blue line shows recovery — the model corrects before the trend
        becomes a crisis.
      </p>
    </div>
  );
}

/* ── High depth ── */
export function MarketShiftHigh() {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold tracking-tight">Detection algorithms and threshold tuning</h3>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-semibold text-foreground">Detection approach.</strong>{" "}
          The model monitors leading indicators — win rate by segment, average discount depth,
          quote-to-close time, and competitive loss frequency — using exponentially weighted moving
          averages (EWMA) with adaptive control limits.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Threshold tuning.</strong>{" "}
          Alert thresholds face the classic precision-recall tradeoff. We calibrate using backtesting
          against known market events in the client&apos;s history. Target: false positive rate below
          10% while catching 90%+ of genuine market shifts within two weeks of onset.
        </p>
        <p>
          <strong className="font-semibold text-foreground">False positive tradeoffs.</strong>{" "}
          We weight false negatives 3-5x more heavily than false positives in the tuning objective,
          reflecting the asymmetric cost: weeks of suboptimal pricing bleeding margin is worse than
          an unnecessary review.
        </p>
      </div>
    </div>
  );
}
