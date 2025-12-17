"use client";

import React from "react";
import { motion } from "framer-motion";
import { HeroForm } from "@/components/forms/HeroForm";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/components/providers/LanguageProvider";

export const Hero: React.FC = () => {
  const { t, direction } = useLanguage();
  const isRtl = direction === 'rtl';

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-50 dark:bg-surface-950">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-surface-950 dark:to-surface-900 opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-5"></div>

      {/* Animated Orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[45rem] h-[45rem] bg-primary-400/10 dark:bg-primary-600/15 rounded-full blur-[120px] animate-slow-spin"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[45rem] h-[45rem] bg-accent-400/5 dark:bg-accent-600/10 rounded-full blur-[120px] animate-slow-spin" style={{ animationDirection: 'reverse' }}></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-premium"
            >
              <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
              <span className="text-slate-700 dark:text-surface-200 text-sm font-semibold">
                {t("hero.tag") as string}
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white">
              {t("hero.titleLine1") as string} <br />
              <span className="gradient-text text-glow-subtle">{t("hero.titleLine2") as string}</span>
            </h1>

            <motion.p
              className="text-lg md:text-xl text-slate-600 dark:text-surface-200 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t("hero.description") as string}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <a href="#contact-form">
                <Button size="lg" className="group text-lg px-10 py-5 shadow-premium hover:shadow-premium-hover">
                  <span className="relative z-10 flex items-center gap-3">
                    {t("hero.primaryCta") as string}
                    <motion.svg
                      className="w-5 h-5 rtl:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      animate={{ x: isRtl ? [0, -5, 0] : [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </motion.svg>
                  </span>
                </Button>
              </a>
              <a href="/solutions/shopify">
                <button className="px-8 py-4 rounded-xl border-2 border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-bold text-lg transition-all hover:bg-slate-50 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/20 backdrop-blur-md shadow-premium">
                  {t("hero.secondaryCta") as string}
                </button>
              </a>
            </motion.div>

            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.8, duration: 1 }}
               className="pt-10 border-t border-slate-200 dark:border-white/5 flex gap-12"
            >
                <div className="flex flex-col">
                    <span className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-1">{t("hero.stats.clients.value") as string}</span>
                    <span className="text-sm md:text-base text-slate-500 dark:text-surface-400 font-medium">{t("hero.stats.clients.label") as string}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-1">{t("hero.stats.dedication.value") as string}</span>
                    <span className="text-sm md:text-base text-slate-500 dark:text-surface-400 font-medium">{t("hero.stats.dedication.label") as string}</span>
                </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 50 }}
            id="contact-form"
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-brand opacity-15 blur-3xl rounded-full"></div>
            <div className="relative">
              <HeroForm />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-slate-500 dark:text-surface-400 hover:text-slate-700 dark:hover:text-surface-200 transition-colors cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-sm font-medium">{t("hero.scrollIndicator") as string}</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-50 dark:from-surface-950 via-slate-50/50 dark:via-surface-950/50 to-transparent z-20"></div>
    </section>
  );
};

