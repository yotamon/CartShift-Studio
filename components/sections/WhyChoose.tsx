"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";

import { useLanguage } from "@/components/providers/LanguageProvider";

export const WhyChoose: React.FC = () => {
  const { t } = useLanguage();
  const values = t("whyChoose.items") as any[];

  // Bento grid configuration - first item is featured (larger)
  const getBentoClass = (index: number) => {
    switch (index) {
      case 0:
        return "md:col-span-2 md:row-span-2"; // Large featured card
      case 1:
        return "md:col-span-1"; // Standard
      case 2:
        return "md:col-span-1"; // Standard
      case 3:
        return "md:col-span-2"; // Wide card
      default:
        return "";
    }
  };

  const isFeatureCard = (index: number) => index === 0;

  return (
    <Section background="light">
      <SectionHeader
        title={t("whyChoose.title") as string}
        subtitle={t("whyChoose.subtitle") as string}
      />

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 auto-rows-fr">
        {values.map((value, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
            className={getBentoClass(index)}
          >
            <div
              className={`
                h-full rounded-3xl p-7 md:p-8 relative overflow-hidden transition-all duration-300
                group hover:scale-[1.02] hover:-translate-y-1
                ${isFeatureCard(index)
                  ? 'bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white shadow-xl shadow-primary-500/25'
                  : 'glass-effect shadow-premium hover:shadow-premium-hover'
                }
              `}
            >
              {/* Decorative elements for featured card */}
              {isFeatureCard(index) && (
                <>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                </>
              )}

              {/* Number badge */}
              <div
                className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center mb-6 font-display font-bold text-xl
                  transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
                  ${isFeatureCard(index)
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-slate-100 dark:bg-surface-800 text-accent-600 dark:text-accent-400 border border-slate-200 dark:border-surface-700'
                  }
                `}
              >
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Icon (smaller, accent) */}
              <div className={`mb-4 ${isFeatureCard(index) ? 'text-white/80' : 'text-accent-500 dark:text-accent-400'}`}>
                <Icon name={value.icon} className="w-6 h-6" size={24} />
              </div>

              {/* Content */}
              <h3
                className={`
                  font-display font-bold leading-tight tracking-tight mb-4
                  ${isFeatureCard(index)
                    ? 'text-2xl md:text-3xl lg:text-4xl text-white'
                    : 'text-xl md:text-2xl text-slate-900 dark:text-white'
                  }
                `}
              >
                {value.title}
              </h3>
              <p
                className={`
                  leading-relaxed
                  ${isFeatureCard(index)
                    ? 'text-base md:text-lg text-white/90'
                    : 'text-sm md:text-base text-slate-600 dark:text-surface-300'
                  }
                `}
              >
                {value.description}
              </p>

              {/* Subtle corner accent for non-featured cards */}
              {!isFeatureCard(index) && (
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent-500/5 to-primary-500/5 rounded-bl-[80px]"></div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

