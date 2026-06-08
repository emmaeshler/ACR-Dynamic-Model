"use client";

const P = "#00446a";
const O = "#D97C14";
const G = "#2e7d32";

/* ── SVG: Signal detection — market shift caught in data ── */
function ComplicationVisual() {
  return (
    <svg viewBox="0 0 420 180" className="w-full" role="img" aria-label="Chart showing a stable pricing trend that suddenly shifts, with the model detecting the signal early">
      {/* Axes */}
      <line x1="40" y1="10" x2="40" y2="145" stroke="#e0e0e0" strokeWidth="1" />
      <line x1="40" y1="145" x2="400" y2="145" stroke="#e0e0e0" strokeWidth="1" />
      <text x="12" y="80" fontSize="9" fill="rgba(0,0,0,0.4)" textAnchor="middle" fontWeight="500" transform="rotate(-90,12,80)">Win Rate</text>
      <text x="220" y="160" fontSize="9" fill="rgba(0,0,0,0.4)" textAnchor="middle" fontWeight="500">Time</text>

      {/* Stable period — high win rate */}
      <path d="M50 50 C80 48,110 52,140 49 S170 51,200 50" fill="none" stroke={G} strokeWidth="2.5" />
      {[[50,50],[80,48],[110,52],[140,49],[170,51],[200,50]].map(([x, y], i) => (
        <circle key={`s${i}`} cx={x} cy={y} r="3.5" fill={G} opacity="0.7" />
      ))}

      {/* Disruption zone */}
      <rect x="205" y="8" width="70" height="138" rx="4" fill="#c62828" opacity="0.06" />
      <text x="240" y="22" fontSize="8" fill="#c62828" textAnchor="middle" fontWeight="600">Market shift</text>

      {/* Declining win rate — the signal */}
      <path d="M200 50 C215 55,230 68,245 78 S270 95,285 105" fill="none" stroke="#c62828" strokeWidth="2.5" strokeDasharray="6 3" />
      {[[215,58],[230,68],[245,78],[260,90],[275,100],[285,105]].map(([x, y], i) => (
        <circle key={`d${i}`} cx={x} cy={y} r="3.5" fill="#c62828" opacity="0.7" />
      ))}

      {/* Model detects and corrects */}
      <path d="M285 105 C300 98,320 80,340 65 S365 52,385 48" fill="none" stroke={P} strokeWidth="2.5" />
      {[[300,92],[320,75],[340,65],[360,55],[385,48]].map(([x, y], i) => (
        <circle key={`r${i}`} cx={x} cy={y} r="3.5" fill={P} opacity="0.8" />
      ))}

      {/* Detection callout */}
      <line x1="285" y1="105" x2="285" y2="130" stroke={O} strokeWidth="1.5" />
      <circle cx="285" cy="105" r="6" fill="none" stroke={O} strokeWidth="2" />
      <rect x="244" y="126" width="82" height="16" rx="4" fill={O} opacity="0.12" stroke={O} strokeWidth="1" />
      <text x="285" y="137" fontSize="8" fill={O} textAnchor="middle" fontWeight="600">Signal detected</text>

      {/* Legend */}
      <line x1="80" y1="173" x2="96" y2="173" stroke={G} strokeWidth="2.5" />
      <text x="100" y="176" fontSize="8" fill="rgba(0,0,0,0.5)">Stable</text>
      <line x1="150" y1="173" x2="166" y2="173" stroke="#c62828" strokeWidth="2.5" strokeDasharray="4 2" />
      <text x="170" y="176" fontSize="8" fill="rgba(0,0,0,0.5)">Disruption</text>
      <line x1="240" y1="173" x2="256" y2="173" stroke={P} strokeWidth="2.5" />
      <text x="260" y="176" fontSize="8" fill="rgba(0,0,0,0.5)">Model corrects</text>
    </svg>
  );
}

/* ── Low depth ── */
export function ComplicationLow() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold tracking-tight">The market shifted — we caught it before it became a problem.</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Markets don&apos;t send announcements when conditions change. Win rates slip, competitors
        quietly undercut, or supply tightens in ways that aren&apos;t obvious until the damage is
        done. The model watches for these signals continuously and flags them early — before a trend
        becomes a crisis.
      </p>
    </div>
  );
}

/* ── Medium depth ── */
export function ComplicationMedium() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">The model sees the signal in the noise</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        The green line shows a stable period — win rates are consistent, pricing is working. Then
        something changes: a competitor drops prices, a key supplier raises costs, or demand shifts
        in a segment. The dashed red line shows the impact — win rates start declining. Without the
        model, you wouldn&apos;t notice until the quarterly review. With it, the signal is detected
        at the inflection point (orange circle), and corrective pricing recommendations begin
        immediately. The blue line shows recovery — the model adjusts and stabilizes.
      </p>
      <div className="mt-4 rounded-lg border bg-muted/30 p-4">
        <ComplicationVisual />
      </div>
    </div>
  );
}

/* ── High depth ── */
export function ComplicationHigh() {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold tracking-tight">Detection algorithms and threshold tuning</h3>
      <div className="mt-4 rounded-lg border bg-muted/30 p-4">
        <ComplicationVisual />
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-semibold text-foreground">Detection approach.</strong>{" "}
          The model monitors a set of leading indicators — win rate by segment, average discount
          depth, quote-to-close time, and competitive loss frequency — using exponentially weighted
          moving averages (EWMA) with adaptive control limits. When an indicator breaches its
          control band, it triggers an alert. We use EWMA rather than simple thresholds because
          it smooths noise while remaining sensitive to genuine shifts. The smoothing parameter
          (lambda) is tuned per metric based on its historical volatility.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Threshold tuning.</strong>{" "}
          Alert thresholds face the classic precision-recall tradeoff. Too sensitive and you
          generate false alarms that erode trust; too conservative and you miss real shifts.
          We calibrate thresholds using backtesting against known market events in the client&apos;s
          history. The target is a false positive rate below 10% while catching 90%+ of genuine
          market shifts within two weeks of onset. Thresholds are segment-specific — volatile
          commodity-linked products get wider bands than stable service contracts.
        </p>
        <p>
          <strong className="font-semibold text-foreground">False positive tradeoffs.</strong>{" "}
          A false positive — flagging a shift that isn&apos;t real — has a cost: unnecessary
          price changes, analyst review time, and potential customer confusion. A false negative
          — missing a real shift — has a higher cost: weeks of suboptimal pricing bleeding margin.
          We weight false negatives 3-5x more heavily than false positives in the tuning objective,
          reflecting the asymmetric cost. In practice, this means the model over-alerts slightly
          and relies on the analyst review step to filter.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Proactive pricing.</strong>{" "}
          Early detection enables proactive rather than reactive pricing. When a shift is detected,
          the model generates scenario-based recommendations: if the shift is temporary (e.g.,
          competitor promotion), it recommends holding with targeted exceptions. If the shift is
          structural (e.g., new market entrant), it recommends a systematic price adjustment
          across the affected segment. The scenario classification itself is a secondary model
          trained on historical shift patterns and their outcomes.
        </p>
      </div>
    </div>
  );
}
