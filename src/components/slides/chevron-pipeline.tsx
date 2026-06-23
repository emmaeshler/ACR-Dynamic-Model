"use client";

import { motion } from "framer-motion";

const STEPS = ["Inputs", "Segmentation", "Parameters", "Outputs"] as const;
export type PipelineStep = (typeof STEPS)[number];

const NAVY = "#00446A";
const ORANGE = "#E56910";
const MUTED = "#94a3b8";

export const PIPELINE_STEPS = STEPS;

interface ChevronPipelineProps {
  activeStep?: PipelineStep;
  reachedStep?: number;
}

export function ChevronPipeline({ activeStep, reachedStep }: ChevronPipelineProps) {
  const activeIdx = activeStep ? STEPS.indexOf(activeStep) : -1;

  return (
    <div className="flex w-full">
      {STEPS.map((step, i) => {
        const isActive = step === activeStep;
        const isReached = reachedStep !== undefined ? i <= reachedStep : true;
        const isFirst = i === 0;
        const bg = isActive ? ORANGE : isReached ? NAVY : MUTED;

        return (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="relative flex-1"
          >
            <svg viewBox="0 0 200 40" className="w-full h-10" preserveAspectRatio="none">
              <motion.path
                d={
                  isFirst
                    ? "M0,0 L180,0 L200,20 L180,40 L0,40 Z"
                    : "M0,0 L180,0 L200,20 L180,40 L0,40 L20,20 Z"
                }
                fill={bg}
                animate={{ fill: bg, fillOpacity: isActive ? 1 : isReached ? 0.85 : 0.3 }}
                transition={{ duration: 0.4 }}
              />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center text-xs font-semibold tracking-wide text-white uppercase"
              style={{ opacity: isReached ? 1 : 0.5 }}
            >
              {step}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
