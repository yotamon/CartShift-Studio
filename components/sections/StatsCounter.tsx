"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const AnimatedCounter: React.FC<{ value: number; suffix: string; inView: boolean }> = ({
  value,
  suffix,
  inView
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, inView]);

  return (
    <span className="tabular-nums">
      {count}{suffix}
    </span>
  );
};

export const StatsCounter: React.FC = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats: Stat[] = [
    {
      value: 150,
      suffix: "+",
      label: t("stats.projects.label") as string || "Projects Delivered",
    },
    {
      value: 98,
      suffix: "%",
      label: t("stats.satisfaction.label") as string || "Client Satisfaction",
    },
    {
      value: 12,
      suffix: "+",
      label: t("stats.years.label") as string || "Years Experience",
    },
    {
      value: 24,
      suffix: "/7",
      label: t("stats.support.label") as string || "Support Available",
    },
  ];

  return (
    <section ref={ref} className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Gradient background strip */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600"></div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="stats-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#stats-grid)" />
        </svg>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center relative"
            >
              {/* Divider for desktop - between items */}
              {index > 0 && (
                <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-20 bg-white/20"></div>
              )}

              <motion.div
                initial={{ scale: 0.5 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring" }}
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-3 tracking-tight">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    inView={isInView}
                  />
                </div>
                <div className="text-sm md:text-base text-white/80 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
