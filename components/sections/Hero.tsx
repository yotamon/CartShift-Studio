"use client";

import React from "react";
import { motion } from "framer-motion";
import { HeroForm } from "@/components/forms/HeroForm";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { ArrowRight, ArrowDown, Sparkles } from "lucide-react";

export const Hero: React.FC = () => {
  const { t, direction } = useLanguage();
  const isRtl = direction === 'rtl';

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center py-16 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-50 dark:bg-surface-950">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-surface-950 dark:to-surface-900 opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-5"></div>

      {/* Animated Orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[45rem] h-[45rem] bg-primary-400/10 dark:bg-primary-600/15 rounded-full blur-[120px] animate-slow-spin"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[45rem] h-[45rem] bg-accent-400/5 dark:bg-accent-600/10 rounded-full blur-[120px] animate-slow-spin" style={{ animationDirection: 'reverse' }}></div>

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-20 left-[10%] w-20 h-20 border-2 border-primary-500/20 rounded-xl"
        animate={{
          rotate: [0, 90, 180, 270, 360],
          y: [0, -20, 0, 20, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-20 right-[10%] w-16 h-16 border-2 border-accent-500/20 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-[5%] w-24 h-24 border border-primary-400/10 rounded-2xl"
        animate={{
          rotate: [0, -45, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-[8%] w-12 h-12 bg-accent-500/5 rounded-lg"
        animate={{
          y: [0, 30, 0],
          rotate: [0, 45, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 left-[15%] w-14 h-14 border-2 border-primary-400/15 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/4 right-[20%] w-16 h-16 border border-accent-400/10 rounded-lg"
        animate={{
          y: [0, -25, 0],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[15%] left-[25%] w-10 h-10 border-2 border-primary-400/20 rounded-full"
        animate={{
          scale: [1, 1.4, 1],
          rotate: [0, 360]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[25%] right-[25%] w-20 h-20 border border-accent-500/15 rounded-xl"
        animate={{
          y: [0, -30, 0],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[60%] left-[20%] w-8 h-8 bg-primary-500/10 rounded-lg"
        animate={{
          rotate: [0, 180, 360],
          x: [0, 15, 0]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[40%] left-[8%] w-28 h-28 border-2 border-primary-400/12 rounded-3xl"
        animate={{
          rotate: [0, 45, -45, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[35%] right-[12%] w-6 h-6 border border-accent-400/20 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[15%] left-[30%] w-12 h-12 border-2 border-primary-500/18 rounded-lg"
        animate={{
          y: [0, 25, 0],
          rotate: [0, 360]
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[45%] left-[12%] w-16 h-16 bg-accent-400/8 rounded-2xl"
        animate={{
          rotate: [0, -180, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[50%] right-[18%] w-20 h-20 border border-primary-400/10 rounded-full"
        animate={{
          scale: [1, 1.25, 1],
          rotate: [0, 90, 180, 270, 360]
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-[25%] left-[35%] w-14 h-14 border-2 border-accent-500/20 rounded-xl"
        animate={{
          rotate: [0, 45, 0, -45, 0],
          x: [0, 10, 0, -10, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[30%] right-[30%] w-10 h-10 bg-primary-500/8 rounded-lg"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[55%] right-[5%] w-16 h-16 border border-accent-400/12 rounded-2xl"
        animate={{
          y: [0, -35, 0],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[22%] w-8 h-8 border-2 border-primary-400/25 rounded-full"
        animate={{
          scale: [1, 1.6, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[70%] left-[18%] w-12 h-12 border border-accent-500/15 rounded-lg"
        animate={{
          rotate: [0, 180, 360],
          x: [0, -15, 0, 15, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[40%] right-[35%] w-24 h-24 border-2 border-primary-400/10 rounded-3xl"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-[60%] left-[28%] w-6 h-6 bg-accent-500/12 rounded-full"
        animate={{
          scale: [1, 1.4, 1],
          y: [0, -20, 0]
        }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[80%] right-[22%] w-14 h-14 border border-primary-500/18 rounded-xl"
        animate={{
          rotate: [0, 90, 0, -90, 0],
          y: [0, 20, 0]
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] left-[40%] w-10 h-10 border-2 border-accent-400/20 rounded-lg"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[50%] left-[42%] w-8 h-8 bg-primary-400/10 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[45%] right-[40%] w-16 h-16 border border-accent-500/12 rounded-2xl"
        animate={{
          y: [0, -25, 0, 25, 0],
          rotate: [0, 45, 0]
        }}
        transition={{ duration: 13.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 md:space-y-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-premium"
            >
              <Sparkles className="w-4 h-4 text-accent-500" />
              <span className="text-slate-700 dark:text-surface-200 text-sm font-semibold">
                {t("hero.tag") as string}
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white">
              {t("hero.titleLine1") as string} <br />
              <span className="gradient-text text-glow-subtle">{t("hero.titleLine2") as string}</span>
            </h1>

            <motion.p
              className="text-lg md:text-xl text-slate-600 dark:text-surface-300 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t("hero.description") as string}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <a href="#contact-form" className="w-full sm:w-auto">
                <Button size="lg" className="group text-base md:text-lg px-8 md:px-10 py-4 md:py-5 shadow-premium hover:shadow-premium-hover w-full sm:w-auto">
                  <span className="relative z-10 flex items-center gap-3 justify-center">
                    {t("hero.primaryCta") as string}
                    <motion.div
                      animate={{ x: isRtl ? [0, -5, 0] : [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                    </motion.div>
                  </span>
                </Button>
              </a>
              <a href="/solutions/shopify" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="text-base md:text-lg px-8 md:px-10 py-4 md:py-5 shadow-premium hover:shadow-premium-hover w-full sm:w-auto">
                  {t("hero.secondaryCta") as string}
                </Button>
              </a>
            </motion.div>

            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.8, duration: 1 }}
               className="pt-8 md:pt-10 border-t border-slate-200 dark:border-white/5 flex flex-wrap gap-8 md:gap-12"
            >
                <div className="flex flex-col">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-1">{t("hero.stats.clients.value") as string}</span>
                    <span className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-surface-400 font-medium">{t("hero.stats.clients.label") as string}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-1">{t("hero.stats.dedication.value") as string}</span>
                    <span className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-surface-400 font-medium">{t("hero.stats.dedication.label") as string}</span>
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
          <ArrowDown className="w-6 h-6" strokeWidth={2} />
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-50 dark:from-surface-950 via-slate-50/50 dark:via-surface-950/50 to-transparent z-20"></div>
    </section>
  );
};

