"use client";

import { DemandCurveCaptureVisual } from "@/components/visuals/demand-curve-capture";
import { CaptureComparisonVisual } from "@/components/visuals/capture-comparison";
import { ObjectiveFunctionVisual } from "@/components/visuals/objective-function";

const P = "#00446a";
const O = "#D97C14";
const G = "#2e7d32";

/* ── SVG: Scatter plot with improving learned curve ── */
function OptimalCurveVisual() {
  const pts: [number, number][] = [
    [35, 95], [48, 88], [62, 92], [78, 75], [93, 80], [108, 68],
    [125, 72], [140, 60], [158, 64], [175, 52], [190, 56], [208, 45],
    [225, 48], [242, 38], [258, 42], [275, 32],
  ];

  return (
    <svg viewBox="0 0 310 130" className="w-full" role="img" aria-label="Scatter plot showing price points with an improving curve fit as more transactions flow through the model">
      <line x1="25" y1="110" x2="290" y2="110" stroke="#ddd" strokeWidth="1" />
      <line x1="25" y1="15" x2="25" y2="110" stroke="#ddd" strokeWidth="1" />
      <text x="160" y="126" fontSize="8" fill="rgba(0,0,0,0.35)" textAnchor="middle">More transactions &#x2192; better curve</text>
      <text x="10" y="62" fontSize="8" fill="rgba(0,0,0,0.35)" textAnchor="middle" transform="rotate(-90,10,62)">Accuracy</text>

      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill={O} opacity={0.5 + (i / pts.length) * 0.4} />
      ))}

      <path
        d="M35 95 C70 82,110 68,155 58 S220 42,275 32"
        fill="none"
        stroke={P}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <line x1="140" y1="60" x2="140" y2="85" stroke={G} strokeWidth="1" strokeDasharray="3 2" />
      <line x1="175" y1="52" x2="175" y2="85" stroke={G} strokeWidth="1" strokeDasharray="3 2" />
      <text x="157" y="96" fontSize="8" fill={G} textAnchor="middle" fontWeight="500">Differentiated</text>
      <text x="157" y="106" fontSize="7" fill={G} textAnchor="middle">not one-size-fits-all</text>
    </svg>
  );
}

/* ── Low depth: Visual hero + short caption ── */
export function OptimalCurveLow() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-6">
        <OptimalCurveVisual />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Every transaction makes the model smarter. More data, better prices.
      </p>
    </div>
  );
}

/* ── Medium depth: Demo v9 optimal-curve + capture narrative ── */
export function OptimalCurveMedium() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold tracking-tight">One price is easiest to manage. It also leaves the most on the table.</h3>

      <div className="rounded-lg border bg-muted/30 p-4">
        <DemandCurveCaptureVisual />
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        Pick a number, ship every deal at it. Simple — but a single price leaves margin on the table
        at every point on the demand curve. Each additional price point recovers margin a single price
        misses. But there&apos;s still a gap between each step and the curve — profit you could have
        captured with smarter pricing.
      </p>

      <div className="rounded-lg border bg-muted/30 p-4">
        <CaptureComparisonVisual />
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        Machine learning can set any number of prices along this curve. Every deal gets its own
        price — fitted to the curve, not approximated by a step. One price covers 54% of addressable
        margin. Manual segmentation gets to 78%. An ML model lands at 92%. The gap between where
        you are and that ceiling is the opportunity.
      </p>

      <h4 className="text-base font-semibold tracking-tight">Optimize for margin dollars</h4>

      <div className="rounded-lg border bg-muted/30 p-4">
        <ObjectiveFunctionVisual />
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        The model finds the price that maximizes expected margin dollars. For each deal, it estimates
        a margin parabola and a win-probability sigmoid. The optimal price sits where
        price × P(win) × margin rate peaks. As deals close, predicted meets actual — and the model adjusts.
      </p>
    </div>
  );
}

/* ── High depth: Demo v9 objective chapter + Structures v3 Optimize ── */
export function OptimalCurveHigh() {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold tracking-tight">Optimize for margin dollars</h3>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-semibold text-foreground">The objective function.</strong>{" "}
          The model finds the price that maximizes expected margin dollars — not revenue, not
          volume, but profit. For each deal, it estimates a margin parabola (margin $ as a function
          of price) and a win-probability sigmoid (P(win) as a function of price). The optimal price
          sits at the peak of the margin parabola weighted by the probability of winning — the point
          where price × P(win) × margin rate is maximized.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Causal econometric models.</strong>{" "}
          Using historical win/loss outcomes, deal attributes, and experiment results, the model
          estimates how sensitive each customer or product segment is to price changes — the price
          elasticity. It estimates P(win) at each price point and finds the price that maximizes
          expected profit (win probability × margin). Output: optimal price per segment with floor,
          target, and stretch guidance.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Predicted vs. actual.</strong>{" "}
          Predicted margin and win rate meet actual results — and the model adjusts. Demand shifts.
          Drivers change weight. Prices retune automatically. The objective function can be repointed:
          maximize margin dollars this year, maximize revenue next year, or optimize a blended metric.
          You change the objective, not the model.
        </p>
      </div>
    </div>
  );
}
