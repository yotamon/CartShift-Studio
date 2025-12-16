"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";

import { useLanguage } from "@/components/providers/LanguageProvider";

export const WhyChoose: React.FC = () => {
  const { t } = useLanguage();
  const values = t("whyChoose.items") as any[];

  return (
    <Section background="light">
      <SectionHeader
        title={t("whyChoose.title") as string}
        subtitle={t("whyChoose.subtitle") as string}
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {values.map((value, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, type: "spring" }}
          >
            <Card hover glow className="h-full group relative overflow-hidden">
              <div className="absolute top-6 right-6 rtl:left-6 rtl:right-auto text-6xl font-display font-bold text-slate-200/20 dark:text-white/5">
                {String(index + 1).padStart(2, '0')}
              </div>
              <CardHeader>
                <div className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center border border-slate-200 dark:border-white/10">
                  <Icon name={value.icon} className="w-8 h-8 text-accent-500 dark:text-accent-400" size={32} />
                </div>
                <CardTitle className="text-xl md:text-2xl">{value.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm md:text-base leading-relaxed">
                {value.description}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

