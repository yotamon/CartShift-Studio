'use client';

import React, { useEffect } from 'react';
import { motion } from "@/lib/motion";
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Link } from '@/i18n/navigation';
import { trackPortfolioView, useScrollTracking } from '@/lib/analytics';
import { useLocale } from 'next-intl';

interface CaseStudy {
  slug: string;
  name: string;
  industry: string;
  platform: 'shopify' | 'wordpress';
  brief: string;
  challenge: string;
  solution: string;
  results: Array<{ metric: string; before: string; after: string; change: string }>;
  testimonial?: {
    quote: string;
    name: string;
    title: string;
  };
}

interface CaseStudyContentProps {
  caseStudy: CaseStudy;
}

export const CaseStudyContent: React.FC<CaseStudyContentProps> = ({ caseStudy }) => {
  const locale = useLocale();
  const isHe = locale === 'he';

  // Track case study view and scroll depth
  useEffect(() => {
    trackPortfolioView(caseStudy.name);
    const cleanup = useScrollTracking([25, 50, 75, 100]);
    return cleanup;
  }, [caseStudy.name]);

  const labels = {
    backToWork: isHe ? 'חזרה לעבודות' : 'Back to Work',
    challenge: isHe ? 'האתגר' : 'The Challenge',
    solution: isHe ? 'הפתרון' : 'The Solution',
    results: isHe ? 'התוצאות' : 'The Results',
    metric: isHe ? 'מדד' : 'Metric',
    before: isHe ? 'לפני' : 'Before',
    after: isHe ? 'אחרי' : 'After',
    change: isHe ? 'שינוי' : 'Change',
    clientSays: isHe ? 'מה הלקוח אומר' : 'What the Client Says',
    readyToStart: isHe ? 'מוכנים להתחיל?' : 'Ready to Start?',
    ctaText: isHe ? 'בואו נדבר על הפרויקט שלכם' : "Let's talk about your project",
    ctaButton: isHe ? 'קבעו שיחה' : 'Book a Call',
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-50/50 dark:from-accent-950/20 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400 hover:text-accent-600 dark:hover:text-accent-400 mb-8 transition-colors"
          >
            <Icon name="arrow-right" size={16} className="rotate-180" />
            {labels.backToWork}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${
                  caseStudy.platform === 'shopify'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                }`}
              >
                {caseStudy.platform}
              </span>
              <span className="text-sm text-surface-500 dark:text-surface-500">
                {caseStudy.industry}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-surface-900 dark:text-white mb-6 leading-tight">
              {caseStudy.name}
            </h1>
            <p className="text-xl text-surface-600 dark:text-surface-400">{caseStudy.brief}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-6">
                {labels.challenge}
              </h2>
              <p className="text-lg text-surface-600 dark:text-surface-400 leading-relaxed">
                {caseStudy.challenge}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-6">
                {labels.solution}
              </h2>
              <p className="text-lg text-surface-600 dark:text-surface-400 leading-relaxed">
                {caseStudy.solution}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-8">
                {labels.results}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-200 dark:border-surface-700">
                      <th className="text-start py-4 px-4 text-sm font-semibold text-surface-900 dark:text-white">
                        {labels.metric}
                      </th>
                      <th className="text-start py-4 px-4 text-sm font-semibold text-surface-900 dark:text-white">
                        {labels.before}
                      </th>
                      <th className="text-start py-4 px-4 text-sm font-semibold text-surface-900 dark:text-white">
                        {labels.after}
                      </th>
                      <th className="text-start py-4 px-4 text-sm font-semibold text-surface-900 dark:text-white">
                        {labels.change}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {caseStudy.results.map((result, i) => (
                      <tr key={i} className="border-b border-surface-100 dark:border-surface-800">
                        <td className="py-4 px-4 text-surface-600 dark:text-surface-400">
                          {result.metric}
                        </td>
                        <td className="py-4 px-4 text-surface-500 dark:text-surface-500">
                          {result.before}
                        </td>
                        <td className="py-4 px-4 font-semibold text-surface-900 dark:text-white">
                          {result.after}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`font-bold ${
                              result.change.startsWith('+') ||
                              (result.change.startsWith('-') && result.change.includes('57'))
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-green-600 dark:text-green-400'
                            }`}
                          >
                            {result.change}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {caseStudy.testimonial && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-surface-50 dark:bg-surface-800/50 rounded-2xl p-8 md:p-12"
              >
                <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-6">
                  {labels.clientSays}
                </h2>
                <blockquote className="text-xl md:text-2xl text-surface-700 dark:text-surface-300 italic mb-6 leading-relaxed">
                  "{caseStudy.testimonial.quote}"
                </blockquote>
                <div>
                  <p className="font-semibold text-surface-900 dark:text-white">
                    {caseStudy.testimonial.name}
                  </p>
                  <p className="text-sm text-surface-500 dark:text-surface-500">
                    {caseStudy.testimonial.title}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-b from-transparent to-surface-100 dark:to-surface-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4">
              {labels.readyToStart}
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-400 mb-8">{labels.ctaText}</p>
            <Link href="/contact">
              <Button size="lg">
                {labels.ctaButton}
                <Icon name="arrow-right" size={18} className="ms-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

