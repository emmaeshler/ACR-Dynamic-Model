"use client";

import { BLUE, NAVY, ORANGE, GREEN } from "@/components/hub-spoke-diagram";

/* ── SVG: Execution channels → structured training data ── */
function ExecutionVisual() {
  const channelY = [30, 80, 130];
  const channels = [
    { label: "Email", color: NAVY, y: channelY[0] },
    { label: "Chat", color: BLUE, y: channelY[1] },
    { label: "Quoting Tools", color: ORANGE, y: channelY[2] },
  ];

  return (
    <svg
      viewBox="0 0 520 200"
      className="w-full"
      role="img"
      aria-label="Diagram showing execution channels flowing into structured training data for the model"
    >
      {/* Channel boxes */}
      {channels.map((ch) => (
        <g key={ch.label}>
          <rect
            x={20}
            y={ch.y}
            width={120}
            height={40}
            rx={6}
            fill="white"
            stroke={ch.color}
            strokeWidth={2}
          />
          <rect x={21} y={ch.y + 6} width={4} height={28} rx={2} fill={ch.color} />
          <text
            x={80}
            y={ch.y + 25}
            fontSize="13"
            fontWeight="600"
            fill="#1a1a1a"
            textAnchor="middle"
          >
            {ch.label}
          </text>
        </g>
      ))}

      {/* Arrows from channels to center */}
      {channels.map((ch) => (
        <line
          key={`arr-${ch.label}`}
          x1={142}
          y1={ch.y + 20}
          x2={195}
          y2={100}
          stroke="#c8d1d9"
          strokeWidth={1.5}
          markerEnd="url(#exec-arrow)"
        />
      ))}
      <defs>
        <marker id="exec-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill="#c8d1d9" />
        </marker>
      </defs>

      {/* Center: parsing */}
      <rect x={200} y={70} width={110} height={60} rx={8} fill={NAVY} />
      <text x={255} y={96} fontSize="12" fontWeight="600" fill="white" textAnchor="middle">
        Parse &amp;
      </text>
      <text x={255} y={112} fontSize="12" fontWeight="600" fill="white" textAnchor="middle">
        Structure
      </text>

      {/* Arrow to output */}
      <line x1={312} y1={100} x2={358} y2={100} stroke="#c8d1d9" strokeWidth={1.5} markerEnd="url(#exec-arrow)" />

      {/* Output: structured data rows */}
      <rect x={362} y={40} width={140} height={120} rx={8} fill="white" stroke="#c8d1d9" strokeWidth={1} />
      <text x={432} y={60} fontSize="10" fontWeight="600" fill="#4a5568" textAnchor="middle" letterSpacing="1">
        TRAINING DATA
      </text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={374} y={70 + i * 20} width={55} height={12} rx={2} fill={NAVY} opacity={0.12 + i * 0.05} />
          <rect x={434} y={70 + i * 20} width={30} height={12} rx={2} fill={ORANGE} opacity={0.15 + i * 0.05} />
          <rect x={469} y={70 + i * 20} width={22} height={12} rx={2} fill={GREEN} opacity={0.15 + i * 0.05} />
        </g>
      ))}
    </svg>
  );
}

/* ── Low depth: Visual hero + short caption ── */
export function ExecutionLow() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-6">
        <ExecutionVisual />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Every customer interaction — email, chat, quoting tool — becomes structured training data for the model.
      </p>
    </div>
  );
}

/* ── Medium depth: How execution feeds the model ── */
export function ExecutionMedium() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">
        The model learns from how your team prices.
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Every time a rep sends a quote — by email, through a chat tool, or via a
        configured product interface — the system captures the full context of
        that interaction: what was requested, what was offered, how it was priced,
        and whether the customer accepted.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        This isn&apos;t passive logging. Each transaction is parsed into structured
        fields the model can train on: SKU, quantity, customer segment, discount
        applied, delivery terms, and outcome. Over time, the model sees thousands
        of these records and starts identifying which pricing decisions win deals
        and which leave margin on the table.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        The more channels that feed the system, the richer the training set. Email
        threads reveal negotiation dynamics. Chat logs capture urgency signals.
        Quoting tools provide precise line-item detail. Together they give the
        model a complete picture of how pricing actually happens — not just what
        the price sheet says.
      </p>
    </div>
  );
}

/* ── High depth: Application-level detail ── */
export function ExecutionHigh() {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold tracking-tight">Our execution tools</h3>
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <div>
          <p className="font-semibold text-foreground">Email quoting</p>
          <p>
            Customer emails are parsed automatically — SKUs matched, quantities
            extracted, pricing rules applied. High-confidence quotes send
            instantly; ambiguous requests route to the CSR. Every response
            becomes a training record.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground">Configured products</p>
          <p>
            A conversational interface for SKU lookup, variant selection, and
            tier-based pricing. Each configured quote logs exact specs,
            customer-specific pricing, and the outcome — structured data the
            model uses to improve recommendations.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground">Service job quoting</p>
          <p>
            Field techs describe the job and get a quote range in seconds —
            parts, labor, and materials broken down. The system learns from
            actual job costs versus estimates, tightening its range over time.
          </p>
        </div>
      </div>
    </div>
  );
}
