"use client";

import { motion } from "framer-motion";
import { BLUE, ORANGE, GREEN, NAVY, MUTED } from "./hub-spoke-diagram";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

function StatBadge({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg border bg-white/80 px-4 py-3">
      <span className="text-2xl font-bold" style={{ color }}>{value}</span>
      <span className="mt-0.5 text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function EmailQuotingSlide() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp} className="mb-6">
          <span
            className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: NAVY }}
          >
            Email Quoting
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Automated Inbox-to-Quote
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Turn a 40-minute manual quoting process into an instant, automated
            response — directly from the CSR&apos;s inbox.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Screenshot area — large, left 3 cols */}
          <div className="relative lg:col-span-3">
            <div className="overflow-hidden rounded-xl border shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/screenshots/email-quoting.png"
                alt="CSR inbox showing auto-quoted email response with pricing table for tapered reel and spool packaging configurations"
                className="w-full"
              />
            </div>
          </div>

          {/* Description — right 2 cols */}
          <div className="flex flex-col justify-between gap-5 lg:col-span-2">
            <motion.div variants={fadeUp} className="space-y-4">
              <div className="rounded-lg border-l-4 bg-muted/30 py-3 pl-4 pr-3" style={{ borderColor: NAVY }}>
                <h3 className="text-sm font-semibold">How it works</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Customer emails a quote request — for multiple product sizes,
                  rush orders, quantity breaks, or complex configurations. The
                  system parses the request, matches SKUs, enforces your pricing
                  rules, and sends a complete quote back — automatically.
                </p>
              </div>

              <div className="rounded-lg border-l-4 bg-muted/30 py-3 pl-4 pr-3" style={{ borderColor: ORANGE }}>
                <h3 className="text-sm font-semibold">What it handles</h3>
                <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                  <li>• Multi-SKU quotes across sizes &amp; configurations</li>
                  <li>• Rush order pricing with expedited shipping</li>
                  <li>• MOQ enforcement &amp; quantity break tiers</li>
                  <li>• Customer-specific contract pricing</li>
                  <li>• Ambiguous requests flagged for CSR review</li>
                </ul>
              </div>

              <div className="rounded-lg border-l-4 bg-muted/30 py-3 pl-4 pr-3" style={{ borderColor: GREEN }}>
                <h3 className="text-sm font-semibold">Human in the loop</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  High-confidence quotes send automatically. Low-confidence
                  matches get routed to the CSR for review. Quotes above a
                  dollar threshold require approval before sending.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
              <StatBadge value="75%" label="Auto-quoted" color={NAVY} />
              <StatBadge value="40 min" label="→ Instant" color={ORANGE} />
              <StatBadge value="12/day" label="Avg. quotes" color={GREEN} />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function ConfiguredProductsSlide() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp} className="mb-6">
          <span
            className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: ORANGE }}
          >
            Configured Products
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Configured Product Quoting
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            SKU lookup, variant selection, and tier-based pricing — all in one
            conversational interface.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="relative lg:col-span-3">
            <div className="overflow-hidden rounded-xl border shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/screenshots/configured-products.png"
                alt="Configured product quoting interface showing SKU pricing table with budgetary estimate"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center gap-5 lg:col-span-2">
            <motion.div variants={fadeUp} className="space-y-4">
              <div className="rounded-lg border-l-4 bg-muted/30 py-3 pl-4 pr-3" style={{ borderColor: ORANGE }}>
                <h3 className="text-sm font-semibold">Coming soon</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Details for this slide will be added next.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function ConfiguredServicesSlide() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp} className="mb-6">
          <span
            className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: BLUE }}
          >
            Configured Services
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Service Job Quoting
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Describe the job, get a quote range in seconds — parts, labor, and
            time broken down and emailed to the customer. Finalize the exact
            amount on site.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Screenshot 1: Chat with suggested parts */}
          <div className="relative">
            <div className="overflow-hidden rounded-xl border shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/screenshots/configured-services-2.png"
                alt="Service quoting chat: tech describes the job and the system suggests parts with pricing"
                className="w-full"
              />
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Describe the service need — system recommends parts &amp; pricing
            </p>
          </div>

          {/* Screenshot 2: Draft email with full breakdown */}
          <div className="relative">
            <div className="overflow-hidden rounded-xl border shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/screenshots/configured-services-1.png"
                alt="Generated draft email with parts, labor, and estimated price range ready to send"
                className="w-full"
              />
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Complete quote with parts, labor &amp; price range — ready to send
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border-l-4 bg-muted/30 py-3 pl-4 pr-3" style={{ borderColor: BLUE }}>
            <h3 className="text-sm font-semibold">Speed over formality</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              No formal tracking or approval chains. The goal is getting
              customers a quote range as fast as possible so work can start.
              The exact amount is finalized after the job.
            </p>
          </div>

          <div className="rounded-lg border-l-4 bg-muted/30 py-3 pl-4 pr-3" style={{ borderColor: ORANGE }}>
            <h3 className="text-sm font-semibold">Full job breakdown</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Quotes break down into parts, labor hours, and materials — with
              a price range that accounts for site conditions. A model
              calculates pricing from historical job data.
            </p>
          </div>

          <div className="rounded-lg border-l-4 bg-muted/30 py-3 pl-4 pr-3" style={{ borderColor: GREEN }}>
            <h3 className="text-sm font-semibold">Quote to email in seconds</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Describe what the customer needs, confirm the suggested parts, and
              a draft email with the full breakdown is generated — ready to copy
              or send directly.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
