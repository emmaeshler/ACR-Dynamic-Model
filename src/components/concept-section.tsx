"use client";

import { ComponentType, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useDepth } from "@/lib/depth-context";
import { ZoomView } from "@/components/zoom-view";

interface ConceptSectionProps {
  slug: string;
  order: number;
  title: string;
  caption: string;
  low: ComponentType;
  medium: ComponentType;
  high: ComponentType;
  highSummary: string;
  onContinue?: () => void;
}

export function ConceptSection({
  slug,
  title,
  caption,
  low: Low,
  medium,
  high,
  highSummary,
  onContinue,
}: ConceptSectionProps) {
  const { getSection } = useDepth();
  getSection(slug);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.96]);

  const [deepVisible, setDeepVisible] = useState(false);
  const deepRef = useRef<HTMLDivElement>(null);
  const [ctaReady, setCtaReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCtaReady(true), 14000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!deepRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setDeepVisible(true);
      },
      { threshold: 0.15 },
    );
    observer.observe(deepRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full">
      {/* Hero — immersive full-screen presentation */}
      <motion.div
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative -mt-14 flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden pt-20 pb-10"
      >
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#06283D] to-[#0a1929]" />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Floating accent dots */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 700" aria-hidden="true">
          {[
            [120, 140, 2.5], [280, 520, 2], [450, 100, 3], [680, 580, 2.5],
            [850, 160, 2], [1050, 480, 3], [180, 380, 2], [960, 320, 2.5],
          ].map(([cx, cy, r], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill={i % 3 === 0 ? "#E56910" : i % 2 === 0 ? "#21A5D5" : "white"}
              opacity={0.12}
            />
          ))}
        </svg>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
          <div className="mb-5 text-center lg:mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-6xl">
              {title}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-base leading-relaxed text-white/55 lg:mt-4 lg:text-lg">
              {caption}
            </p>
          </div>

          <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white/[0.97] p-4 shadow-2xl ring-1 ring-white/10 lg:p-5">
            <Low />
          </div>

          <div className="mt-8 flex flex-col items-center">
            {onContinue ? (
              <motion.button
                onClick={onContinue}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: ctaReady ? 1 : 0.4, y: 0 }}
                transition={{ duration: 0.6 }}
                className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
              >
                Continue
                <motion.span
                  animate={ctaReady ? { x: [0, 4, 0] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </motion.button>
            ) : (
              <div className="flex flex-col items-center gap-1 text-xs text-white/30">
                <span>Scroll to explore</span>
                <motion.span
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  ↓
                </motion.span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Deeper content — slides up into view */}
      <div ref={deepRef} className="relative mx-auto max-w-5xl px-6 pb-16">
        <div className="absolute inset-x-0 -top-24 h-24 bg-gradient-to-b from-transparent to-background" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={deepVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              How it works
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <ZoomView
            slug={slug}
            medium={medium}
            high={high}
            highSummary={highSummary}
          />
        </motion.div>
      </div>
    </section>
  );
}
