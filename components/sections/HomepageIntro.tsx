"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { useLanguage } from "@/components/providers/LanguageProvider";

export const HomepageIntro: React.FC = () => {
  const { t } = useLanguage();
  const introData = t("hero.intro") as { title: string; paragraphs: string[] };

  return (
    <Section background="light" className="relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white font-display mb-8 text-center leading-tight tracking-tight"
        >
          {introData.title}
        </motion.h2>
        <div className="space-y-6">
          {introData.paragraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-base md:text-lg text-slate-600 dark:text-surface-300 leading-relaxed"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </Section>
  );
};

