"use client";

export const BLUE = "#21A5D5";
export const ORANGE = "#E56910";
export const GREEN = "#2e7d32";
export const NAVY = "#00446A";
export const GRAY_BG = "#F5F8FA";
export const GRAY_BORDER = "#CBD5DE";
export const FEEDBACK_BORDER = "#8A9AAA";
export const MUTED = "#5A6A78";

export function HubSpokeDiagram() {
  return (
    <svg
      viewBox="0 0 900 620"
      className="w-full"
      role="img"
      aria-label="ML pricing model hub-and-spoke diagram showing four inputs on the left — Data, Environment, Industry, In-House — converging into the model at center, with output paths on the right"
    >
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill={MUTED} />
        </marker>
        <marker id="arrow-blue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill={BLUE} />
        </marker>
        <marker id="arrow-orange" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill={ORANGE} />
        </marker>
        <marker id="arrow-feedback" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill={FEEDBACK_BORDER} />
        </marker>
        <marker id="arrow-navy" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill={NAVY} />
        </marker>
        <marker id="arrow-green" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill={GREEN} />
        </marker>
      </defs>

      {/* ── LEFT SIDE: Four input nodes ── */}

      {/* Data Driven Insights */}
      <rect x="40" y="60" width="195" height="65" rx="8" fill={GRAY_BG} stroke={NAVY} strokeWidth="2" />
      <text x="137" y="87" fontSize="16" fontWeight="600" fill={NAVY} textAnchor="middle">Data</text>
      <text x="137" y="108" fontSize="12" fill={MUTED} textAnchor="middle">Your deal history</text>

      {/* Environmental Factors */}
      <rect x="40" y="195" width="195" height="65" rx="8" fill={GRAY_BG} stroke={ORANGE} strokeWidth="2" />
      <text x="137" y="222" fontSize="16" fontWeight="600" fill={ORANGE} textAnchor="middle">Environment</text>
      <text x="137" y="243" fontSize="12" fill={MUTED} textAnchor="middle">Market · competitors</text>

      {/* Industry Expertise */}
      <rect x="40" y="330" width="195" height="65" rx="8" fill={GRAY_BG} stroke={GREEN} strokeWidth="2" />
      <text x="137" y="357" fontSize="16" fontWeight="600" fill={GREEN} textAnchor="middle">Industry</text>
      <text x="137" y="378" fontSize="12" fill={MUTED} textAnchor="middle">I2P expertise</text>

      {/* In-House Expertise */}
      <rect x="40" y="465" width="195" height="65" rx="8" fill={GRAY_BG} stroke={BLUE} strokeWidth="2" />
      <text x="137" y="492" fontSize="16" fontWeight="600" fill={BLUE} textAnchor="middle">In-House</text>
      <text x="137" y="513" fontSize="12" fill={MUTED} textAnchor="middle">Your rules · strategy</text>

      {/* ── ARROWS: Inputs → Model ── */}

      <line x1="235" y1="92" x2="365" y2="270" stroke={NAVY} strokeWidth="1.5" markerEnd="url(#arrow-navy)" />
      <line x1="235" y1="227" x2="365" y2="295" stroke={ORANGE} strokeWidth="1.5" markerEnd="url(#arrow-orange)" />
      <line x1="235" y1="362" x2="365" y2="325" stroke={GREEN} strokeWidth="1.5" markerEnd="url(#arrow-green)" />
      <line x1="235" y1="497" x2="365" y2="350" stroke={BLUE} strokeWidth="1.5" markerEnd="url(#arrow-blue)" />

      {/* ── CENTER: Model circle ── */}
      <circle cx="450" cy="310" r="95" fill={NAVY} />
      <text x="450" y="295" fontSize="22" fontWeight="700" fill="white" textAnchor="middle">ML Model</text>
      <text x="450" y="318" fontSize="13" fill="rgba(255,255,255,0.85)" textAnchor="middle">Deterministic pricing</text>
      <text x="450" y="338" fontSize="12" fill="rgba(255,255,255,0.6)" textAnchor="middle" fontStyle="italic">Continuously learning</text>

      {/* ── RIGHT SIDE: Output paths ── */}

      {/* ── Upper path: Internal gate ── */}
      <text x="640" y="130" fontSize="12" fill={MUTED} fontStyle="italic">Internal gate</text>

      <line x1="535" y1="265" x2="620" y2="175" stroke={BLUE} strokeWidth="1.5" markerEnd="url(#arrow-blue)" />

      <rect x="620" y="145" width="210" height="65" rx="8" fill={GRAY_BG} stroke={GRAY_BORDER} strokeWidth="1.5" />
      <text x="725" y="172" fontSize="16" fontWeight="600" fill="#1a1a1a" textAnchor="middle">Conviction</text>
      <text x="725" y="193" fontSize="12" fill={MUTED} textAnchor="middle">Threshold · approve or flag</text>

      {/* Feedback arc from Conviction */}
      <path
        d="M620 195 C500 220, 300 350, 235 490"
        fill="none"
        stroke={FEEDBACK_BORDER}
        strokeWidth="1.5"
        strokeDasharray="6 4"
        markerEnd="url(#arrow-feedback)"
      />

      {/* ── Lower path: Client-facing ── */}
      <text x="640" y="340" fontSize="12" fill={MUTED} fontStyle="italic">Client-facing path</text>

      <line x1="535" y1="335" x2="620" y2="370" stroke={BLUE} strokeWidth="1.5" markerEnd="url(#arrow-blue)" />

      <rect x="620" y="350" width="210" height="65" rx="8" fill={GRAY_BG} stroke={GRAY_BORDER} strokeWidth="1.5" />
      <text x="725" y="377" fontSize="16" fontWeight="600" fill="#1a1a1a" textAnchor="middle">Plan</text>
      <text x="725" y="398" fontSize="12" fill={MUTED} textAnchor="middle">Drivers · talking points</text>

      <line x1="830" y1="382" x2="860" y2="382" stroke={ORANGE} strokeWidth="1.5" markerEnd="url(#arrow-orange)" />
      <text x="868" y="378" fontSize="13" fontWeight="600" fill={ORANGE}>Client</text>
      <text x="868" y="394" fontSize="13" fontWeight="600" fill={ORANGE}>pitch</text>

      <line x1="868" y1="400" x2="830" y2="490" stroke={ORANGE} strokeWidth="1.5" markerEnd="url(#arrow-orange)" />

      <rect x="620" y="475" width="210" height="65" rx="8" fill={GRAY_BG} stroke={GRAY_BORDER} strokeWidth="1.5" />
      <text x="725" y="502" fontSize="16" fontWeight="600" fill="#1a1a1a" textAnchor="middle">Negotiate</text>
      <text x="725" y="523" fontSize="12" fill={MUTED} textAnchor="middle">Agent guardrails · escalation</text>

      <line x1="830" y1="507" x2="860" y2="507" stroke={ORANGE} strokeWidth="1.5" markerEnd="url(#arrow-orange)" />
      <text x="868" y="503" fontSize="13" fontWeight="600" fill={ORANGE}>Client</text>
      <text x="868" y="519" fontSize="13" fontWeight="600" fill={ORANGE}>closed</text>

      {/* Feedback arc from Negotiate back to Data input */}
      <path
        d="M620 520 C480 560, 300 560, 235 110"
        fill="none"
        stroke={FEEDBACK_BORDER}
        strokeWidth="1.5"
        strokeDasharray="6 4"
        markerEnd="url(#arrow-feedback)"
      />
      <text x="350" y="575" fontSize="11" fill={FEEDBACK_BORDER} fontStyle="italic">Outcomes feed back into the model</text>
    </svg>
  );
}
