"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const NAVY = "#00446A";
const ORANGE = "#E56910";
const MUTED = "#5A6A78";

const ATTRIBUTES = [
  "SKU",
  "Day of week",
  "Region",
  "Payment terms",
  "Channel",
  "Sales rep",
  "Lead source",
  "Quarter",
  "Discount tier",
  "Shipping mode",
  "Industry",
  "Order Size",
  "Account age",
  "Customer Tier",
  "Currency",
  "Product line",
];

const DRIVERS: Record<number, { label: string; variance: string }> = {
  2: { label: "Region", variance: "64%" },
  4: { label: "Channel", variance: "18%" },
  11: { label: "Order Size", variance: "7%" },
  13: { label: "Customer Tier", variance: "3%" },
};

const DRIVER_INDICES = new Set(Object.keys(DRIVERS).map(Number));

export function AttributeGridVisual() {
  const [phase, setPhase] = useState<"all" | "highlight">("all");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("highlight"), 1500);
    const t2 = setTimeout(() => setPhase("all"), 6000);
    const t3 = setTimeout(() => setPhase("highlight"), 7500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {ATTRIBUTES.map((attr, i) => {
          const isDriver = DRIVER_INDICES.has(i);
          const dimmed = phase === "highlight" && !isDriver;
          const driver = DRIVERS[i];

          return (
            <motion.div
              key={attr}
              className="relative rounded-lg border p-2 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: dimmed ? 0.25 : 1,
                scale: 1,
                borderColor: isDriver && phase === "highlight" ? ORANGE : "#e5e7eb",
              }}
              transition={{
                opacity: { duration: 0.4 },
                scale: { duration: 0.3, delay: i * 0.04 },
                borderColor: { duration: 0.3 },
              }}
              style={{
                backgroundColor:
                  isDriver && phase === "highlight"
                    ? "rgba(229, 105, 16, 0.08)"
                    : "rgba(245, 248, 250, 0.5)",
              }}
            >
              <p
                className="text-[10px] font-semibold"
                style={{
                  color:
                    isDriver && phase === "highlight" ? ORANGE : MUTED,
                }}
              >
                {attr}
              </p>
              {driver && phase === "highlight" && (
                <motion.p
                  className="mt-0.5 text-xs font-bold"
                  style={{ color: NAVY }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {driver.variance}
                </motion.p>
              )}
              {!isDriver && phase === "highlight" && (
                <motion.p
                  className="mt-0.5 text-[9px] italic text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  noise
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Summary bar */}
      <motion.div
        className="flex items-center justify-center gap-4 text-xs"
        animate={{ opacity: phase === "highlight" ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
      >
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: ORANGE }}
          />
          <span className="font-semibold">4 drivers</span>
          <span className="text-muted-foreground">explain 92% of variance</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-gray-300" />
          <span className="text-muted-foreground">12 are noise</span>
        </span>
      </motion.div>
    </div>
  );
}
