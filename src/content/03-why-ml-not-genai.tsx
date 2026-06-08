"use client";

const P = "#00446a";
const G = "#2e7d32";

/* ── SVG: ML vs Gen AI comparison ── */
function MLvsGenAIVisual() {
  const checks = ["Deterministic", "Transaction history", "Feedback loops", "Industry context"];
  const crosses = ["Probabilistic", "No history", "No feedback", "Generic only"];

  return (
    <svg viewBox="0 0 340 145" className="w-full" role="img" aria-label="Comparison table: Machine Learning has deterministic outputs, transaction history, feedback loops, and industry context. Gen AI has none of these.">
      <rect x="10" y="4" width="145" height="24" rx="5" fill={P} />
      <text x="82" y="20" fontSize="10" fill="white" textAnchor="middle" fontWeight="700">Machine Learning</text>
      <rect x="185" y="4" width="145" height="24" rx="5" fill="#9e9e9e" />
      <text x="257" y="20" fontSize="10" fill="white" textAnchor="middle" fontWeight="700">Gen AI / LLMs</text>

      {checks.map((t, i) => (
        <g key={`c${i}`}>
          <circle cx="26" cy={48 + i * 24} r="8" fill="#e8f5e9" />
          <text x="26" y={52 + i * 24} fontSize="12" fill={G} textAnchor="middle">&#x2713;</text>
          <text x="40" y={52 + i * 24} fontSize="10" fill="rgba(0,0,0,0.7)">{t}</text>
        </g>
      ))}
      {crosses.map((t, i) => (
        <g key={`x${i}`}>
          <circle cx="201" cy={48 + i * 24} r="8" fill="#ffebee" />
          <text x="201" y={52 + i * 24} fontSize="12" fill="#c62828" textAnchor="middle">&#x2717;</text>
          <text x="215" y={52 + i * 24} fontSize="10" fill="rgba(0,0,0,0.7)">{t}</text>
        </g>
      ))}

      <line x1="170" y1="8" x2="170" y2="138" stroke="#e0e0e0" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}

/* ── Low depth ── */
export function WhyMLLow() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold tracking-tight">It&apos;s precise, not a guess.</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Every recommendation the model produces is traceable back to the data that created it.
        Run it twice with the same inputs, you get the same output. That matters when you need to
        defend a price to a customer, explain a recommendation to leadership, or audit decisions
        months later. Generative AI can&apos;t give you that.
      </p>
    </div>
  );
}

/* ── Medium depth ── */
export function WhyMLMedium() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">ML vs. Gen AI: why the distinction matters</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Machine learning produces deterministic, repeatable outputs grounded in your actual
        transaction data. It has feedback loops — every outcome refines the next prediction. It
        understands your industry because it was trained on it. Generative AI (ChatGPT, etc.) is
        probabilistic: the same prompt can yield different answers. It has no access to your
        transaction history, no feedback mechanism, and no industry-specific training. For pricing,
        that&apos;s the difference between a recommendation you can act on and a suggestion you
        have to verify from scratch.
      </p>
      <div className="mt-4 rounded-lg border bg-muted/30 p-4">
        <MLvsGenAIVisual />
      </div>
    </div>
  );
}

/* ── High depth ── */
export function WhyMLHigh() {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold tracking-tight">Why LLMs fail at pricing</h3>
      <div className="mt-4 rounded-lg border bg-muted/30 p-4">
        <MLvsGenAIVisual />
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="font-semibold text-foreground">No training on your transaction data.</strong>{" "}
          Large language models are trained on public internet text. They have never seen your invoices,
          your win/loss records, or your customer-specific pricing tiers. You can paste data into a
          prompt, but the model has no persistent memory of it and no way to learn patterns across
          millions of rows the way a supervised ML model does. Context window limits make this
          fundamentally architectural, not just a current limitation.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Hallucination risk in financial outputs.</strong>{" "}
          LLMs generate plausible-sounding text, not verified calculations. When asked to recommend a
          price, an LLM may produce a number that looks reasonable but has no statistical grounding.
          In pricing, a hallucinated recommendation that&apos;s off by even 2-3% can mean six-figure
          revenue impacts across a product portfolio. The failure mode is silent — the number looks
          right, so no one checks it.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Auditability requirements.</strong>{" "}
          Pricing decisions face internal and external audit scrutiny. Regulators, procurement teams,
          and internal compliance all need to trace a price back to its inputs. Our ML model provides
          feature importance scores for every recommendation — you can see exactly which variables
          drove the price and by how much. An LLM cannot provide this. Its reasoning is opaque by
          design: attention weights are not interpretable as causal explanations.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Reproducibility guarantees.</strong>{" "}
          ML model inference is deterministic: same inputs, same outputs, every time. This is critical
          for pricing consistency across sales reps, regions, and time periods. LLMs are stochastic
          even at temperature zero due to floating-point non-determinism in parallel computation.
          Two reps asking the same question about the same customer may get different price suggestions.
          That&apos;s unacceptable for a pricing system.
        </p>
      </div>
    </div>
  );
}
