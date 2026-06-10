"use client";

const P = "#00446a";
const O = "#D97C14";
const G = "#2e7d32";

function MaturityGridVisual() {
  const dimensions = [
    { label: "Generalize", color: P },
    { label: "Guidance", color: O },
    { label: "Learning", color: G },
  ];
  const levels = ["L0", "L1", "L2", "L3", "L4"];

  return (
    <svg viewBox="0 0 440 165" className="w-full" role="img" aria-label="3-column by 5-row maturity grid showing Generalize, Guidance, and Learning dimensions across levels L0 through L4">
      {dimensions.map((dim, col) => {
        const x = 30 + col * 140;
        return (
          <g key={col}>
            <rect x={x} y="4" width="125" height="18" rx="4" fill={dim.color} opacity="0.15" />
            <text x={x + 62} y="17" fontSize="9" fill={dim.color} textAnchor="middle" fontWeight="700">{dim.label}</text>
            {levels.map((lvl, row) => {
              const y = 28 + row * 26;
              const fillOpacity = 0.06 + row * 0.05;
              return (
                <g key={row}>
                  <rect x={x} y={y} width="125" height="22" rx="3" fill={dim.color} opacity={fillOpacity} stroke={dim.color} strokeWidth="0.5" strokeOpacity="0.3" />
                  <text x={x + 8} y={y + 14} fontSize="8" fill={dim.color} fontWeight="600">{lvl}</text>
                  <rect x={x + 28} y={y + 5} width={12 + row * 18} height="6" rx="2" fill={dim.color} opacity={0.3 + row * 0.12} />
                </g>
              );
            })}
          </g>
        );
      })}

      <text x="220" y="162" fontSize="8" fill="rgba(0,0,0,0.35)" textAnchor="middle">Higher levels unlock more precision, governance, and learning</text>
    </svg>
  );
}

/* ── Low depth: Visual hero ── */
export function MaturityLow() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-6">
        <MaturityGridVisual />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Where you are, where you&apos;re headed, and which capabilities unlock at each level.
      </p>
    </div>
  );
}

/* ── Medium depth: Maturity v3 three dimensions ── */
export function MaturityMedium() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">Three dimensions define your pricing maturity.</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        <strong className="font-semibold text-foreground">Generalize</strong> is the model&apos;s
        ability to produce precise, differentiated prices. L0 is a formula or lookup baseline —
        one price for everyone. L1 uses broad static peer groups. L2 introduces ML
        micro-segmentation with richer attributes. L3 links price models to win-probability models.
        L4 is continuous recalibration across both.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        <strong className="font-semibold text-foreground">Guidance</strong> is how decisions
        get governed. L0 relies on manual overrides and ad hoc judgment. L1 adds static caps,
        floors, and thresholds. L2 introduces systematic data-triggered rules. L3 validates rules
        through experiments before scaling. L4 is adaptive governance with continuous oversight.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        <strong className="font-semibold text-foreground">Learning</strong> is the feedback loop.
        L0 has no formal test-and-learn. L1 monitors KPIs and reviews periodically. L2 runs pilots
        and phased rollouts. L3 uses controlled holdouts with causal readouts. L4 is always-on
        experimentation and optimization. Each dimension can advance independently — most clients
        start at L0-L1 and move at their own pace.
      </p>
    </div>
  );
}

/* ── High depth: Maturity v3 control surfaces + compatibility ── */
export function MaturityHigh() {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold tracking-tight">Control surfaces unlock by level</h3>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-semibold text-foreground">What you can tune depends on where you are.</strong>{" "}
          Each maturity level unlocks specific control levers. At L0, the only lever is a Margin %
          Floor — a blunt guardrail. L1 adds Segment A and B Adders, letting you differentiate
          pricing across broad customer groups. L2 introduces a Low Inventory Adder and a Days of
          Supply Threshold — context-aware rules that respond to supply signals. L3 unlocks
          experimentation: % of Transactions Under Test and Test Price Change %. L4 scales
          experimentation with the number of concurrent Price Tests and their Price Test Range.
          Controls from lower levels remain active as you advance.
        </p>
        <p>
          <strong className="font-semibold text-foreground">How levels interact with outcomes.</strong>{" "}
          Generalize sets precision — how many micro-segments the model can resolve. Guidance
          applies active controls: segment adders, inventory rules, and test levers at the
          appropriate maturity. Learning determines evidence quality — at L3+ the win model links
          to the price model, enabling P(win)-informed optimization. Below L3, win-rate estimates
          are unavailable and the model optimizes on margin alone.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Compatibility constraints.</strong>{" "}
          The dimensions are interdependent. L4 Learning requires stronger Generalize maturity —
          you can&apos;t run always-on optimization on a crude baseline. Learning more than two
          levels ahead of Generalize creates false confidence. High Learning (L3+) requires
          stronger Guidance governance — you can&apos;t experiment on rules that don&apos;t exist
          yet. Guidance automation more than two levels ahead of baseline quality produces false
          precision. These constraints prevent organizations from overreaching on one dimension
          while lagging on its prerequisites.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Mapping the four-stage framework.</strong>{" "}
          The pricing stages map directly to the maturity ladder. Synthesize — the ML baseline that
          finds typical prices from historical patterns — unlocks at L2 Generalize. Steer — automated
          rules that adjust the baseline toward strategic intent — unlocks at L2 Guidance. Experiment
          — controlled A/B tests that measure causal price impact — requires L3 Learning. Optimize —
          causal elasticity models that find the profit-maximizing price — requires L4 Learning with
          L3+ Generalize. Each stage builds on the prior one, and the maturity dimensions gate which
          stages are meaningful to pursue.
        </p>
      </div>
    </div>
  );
}
