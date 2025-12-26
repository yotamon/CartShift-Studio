"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { useTranslations } from "next-intl";

export const HomepageIntro: React.FC = () => {
  const t = useTranslations();
  const introData = t.raw("hero.intro" as any) as { title: string; paragraphs: string[] };

  if (!introData || typeof introData !== 'object' || !introData.title || !Array.isArray(introData.paragraphs)) {
    throw new Error(`Invalid translation structure for "hero.intro". Expected { title: string, paragraphs: string[] }, got: ${JSON.stringify(introData)}`);
  }

  return (
    <Section background="light" className="relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white font-display mb-8 text-center leading-tight tracking-tight"
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
              className="text-base md:text-lg text-surface-600 dark:text-surface-300 leading-relaxed"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </Section>
  );
};










