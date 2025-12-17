"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/Section";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface WhyItem {
  title: string;
  description: string;
  icon: string;
}

export const WhyChoose: React.FC = () => {
  const { t } = useLanguage();
  const values = (t("whyChoose.items") as WhyItem[]) || [];

  // Card variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, type: "spring", stiffness: 100 },
    },
  };

  // Bento layout configuration for 5 items
  const getGridClass = (index: number) => {
    const layouts = [
      "md:col-span-2 md:row-span-2", // Large featured (top-left)
      "md:col-span-1",               // Standard (top-right)
      "md:col-span-1",               // Standard (middle-right)
      "md:col-span-1",               // Standard (bottom-left)
      "md:col-span-2",               // Wide card (bottom-right)
    ];
    return layouts[index] || "md:col-span-1";
  };

  const isFeature = (index: number) => index === 0;

  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative bg-white dark:bg-surface-800 overflow-hidden">
      {/* Subtle background texture - positioned to extend beyond section */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen max-w-[100vw] bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.06),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.05),transparent_40%)]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
      <div className="relative">
        <SectionHeader
          title={t("whyChoose.title") as string}
          subtitle={t("whyChoose.subtitle") as string}
        />

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 auto-rows-fr mt-12"
        >
          {values.map((value, index) => (
            <motion.div
              key={`${value.title}-${index}`}
              variants={cardVariants}
              className={`${getGridClass(index)} group`}
            >
              <div
                className={`
                  h-full relative rounded-3xl transition-all duration-500 ease-out
                  ${isFeature(index)
                    ? "p-8 md:p-10 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white shadow-2xl shadow-primary-500/25 group-hover:shadow-[0_25px_60px_-12px_rgba(99,102,241,0.4)] overflow-visible"
                    : "p-6 md:p-7 bg-white dark:bg-surface-800/90 border border-slate-200/60 dark:border-surface-700/60 shadow-lg group-hover:shadow-xl dark:shadow-surface-950/20 overflow-hidden"
                  }
                  group-hover:-translate-y-1
                `}
              >
                {/* Decorative gradient overlay for featured card */}
                {isFeature(index) && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 rounded-3xl" />
                    <div className="absolute -top-[200px] -end-[200px] w-80 h-80 bg-white/15 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-[150px] -start-[150px] w-64 h-64 bg-accent-400/20 rounded-full blur-3xl pointer-events-none"></div>
                  </>
                )}

                {/* Hover gradient overlay for regular cards */}
                {!isFeature(index) && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/[0.03] via-transparent to-accent-500/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                )}

                <div className="relative z-10 h-full flex flex-col">
                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h3
                      className={`
                        font-display font-bold leading-tight mb-3 transition-colors duration-300
                        ${isFeature(index)
                          ? "text-2xl md:text-3xl text-white"
                          : "text-lg md:text-xl text-slate-900 dark:text-white"
                        }
                      `}
                    >
                      {value.title}
                    </h3>
                    <p
                      className={`
                        leading-relaxed
                        ${isFeature(index)
                          ? "text-base md:text-lg text-white/90"
                          : "text-sm md:text-base text-slate-600 dark:text-surface-300"
                        }
                      `}
                    >
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      </div>
    </section>
  );
};

