'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FAQ, FAQItem } from '@/components/ui/FAQ';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { trackCTAClick } from '@/lib/analytics';

export const ClientPortalPageContent: React.FC = () => {
  const { t } = useLanguage();

  const getString = (path: string): string => {
    const value = t(path);
    return typeof value === 'string' ? value : String(value);
  };

  const highlights = t('clientPortal.hero.highlights') as unknown as string[];
  const painItems = t('clientPortal.pain.items') as unknown as string[];
  const cards = t('clientPortal.differentiation.cards') as unknown as Array<{
    title: string;
    description: string;
  }>;
  const steps = t('clientPortal.process.steps') as unknown as Array<{
    title: string;
    description: string;
  }>;
  const features = t('clientPortal.features.items') as unknown as string[];
  const lanes = t('clientPortal.services.lanes') as unknown as string[];
  const faqItems = t('clientPortal.faq.items') as unknown as FAQItem[];

  const iconMap: Record<string, React.ReactElement> = {
    0: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    1: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
    2: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    3: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
        />
      </svg>
    ),
  };

  return (
    <>
      {/* Hero Highlights - More Premium */}
      <Section background="default" className="pt-0 -mt-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative px-6 py-5 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-3 h-3 rounded-full bg-gradient-to-br from-accent-500 to-primary-500" />
                    <p className="text-base font-semibold text-surface-800 dark:text-surface-100">
                      {h}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* The Pain - More Dramatic */}
      <Section background="light" className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-500/5 to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white font-display mb-6 leading-tight tracking-tight">
              {getString('clientPortal.pain.title')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {painItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group"
              >
                <div className="relative h-full p-6 bg-white dark:bg-surface-800 rounded-2xl border border-red-200/50 dark:border-red-500/20 hover:border-red-300 dark:hover:border-red-500/40 transition-all duration-300 hover:shadow-lg">
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-4 h-4 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <p className="text-surface-700 dark:text-surface-200 leading-relaxed pr-8">
                    {item}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* The Differentiator - Elevated */}
      <Section background="default" className="relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-20 -left-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 -right-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-surface-900 dark:text-white font-display mb-6 leading-tight">
              {getString('clientPortal.differentiation.title')}
            </h2>
            <p className="text-xl md:text-2xl text-surface-600 dark:text-surface-300 font-light">
              {getString('clientPortal.differentiation.description')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {cards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group"
              >
                <div className="relative h-full">
                  {/* Gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-accent-500/20 to-primary-600/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                  <Card
                    hover
                    className="h-full relative border-2 border-transparent group-hover:border-accent-500/30 transition-all duration-500"
                  >
                    <CardHeader className="pb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        {iconMap[i.toString()]}
                      </div>
                      <CardTitle className="text-2xl mb-3">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base leading-relaxed text-surface-600 dark:text-surface-400">
                        {card.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* How it Works - More Visual */}
      <Section background="light" className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title={getString('clientPortal.process.title')}
            subtitle={getString('clientPortal.process.subtitle')}
          />

          <div className="relative mt-16">
            {/* Flowing connection line for desktop */}
            <div className="hidden lg:block absolute left-0 right-0 top-16">
              <svg className="w-full h-24" preserveAspectRatio="none" viewBox="0 0 1000 100">
                <motion.path
                  d="M 0 50 Q 250 10, 500 50 T 1000 50"
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  strokeDasharray="10 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.3 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="grid lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="relative"
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Step number circle */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full blur-lg opacity-50" />
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                        {i + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-surface-200 dark:border-surface-700">
                      <h3 className="text-lg font-bold mb-3 text-surface-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* What You See - More Premium */}
      <Section background="default" className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-surface-900 dark:text-white font-display mb-8 leading-tight">
                {getString('clientPortal.features.title')}
              </h2>
              <div className="space-y-6">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-lg text-surface-700 dark:text-surface-200 leading-relaxed pt-2">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 rounded-3xl blur-2xl opacity-50" />

              {/* Mock Dashboard */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <div className="absolute inset-0 p-8 flex flex-col gap-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-48 bg-white/10 rounded-lg backdrop-blur-sm" />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500" />
                  </div>

                  {/* Status Cards */}
                  <div className="grid grid-cols-4 gap-4">
                    {['primary', 'accent', 'slate', 'green'].map((color, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className={`relative h-24 rounded-xl border ${
                          color === 'primary'
                            ? 'bg-primary-500/20 border-primary-500/30'
                            : color === 'accent'
                              ? 'bg-accent-500/20 border-accent-500/30'
                              : color === 'green'
                                ? 'bg-green-500/20 border-green-500/30'
                                : 'bg-surface-500/20 border-surface-500/30'
                        } backdrop-blur-sm flex flex-col items-center justify-center gap-2`}
                      >
                        <div className="text-2xl font-bold text-white">
                          {i === 0 ? '3' : i === 1 ? '5' : i === 2 ? '2' : '12'}
                        </div>
                        <div className="h-2 w-12 bg-white/20 rounded-full" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Request List */}
                  <div className="flex-1 space-y-3">
                    {[1, 2, 3].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="h-16 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 flex items-center px-4 gap-4"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-3/4 bg-white/20 rounded-full" />
                          <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                        </div>
                        <div className="w-16 h-6 bg-accent-500/30 rounded-full" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Services Integration - Better Layout */}
      <Section background="light" className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white font-display mb-6 leading-tight">
              {getString('clientPortal.services.title')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
            {lanes.map((lane, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group"
              >
                <div className="relative h-full p-6 bg-white dark:bg-surface-800 rounded-2xl border-2 border-surface-200 dark:border-surface-700 group-hover:border-accent-500/50 shadow-md group-hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-surface-800 dark:text-surface-100 font-semibold">{lane}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-lg text-primary-600 dark:text-primary-400 font-semibold"
          >
            ✨ {getString('clientPortal.services.footer')}
          </motion.p>
        </div>
      </Section>

      {/* FAQ */}
      <Section background="default">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title={getString('clientPortal.faq.title')}
            subtitle={getString('clientPortal.faq.subtitle')}
          />
          <FAQ items={faqItems} />
        </div>
      </Section>

      {/* Final CTA - More Dramatic */}
      <Section background="light" className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-accent-500/10 to-primary-600/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-6 px-6 py-2 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-full border border-accent-500/30 shadow-lg">
              <span className="text-sm font-semibold text-accent-600 dark:text-accent-400 uppercase tracking-wide">
                Ready to ship faster?
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-surface-900 dark:text-white font-display mb-8 leading-tight tracking-tight">
              {getString('clientPortal.cta.title')}
            </h2>

            <p className="text-xl md:text-2xl text-surface-600 dark:text-surface-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              {getString('clientPortal.cta.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/contact" onClick={() => trackCTAClick('Consult', 'clientPortal')}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-10 py-7 shadow-2xl hover:shadow-accent-500/50 transition-shadow duration-300"
                >
                  {getString('clientPortal.cta.buttonText')}
                </Button>
              </Link>
              <Link href="/contact" onClick={() => trackCTAClick('Demo', 'clientPortal')}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto text-lg px-10 py-7"
                >
                  {getString('clientPortal.cta.secondaryButtonText')}
                </Button>
              </Link>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-surface-500 dark:text-surface-400 text-sm"
            >
              No credit card required • Free consultation • See it in action
            </motion.p>
          </motion.div>
        </div>
      </Section>
    </>
  );
};
