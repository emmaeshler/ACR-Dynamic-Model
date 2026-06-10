"use client";

const P = "#00446a";
const O = "#D97C14";
const G = "#2e7d32";
const BLUE = "#1B4F8A";

function ConstraintVisual() {
  return (
    <svg viewBox="0 0 440 175" className="w-full" role="img" aria-label="A model-recommended price point being bent by three constraint cards: MAP floors, contracts, and strategic priorities">
      <line x1="30" y1="85" x2="410" y2="85" stroke="#e0e0e0" strokeWidth="1" strokeDasharray="4 3" />
      <text x="220" y="80" fontSize="8" fill="rgba(0,0,0,0.3)" textAnchor="middle">Model&apos;s unconstrained recommendation</text>

      <circle cx="120" cy="85" r="8" fill={P} opacity="0.3" />
      <text x="120" y="75" fontSize="8" fill={P} textAnchor="middle" fontWeight="500">Raw price</text>

      <path d="M128 85 C155 85,175 55,200 55" fill="none" stroke={O} strokeWidth="2" />
      <polygon points="197,52 203,55 197,58" fill={O} />

      <rect x="205" y="25" width="90" height="18" rx="4" fill={O} opacity="0.12" stroke={O} strokeWidth="1.5" />
      <text x="250" y="37" fontSize="8" fill={O} textAnchor="middle" fontWeight="600">MAP Floor</text>
      <text x="250" y="50" fontSize="7" fill="rgba(0,0,0,0.4)" textAnchor="middle">Distributor minimum</text>

      <rect x="205" y="75" width="90" height="18" rx="4" fill={G} opacity="0.12" stroke={G} strokeWidth="1.5" />
      <text x="250" y="87" fontSize="8" fill={G} textAnchor="middle" fontWeight="600">12-mo Contract</text>
      <text x="250" y="100" fontSize="7" fill="rgba(0,0,0,0.4)" textAnchor="middle">Locked ceiling</text>

      <rect x="205" y="125" width="90" height="18" rx="4" fill={BLUE} opacity="0.12" stroke={BLUE} strokeWidth="1.5" />
      <text x="250" y="137" fontSize="8" fill={BLUE} textAnchor="middle" fontWeight="600">SW Growth Push</text>
      <text x="250" y="150" fontSize="7" fill="rgba(0,0,0,0.4)" textAnchor="middle">Strategic priority</text>

      <path d="M295 34 C310 34,320 65,335 65" fill="none" stroke={O} strokeWidth="1.5" />
      <path d="M295 84 C310 84,320 65,335 65" fill="none" stroke={G} strokeWidth="1.5" />
      <path d="M295 134 C310 134,320 65,335 65" fill="none" stroke={BLUE} strokeWidth="1.5" />

      <circle cx="340" cy="65" r="9" fill={P} />
      <text x="340" y="68" fontSize="7" fill="white" textAnchor="middle" fontWeight="700">$</text>

      <text x="358" y="62" fontSize="9" fill={P} fontWeight="600">Final price</text>
      <text x="358" y="74" fontSize="7.5" fill="rgba(0,0,0,0.4)">Math, bent to fit your business</text>
    </svg>
  );
}

/* ── Low depth: Visual hero ── */
export function InHouseExpLow() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-6">
        <ConstraintVisual />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        The math has an opinion on every deal. Your rules and strategy bend it to fit how you run the business.
      </p>
    </div>
  );
}

/* ── Medium depth: Story v2 YIE beats 14-17 ── */
export function InHouseExpMedium() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">Same engine. Different answer.</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Run unconstrained, the math has an opinion on every deal. Every quote lands on its
        mathematical sweet spot — clean, even, decisive. But also detached from how you actually
        run the business. You have rules the math can&apos;t see: this MAP floor was negotiated with
        your distributors, these accounts are locked under a 12-month contract, this product has a
        manufacturer minimum.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        And you have strategy the math doesn&apos;t have. &ldquo;We&apos;re pushing for share in
        the Southwest.&rdquo; &ldquo;These customers are critical to our top-line story this year.&rdquo;
        &ldquo;We will not lose Account #4127 over price.&rdquo; These aren&apos;t constraints —
        they&apos;re priorities. The output is the math, bent to fit how you actually run the
        business. Every deal still gets its own price; that price now respects what you know about
        your customers, your contracts, and your goals.
      </p>
    </div>
  );
}

/* ── High depth ── */
export function InHouseExpHigh() {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold tracking-tight">Constraint functions and guardrail architecture</h3>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-semibold text-foreground">Hard constraints.</strong>{" "}
          MAP floors, contractual ceilings, manufacturer minimums, and regulatory limits are encoded
          as inequality constraints in the optimization. The model&apos;s recommended price is
          clamped to the feasible region before output. These are non-negotiable — the model cannot
          recommend a price that violates them.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Soft constraints (strategy).</strong>{" "}
          Strategic priorities — market share goals, account retention targets, competitive
          positioning — are encoded as objective function modifiers. A &ldquo;grow share in
          Southwest&rdquo; directive adds a negative penalty to prices in that region, nudging
          recommendations lower without overriding hard limits. The magnitude maps to the
          user&apos;s stated priority weight.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Guardrail bounds.</strong>{" "}
          Every recommendation ships with upper and lower guardrails — the range within which the
          pricing team can adjust without escalation. Guardrail width reflects confidence: narrow
          bands for high-data segments, wider for sparse ones. Adjustments within guardrails are
          logged but not flagged; adjustments outside trigger review.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Automated steering rules.</strong>{" "}
          Beyond hard constraints and strategic priorities, recurring business logic is encoded as
          automated rules that fire after the ML baseline is set. List price rules respond to supply
          signals — when inventory tightens, list prices nudge up; when input costs spike, the model
          passes through the increase; when a market benchmark shifts, prices realign automatically.
          Discount rules adjust for customer-level factors: growth targets trigger deeper discounts
          for wallet share expansion, stable low-growth accounts get tightened discounts to harvest
          margin, over-discounted history gets corrected rather than perpetuated, and churn-risk
          accounts hold steady to protect at-risk renewals.
        </p>
      </div>
    </div>
  );
}
