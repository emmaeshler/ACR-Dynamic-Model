"use client";

const P = "#00446a";
const O = "#D97C14";
const G = "#2e7d32";

/* ── SVG: Scatter plot with improving learned curve ── */
function ModelRunningVisual() {
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

      {/* Data points — opacity increases with more data */}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill={O} opacity={0.5 + (i / pts.length) * 0.4} />
      ))}

      {/* Learned pricing curve */}
      <path
        d="M35 95 C70 82,110 68,155 58 S220 42,275 32"
        fill="none"
        stroke={P}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Differentiation callout */}
      <line x1="140" y1="60" x2="140" y2="85" stroke={G} strokeWidth="1" strokeDasharray="3 2" />
      <line x1="175" y1="52" x2="175" y2="85" stroke={G} strokeWidth="1" strokeDasharray="3 2" />
      <text x="157" y="96" fontSize="8" fill={G} textAnchor="middle" fontWeight="500">Differentiated</text>
      <text x="157" y="106" fontSize="7" fill={G} textAnchor="middle">not one-size-fits-all</text>
    </svg>
  );
}

/* ── Low depth ── */
export function ModelRunningLow() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold tracking-tight">More data means better prices.</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Every transaction that flows through the model makes it smarter. It learns which prices
        win deals, which lose them, and which leave money on the table. The result is pricing that
        gets more precise over time — not a static formula, but a living system that improves
        with every data point.
      </p>
    </div>
  );
}

/* ── Medium depth ── */
export function ModelRunningMedium() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">Each dot is a real price point</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        The scatter plot tells the story better than a revenue chart. Each orange dot is an actual
        transaction — a real price set for a real customer. The blue curve is the model&apos;s
        learned pricing function, fitted to your data. As more transactions flow through, the
        curve tightens. The green callouts highlight the key outcome: differentiation. Prices are
        tailored to each engagement, not applied as a blanket markup. Two customers buying the same
        product may get different prices based on volume, relationship tenure, competitive
        alternatives, and dozens of other factors the model has learned to weigh.
      </p>
      <div className="mt-4 rounded-lg border bg-muted/30 p-4">
        <ModelRunningVisual />
      </div>
    </div>
  );
}

/* ── High depth ── */
export function ModelRunningHigh() {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold tracking-tight">Training convergence and differentiation metrics</h3>
      <div className="mt-4 rounded-lg border bg-muted/30 p-4">
        <ModelRunningVisual />
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-semibold text-foreground">Curve fitting.</strong>{" "}
          The pricing function is learned through gradient-boosted ensemble methods (XGBoost/LightGBM)
          trained on historical transaction outcomes. The curve in the visual represents the model&apos;s
          predicted optimal price surface projected onto a single dimension. In reality, the model
          operates in high-dimensional feature space — the 2D scatter is a simplification that
          captures the core dynamic: more data points reduce prediction variance and tighten the
          confidence envelope around each recommendation.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Convergence.</strong>{" "}
          We track convergence through held-out validation loss. As transaction volume grows, the
          model&apos;s mean absolute error on unseen transactions decreases following a power-law
          curve. Typically, meaningful convergence occurs at 5,000-10,000 transactions per product
          segment. Below that threshold, recommendations carry wider confidence intervals and are
          flagged for human review. Above it, the model operates with sufficient precision to
          recommend autonomously within guardrail bounds.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Differentiation metrics.</strong>{" "}
          &ldquo;Differentiated pricing&rdquo; is measured by the coefficient of variation in
          recommended prices within a product group. A flat pricing strategy produces near-zero
          variance. Our model typically produces 8-15% coefficient of variation, meaning prices
          are genuinely tailored to each transaction&apos;s context. We validate that this variance
          is signal, not noise, by confirming that higher-priced recommendations correlate with
          lower price sensitivity segments (measured by historical volume elasticity).
        </p>
        <p>
          <strong className="font-semibold text-foreground">What &ldquo;better&rdquo; means mathematically.</strong>{" "}
          Improvement is measured on three axes: (1) margin capture rate — the percentage of
          available margin the recommended price captures vs. market benchmarks, (2) win rate
          stability — maintaining or improving close rates while raising prices, and (3) prediction
          accuracy — how close the model&apos;s expected outcome matches the actual transaction
          outcome. All three must improve together; optimizing margin at the expense of win rate
          is not &ldquo;better.&rdquo;
        </p>
      </div>
    </div>
  );
}
