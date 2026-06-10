"use client";

import { useState } from "react";
import { PricingStructureEquationsVisual } from "@/components/visuals/pricing-structure-equations";
import { PolicyVsModelDistribution } from "@/components/visuals/policy-vs-model-distribution";
import { DemandCurveStructuresVisual } from "@/components/visuals/demand-curve-structures";

const P = "#00446a";
const O = "#D97C14";
const G = "#2e7d32";

/* ── Low depth: Interactive matrix equation visual ── */
export function PricingStructuresLow() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-6">
        <PricingStructureEquationsVisual />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Three structures, increasing precision. The model can power any of them.
      </p>
    </div>
  );
}

/* ── Medium depth: Structures narrative + policy vs. model comparison ── */
export function PricingStructuresMedium() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">The value of modeling is not replacing these structures — it&apos;s making them smarter.</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Predictive machine learning updates each pricing policy toward micro-segment norms, finding
        the &ldquo;typical&rdquo; price for each deal context. The result: fewer exceptions, tighter
        spread, more profit captured. A dynamic model creates more and better-aligned price guidance
        that captures more customer willingness to pay — each additional price point fills a gap
        under the demand curve that a rigid policy leaves on the table.
      </p>

      <div className="rounded-lg border bg-muted/30 p-4">
        <PolicyVsModelDistribution />
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        <strong className="font-semibold text-foreground">List &amp; Discount:</strong>{" "}
        Net Price = List Price × (1 − Discount%). Products carry a list price; customers receive a
        discount off list. Simple to administer but wide variance — reps negotiate freely, creating
        the most policy exceptions. A reference policy typically has 5–10 common discounts, whereas
        a model can set 2–10× more, creating more market-relevant price points — fewer exceptions
        and more profit by matching willingness to pay.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        <strong className="font-semibold text-foreground">Levels:</strong>{" "}
        Customers and products map to discrete price tiers via a grid. The price IS the level — no
        separate list and discount. Governed and simpler, but rigid — some deals fall between tiers.
        Mid-range products get the best policy guidance; low-revenue products are neglected and
        high-revenue products face competitive pressure that overrides policy. A model corrects both.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        <strong className="font-semibold text-foreground">Target Price:</strong>{" "}
        Each deal receives a specific target price recommendation. Product, customer, and order
        attributes (20+ simultaneously) produce a unique price per deal with floor, target, and
        stretch guidance. Tightest corridor, fewest exceptions. Peer group models use 3–5 variables
        to bucket deals; an ML model uses 20+ attributes — consistent accuracy regardless of peer size.
      </p>

      <div className="rounded-lg border bg-muted/30 p-4">
        <DemandCurveStructuresVisual />
      </div>
    </div>
  );
}

/* ── High depth: Tabbed structure-specific view with four stages ── */

const TABS = [
  { key: "ld", label: "List & Discount", color: P },
  { key: "levels", label: "Levels", color: O },
  { key: "target", label: "Target Price", color: G },
] as const;

interface StageContent {
  title: string;
  badge: string;
  content: React.ReactNode;
}

