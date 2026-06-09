"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BLUE, ORANGE, GREEN, GRAY_BG, GRAY_BORDER, FEEDBACK_BORDER, MUTED } from "./hub-spoke-diagram";

const EASE = "easeOut" as const;

function MiniAppCard({
  x,
  y,
  color,
  label,
  phase,
  targetX,
  targetY,
}: {
  x: number;
  y: number;
  color: string;
  label: string;
  phase: number;
  targetX: number;
  targetY: number;
}) {
  const converged = phase >= 1;
  const hidden = phase >= 2;

  return (
    <motion.g
      animate={{
        opacity: hidden ? 0 : 1,
        x: converged ? targetX - x : 0,
        y: converged ? targetY - y : 0,
        scale: converged ? 0.5 : 1,
      }}
      transition={{ duration: 0.6, ease: "easeInOut" as const }}
    >
      <rect x={x} y={y} width="170" height="50" rx="8" fill="white" stroke={color} strokeWidth="2" />
      <rect x={x} y={y} width="6" height="50" rx="3" fill={color} />
      <text x={x + 90} y={y + 22} fontSize="13" fontWeight="600" fill="#1a1a1a" textAnchor="middle">{label}</text>
      <rect x={x + 25} y={y + 32} width="130" height="3" rx="1.5" fill={MUTED} opacity="0.25" />
    </motion.g>
  );
}

function AnimatedHubSpoke({ phase }: { phase: number }) {
  const show = phase >= 2;
  const showDetails = phase >= 3;
  const pulse = phase >= 4;

  return (
    <>
      {/* ── Execution node (appears at phase 2) ── */}
      <motion.g
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <motion.rect
          x="40" y="80" width="195" height="65" rx="8"
          fill={GRAY_BG}
          animate={{
            stroke: pulse ? [GRAY_BORDER, BLUE, BLUE, GRAY_BORDER] : GRAY_BORDER,
            strokeWidth: pulse ? [1.5, 2.5, 2.5, 1.5] : 1.5,
          }}
          transition={{ duration: 1.5, ease: "easeInOut" as const }}
        />
        <text x="137" y="107" fontSize="16" fontWeight="600" fill="#1a1a1a" textAnchor="middle">Execution</text>
        <text x="137" y="128" fontSize="12" fill={MUTED} textAnchor="middle">Email &middot; chat &middot; quoting</text>
      </motion.g>

      {/* ── Model circle ── */}
      <motion.g
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <circle cx="450" cy="310" r="95" fill={BLUE} />
        <text x="450" y="295" fontSize="22" fontWeight="700" fill="white" textAnchor="middle">Model</text>
        <text x="450" y="318" fontSize="13" fill="rgba(255,255,255,0.85)" textAnchor="middle">Price recommendation</text>
        <text x="450" y="338" fontSize="12" fill="rgba(255,255,255,0.6)" textAnchor="middle" fontStyle="italic">Continuously learning</text>
      </motion.g>

      {/* ── Execution → Model arrow ── */}
      <motion.line
        x1="235" y1="112" x2="370" y2="280"
        stroke={MUTED} strokeWidth="1.5" markerEnd="url(#a-arrow)"
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.4, delay: showDetails ? 0.2 : 0, ease: EASE }}
      />

      {/* ── Market signals ── */}
      <motion.g
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.4, delay: showDetails ? 0.4 : 0, ease: EASE }}
      >
        <rect x="40" y="280" width="195" height="65" rx="8" fill={GRAY_BG} stroke={GRAY_BORDER} strokeWidth="1.5" />
        <text x="137" y="307" fontSize="16" fontWeight="600" fill="#1a1a1a" textAnchor="middle">Market signals</text>
        <text x="137" y="328" fontSize="12" fill={MUTED} textAnchor="middle">Conditions &middot; benchmarks</text>
      </motion.g>

      <motion.line
        x1="235" y1="312" x2="370" y2="310"
        stroke={MUTED} strokeWidth="1.5" markerEnd="url(#a-arrow)"
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.4, delay: showDetails ? 0.5 : 0, ease: EASE }}
      />

      {/* ── Deal outcomes ── */}
      <motion.g
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.4, delay: showDetails ? 0.6 : 0, ease: EASE }}
      >
        <rect x="40" y="475" width="195" height="65" rx="8" fill={GRAY_BG} stroke={BLUE} strokeWidth="2" />
        <text x="137" y="502" fontSize="16" fontWeight="600" fill="#1a1a1a" textAnchor="middle">Deal outcomes</text>
        <text x="137" y="523" fontSize="12" fill={MUTED} textAnchor="middle">Won &middot; lost &middot; negotiated</text>
      </motion.g>

      <motion.line
        x1="235" y1="507" x2="370" y2="340"
        stroke={MUTED} strokeWidth="1.5" markerEnd="url(#a-arrow)"
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.4, delay: showDetails ? 0.7 : 0, ease: EASE }}
      />

      {/* ── RIGHT SIDE: Output paths ── */}

      <motion.text
        x="640" y="130" fontSize="12" fill={MUTED} fontStyle="italic"
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.4, delay: showDetails ? 0.8 : 0, ease: EASE }}
      >
        Internal gate
      </motion.text>

      <motion.line
        x1="535" y1="265" x2="620" y2="175"
        stroke={BLUE} strokeWidth="1.5" markerEnd="url(#a-arrow-blue)"
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.4, delay: showDetails ? 0.8 : 0, ease: EASE }}
      />

      {/* Conviction node */}
      <motion.g
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.4, delay: showDetails ? 0.9 : 0, ease: EASE }}
      >
        <rect x="620" y="145" width="210" height="65" rx="8" fill={GRAY_BG} stroke={GRAY_BORDER} strokeWidth="1.5" />
        <text x="725" y="172" fontSize="16" fontWeight="600" fill="#1a1a1a" textAnchor="middle">Conviction</text>
        <text x="725" y="193" fontSize="12" fill={MUTED} textAnchor="middle">Threshold &middot; approve or flag</text>
      </motion.g>

      {/* Conviction → Deal outcomes feedback arc */}
      <motion.path
        d="M620 195 C500 220, 300 350, 235 490"
        fill="none" stroke={FEEDBACK_BORDER} strokeWidth="1.5" strokeDasharray="6 4" markerEnd="url(#a-arrow-feedback)"
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.4, delay: showDetails ? 1.2 : 0, ease: EASE }}
      />

      <motion.text
        x="640" y="340" fontSize="12" fill={MUTED} fontStyle="italic"
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.4, delay: showDetails ? 1.0 : 0, ease: EASE }}
      >
        Client-facing path
      </motion.text>

      <motion.line
        x1="535" y1="335" x2="620" y2="370"
        stroke={BLUE} strokeWidth="1.5" markerEnd="url(#a-arrow-blue)"
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.4, delay: showDetails ? 1.0 : 0, ease: EASE }}
      />

      {/* Plan node */}
      <motion.g
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.4, delay: showDetails ? 1.1 : 0, ease: EASE }}
      >
        <rect x="620" y="350" width="210" height="65" rx="8" fill={GRAY_BG} stroke={GRAY_BORDER} strokeWidth="1.5" />
        <text x="725" y="377" fontSize="16" fontWeight="600" fill="#1a1a1a" textAnchor="middle">Plan</text>
        <text x="725" y="398" fontSize="12" fill={MUTED} textAnchor="middle">Drivers &middot; talking points</text>
      </motion.g>

      {/* Plan → Client pitch */}
      <motion.g
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.4, delay: showDetails ? 1.3 : 0, ease: EASE }}
      >
        <line x1="830" y1="382" x2="860" y2="382" stroke={ORANGE} strokeWidth="1.5" markerEnd="url(#a-arrow-orange)" />
        <text x="868" y="378" fontSize="13" fontWeight="600" fill={ORANGE}>Client</text>
        <text x="868" y="394" fontSize="13" fontWeight="600" fill={ORANGE}>pitch</text>
      </motion.g>

      <motion.line
        x1="868" y1="400" x2="830" y2="490"
        stroke={ORANGE} strokeWidth="1.5" markerEnd="url(#a-arrow-orange)"
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.4, delay: showDetails ? 1.4 : 0, ease: EASE }}
      />

      {/* Negotiate node */}
      <motion.g
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.4, delay: showDetails ? 1.5 : 0, ease: EASE }}
      >
        <rect x="620" y="475" width="210" height="65" rx="8" fill={GRAY_BG} stroke={GRAY_BORDER} strokeWidth="1.5" />
        <text x="725" y="502" fontSize="16" fontWeight="600" fill="#1a1a1a" textAnchor="middle">Negotiate</text>
        <text x="725" y="523" fontSize="12" fill={MUTED} textAnchor="middle">Agent guardrails &middot; escalation</text>
      </motion.g>

      {/* Negotiate → Client closed */}
      <motion.g
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.4, delay: showDetails ? 1.6 : 0, ease: EASE }}
      >
        <line x1="830" y1="507" x2="860" y2="507" stroke={ORANGE} strokeWidth="1.5" markerEnd="url(#a-arrow-orange)" />
        <text x="868" y="503" fontSize="13" fontWeight="600" fill={ORANGE}>Client</text>
        <text x="868" y="519" fontSize="13" fontWeight="600" fill={ORANGE}>closed</text>
      </motion.g>

      {/* Negotiate → Deal outcomes feedback arc */}
      <motion.path
        d="M620 520 C480 560, 300 560, 235 520"
        fill="none" stroke={FEEDBACK_BORDER} strokeWidth="1.5" strokeDasharray="6 4" markerEnd="url(#a-arrow-feedback)"
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ duration: 0.4, delay: showDetails ? 1.7 : 0, ease: EASE }}
      />
    </>
  );
}

