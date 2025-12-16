"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

import { useLanguage } from "@/components/providers/LanguageProvider";

export const CTABanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-50 dark:bg-surface-950">
      <div className="absolute inset-0 bg-gradient-brand opacity-[0.03] dark:opacity-15"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.2),transparent_70%)]"></div>

      {/* Ambient Glow Orbs */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary-400/10 dark:bg-primary-500/20 rounded-full blur-[100px] animate-pulse-glow"></div>
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-accent-400/10 dark:bg-accent-500/15 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            {t("ctaBanner.titlePart1") as string}{" "}
            <span className="gradient-text text-glow-subtle">{t("ctaBanner.titlePart2") as string}</span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-600 dark:text-surface-200 font-light leading-relaxed max-w-2xl mx-auto"
          >
            {t("ctaBanner.description") as string}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
            className="pt-4"
          >
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="text-xl px-14 py-6 font-black shadow-glow-primary">
                {t("ctaBanner.button") as string}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

