"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";

import { useLanguage } from "@/components/providers/LanguageProvider";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export const Process: React.FC = () => {
  const { t } = useLanguage();

  const steps: ProcessStep[] = [
    {
      number: "01",
      title: t("process.steps.discovery.title") as string || "Discovery",
      description: t("process.steps.discovery.description") as string || "We learn about your business, goals, and vision to create a tailored strategy.",
      icon: "search",
    },
    {
      number: "02",
      title: t("process.steps.design.title") as string || "Design",
      description: t("process.steps.design.description") as string || "Our designers craft stunning visuals that capture your brand identity.",
      icon: "palette",
    },
    {
      number: "03",
      title: t("process.steps.develop.title") as string || "Develop",
      description: t("process.steps.develop.description") as string || "We build your store with clean code and optimized performance.",
      icon: "code",
    },
    {
      number: "04",
      title: t("process.steps.launch.title") as string || "Launch",
      description: t("process.steps.launch.description") as string || "Your store goes live with full support and ongoing optimization.",
      icon: "rocket",
    },
  ];

  return (
    <Section background="default" className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-1/2 start-1/2 rtl:translate-x-1/2 ltr:-translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-500/5 to-transparent rounded-full"></div>
      </div>

      <SectionHeader
        title={t("process.title") as string || "How We Work"}
        subtitle={t("process.subtitle") as string || "A streamlined process designed for success"}
      />

      {/* Process Timeline */}
      <div className="relative">
        {/* Connection Line - Desktop */}
        <div className="hidden lg:block absolute top-24 start-0 end-0 h-0.5 bg-gradient-to-r from-transparent via-slate-200 dark:via-surface-700 to-transparent rtl:bg-gradient-to-l"></div>

        {/* Animated line overlay */}
        <motion.div
          className="hidden lg:block absolute top-24 start-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rtl:bg-gradient-to-l"
          initial={{ width: "0%" }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              {/* Step Card */}
              <div className="relative group">
                {/* Number Circle */}
                <motion.div
                  className="relative mx-auto w-20 h-20 mb-8"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl opacity-20 blur-lg group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative w-full h-full bg-white dark:bg-surface-900 border-2 border-slate-200 dark:border-surface-700 group-hover:border-accent-500/50 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg">
                    <span className="text-2xl font-display font-bold bg-gradient-to-br from-primary-600 to-accent-600 bg-clip-text text-transparent">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon floating above */}
                  <div className="absolute -top-2 -end-2 w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                    <Icon name={step.icon} className="w-4 h-4 text-white" size={16} />
                  </div>
                </motion.div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 dark:text-surface-300 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>

                {/* Connection arrow - Mobile/Tablet */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center py-6">
                    <motion.svg
                      className="w-6 h-6 text-accent-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </motion.svg>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};