function getStages(tab: string): StageContent[] {
  if (tab === "ld") {
    return [
      {
        badge: "1",
        title: "Synthesize — Typical Price",
        content: (
          <>
            <p>
              A <em>List Price Model</em> sets the typical list for each product using product
              attributes (cost basis, category, competitive positioning, volume history — typically
              8–15 attributes). It finds where list prices naturally cluster across transactions.
            </p>
            <p>
              A <em>Discount Model</em> estimates the typical discount each customer should receive
              based on customer attributes (revenue size, industry, wallet share, tenure — typically
              10–20 attributes). The model finds what &ldquo;like-for-like&rdquo; customers typically pay.
            </p>
          </>
        ),
      },
      {
        badge: "2",
        title: "Steer — Policy Aligned Price",
        content: (
          <>
            <p>
              <strong>Strategic overrides</strong> — pricing managers review synthesized prices and
              adjust based on go-forward strategy: raising list prices on supply-constrained products,
              protecting margins on strategic accounts, correcting discounts built on distorted history.
            </p>
            <p><strong>Automated rules fire on signals:</strong></p>
            <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div><span className="font-semibold" style={{ color: P }}>List Price Rules</span></div>
              <div><span className="font-semibold" style={{ color: O }}>Discount Rules</span></div>
              <div>Inventory tightness <span className="text-green-700">↑</span> nudge list up</div>
              <div>Growth targets <span className="text-red-600">↓</span> deepen discount</div>
              <div>Input cost index <span className="text-green-700">↑</span> pass through costs</div>
              <div>Stable, low-growth <span className="text-green-700">↑</span> harvest margin</div>
              <div>Market benchmark <span className="text-amber-600">↕</span> align to rate</div>
              <div>Churn risk <span className="text-amber-600">→</span> hold to protect</div>
            </div>
          </>
        ),
      },
      {
        badge: "3",
        title: "Experiment — Alternative Price",
        content: (
          <p>
            Controlled tests measure causal impact before broad rollout. A subset of customers is
            randomly assigned a different price (higher list, deeper discount, or both). Win rates,
            revenue, and retention are tracked against a holdout group — isolating the effect of
            the price change from seasonality, rep behavior, and market shifts.
          </p>
        ),
      },
      {
        badge: "4",
        title: "Optimize — Desired Outcome",
        content: (
          <p>
            Causal econometric models estimate how sensitive each segment is to price changes.
            Using win/loss outcomes and experiment results, the model estimates P(win) at each
            price point and finds the price that maximizes expected profit (win probability × margin).
            Output: optimal list price and discount per segment with floor, target, and stretch guidance.
          </p>
        ),
      },
    ];
  }

  if (tab === "levels") {
    return [
      {
        badge: "1",
        title: "Synthesize — Typical Price Level",
        content: (
          <>
            <p>
              A <em>Product Level Boundary</em> model determines where price levels should sit for
              each product group. It analyzes historical transaction prices using product attributes
              to find natural price breakpoints — where demand actually clusters rather than where
              policy assumes it does.
            </p>
            <p>
              A <em>Customer Level Assignment</em> model estimates the typical weighted-average margin
              each customer should achieve. The customer&apos;s expected basket margin is calculated at
              each product level, and they&apos;re assigned to the closest level.
            </p>
          </>
        ),
      },
      {
        badge: "2",
        title: "Steer — Policy Aligned Level",
        content: (
          <>
            <p>
              <strong>Strategic overrides</strong> — pricing managers reposition product lines to
              capture share, protect key accounts during competitive entry, or correct levels built
              on distorted history.
            </p>
            <p><strong>Automated rules fire on signals:</strong></p>
            <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div><span className="font-semibold" style={{ color: P }}>Level Boundary Rules</span></div>
              <div><span className="font-semibold" style={{ color: O }}>Customer Tier Rules</span></div>
              <div>New product launch <span className="text-green-700">↑</span> widen spread</div>
              <div>Strategic account <span className="text-amber-600">→</span> hold tier</div>
              <div>Commoditizing product <span className="text-red-600">↓</span> narrow spread</div>
              <div>Declining spend <span className="text-red-600">↓</span> review tier</div>
              <div>Low inventory SKU <span className="text-green-700">↑</span> shift ladder up</div>
              <div>New customer <span className="text-amber-600">→</span> standard tier</div>
            </div>
          </>
        ),
      },
      {
        badge: "3",
        title: "Experiment — Alternative Level",
        content: (
          <p>
            Test level reassignments on customer subsets to measure causal impact. A subset is
            randomly assigned up or down one level, and win rates, revenue, and retention are tracked
            against a holdout group — answering &ldquo;what actually happens when we move customers
            between levels?&rdquo; rather than inferring from historical correlation.
          </p>
        ),
      },
      {
        badge: "4",
        title: "Optimize — Desired Outcome",
        content: (
          <p>
            Causal models estimate how sensitive each customer segment is to level changes — the
            price elasticity of moving up or down one level. The model estimates P(win) at each level
            and finds the assignment that maximizes expected profit. Output: recommended level per
            customer with floor, target, and stretch guidance.
          </p>
        ),
      },
    ];
  }

  return [
    {
      badge: "1",
      title: "Synthesize — Typical Price",
      content: (
        <>
          <p>
            A gradient-boosted model considers 20–40 attributes simultaneously (product, customer,
            and order dimensions) and learns local patterns without needing buckets or adders.
            The result is a target that fits each deal context individually.
          </p>
          <p>
            Peer group models bucket deals by 3–5 attributes and apply global adders to compensate
            for thin groups. An ML model needs no buckets — each deal gets its own prediction,
            with consistent accuracy regardless of peer size.
          </p>
        </>
      ),
    },
    {
      badge: "2",
      title: "Steer — Policy Aligned Target",
      content: (
        <>
          <p>
            <strong>Strategic overrides</strong> — tighten the corridor on high-value deals, widen
            it for new market entry, correct targets built on distorted negotiation history.
          </p>
          <p><strong>Automated rules fire on signals:</strong></p>
          <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div><span className="font-semibold" style={{ color: P }}>Deal-Level Rules</span></div>
            <div><span className="font-semibold" style={{ color: O }}>Market Rules</span></div>
            <div>High-margin opp <span className="text-amber-600">→</span> hold target</div>
            <div>Raw material spike <span className="text-green-700">↑</span> raise floor</div>
            <div>Competitive bid <span className="text-red-600">↓</span> allow floor pricing</div>
            <div>Market softening <span className="text-red-600">↓</span> widen corridor</div>
            <div>Long-term contract <span className="text-red-600">↓</span> accept lower for stability</div>
            <div>Regulatory change <span className="text-green-700">↑</span> adjust compliance</div>
          </div>
        </>
      ),
    },
    {
      badge: "3",
      title: "Experiment — Alternative Target",
      content: (
        <p>
          Test specific target price changes on deal subsets. Because target pricing is deal-specific,
          experiments can be very granular — testing different price points for specific customer
          segments, product combinations, or order profiles to build a precise picture of price
          sensitivity. Win rates, margins, and deal velocity are tracked against holdouts.
        </p>
      ),
    },
    {
      badge: "4",
      title: "Optimize — Desired Outcome",
      content: (
        <p>
          Causal price-response models estimate P(win | price) for each deal context. With a
          continuous price variable, the model directly finds the price that maximizes expected
          profit — producing floor (minimum acceptable), target (profit-maximizing), and stretch
          (aspirational) recommendations with confidence intervals.
        </p>
      ),
    },
  ];
}

export function PricingStructuresHigh() {
  const [activeTab, setActiveTab] = useState(0);
  const tab = TABS[activeTab];
  const stages = getStages(tab.key);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">Synthesize → Steer → Experiment → Optimize</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Each pricing structure progresses through the same four stages. The mechanics differ by
        structure — select one to see how each stage applies.
      </p>

      <div className="flex gap-1.5">
        {TABS.map((t, i) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(i)}
            className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              backgroundColor: i === activeTab ? t.color : "transparent",
              color: i === activeTab ? "white" : t.color,
              border: `1.5px solid ${i === activeTab ? t.color : t.color + "30"}`,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {stages.map((stage) => (
          <div
            key={stage.badge}
            className="rounded-lg border p-3"
            style={{ borderColor: tab.color + "25" }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className="flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: tab.color }}
              >
                {stage.badge}
              </span>
              <span className="text-sm font-semibold">{stage.title}</span>
            </div>
            <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              {stage.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