export function AppsToModelSlide() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setPhase(4), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <motion.div
        className="mb-4 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="mb-2 inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Apps → Model
        </span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          Feeding the Model
        </h2>
        <p className="mt-2 text-muted-foreground">
          Every quote generates execution data that makes the model smarter.
        </p>
      </motion.div>

      <div className="relative mx-auto max-h-[calc(100vh-14rem)] w-full">
        <svg
          viewBox="0 0 900 620"
          className="w-full"
          role="img"
          aria-label="Animation showing quoting apps converging into the Execution node of the ML pricing model hub-spoke diagram"
        >
          <defs>
            <marker id="a-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill={MUTED} />
            </marker>
            <marker id="a-arrow-blue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill={BLUE} />
            </marker>
            <marker id="a-arrow-orange" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill={ORANGE} />
            </marker>
            <marker id="a-arrow-feedback" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill={FEEDBACK_BORDER} />
            </marker>
          </defs>

          {/* Mini app cards that converge */}
          <MiniAppCard x={100} y={5} color={BLUE} label="Email Quoting" phase={phase} targetX={55} targetY={85} />
          <MiniAppCard x={365} y={5} color={ORANGE} label="Configured Products" phase={phase} targetX={55} targetY={85} />
          <MiniAppCard x={630} y={5} color={GREEN} label="Configured Services" phase={phase} targetX={55} targetY={85} />

          <AnimatedHubSpoke phase={phase} />
        </svg>
      </div>
    </div>
  );
}
