'use client';

import React from 'react';
import { motion } from "@/lib/motion";
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PageHero } from '@/components/sections/PageHero';
import { Link } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import type { CaseStudy } from '@/lib/case-studies';
import { isRTLLocale } from '@/lib/locale-config';
import ReactMarkdown from 'react-markdown';

interface CaseStudyDetailContentProps {
  caseStudy: CaseStudy;
}

export const CaseStudyDetailContent: React.FC<CaseStudyDetailContentProps> = ({ caseStudy }) => {
  const t = useTranslations();
  const locale = useLocale();
  const isHe = isRTLLocale(locale);

  // Get translations with type safety workaround
  const workT = t.raw('work' as never) as {
    hero: { title: string };
    detail: {
      projectDetails: string;
      client: string;
      industry: string;
      platform: string;
      duration: string;
      services: string;
      startProject: string;
      wantResults: string;
      wantResultsDesc: string;
      getConsultation: string;
      viewMore: string;
    };
  };

  const breadcrumbItems = [
    { name: t('nav.home'), url: '/' },
    { name: workT.hero.title, url: '/work' },
    { name: caseStudy.title, url: `/work/${caseStudy.slug}` },
  ];

  const platformColor = caseStudy.platform.toLowerCase().includes('shopify')
    ? 'green'
    : 'blue';

  return (
    <>
      <PageHero
        title={caseStudy.title}
        subtitle={caseStudy.client}
        description={caseStudy.summary}
        badge={caseStudy.platform}
      />

      <div className="bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Results Summary */}
      <Section background="default" className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {caseStudy.results.map((result, index) => (
              <motion.div
                key={result.metric}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-lg"
              >
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${
                  platformColor === 'green'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`}>
                  {result.improvement}
                </div>
                <div className="text-sm font-medium text-surface-600 dark:text-surface-400 mb-2">
                  {result.metric}
                </div>
                <div className="text-xs text-surface-400 dark:text-surface-500">
                  {result.before} → {result.after}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Project Details */}
      <Section background="light" className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: isHe ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Project Info Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 sticky top-24">
                <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4 font-display">
                  {workT.detail.projectDetails}
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-medium text-surface-500 uppercase tracking-wide mb-1">
                      {workT.detail.client}
                    </div>
                    <div className="font-medium text-surface-900 dark:text-white">
                      {caseStudy.client}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-surface-500 uppercase tracking-wide mb-1">
                      {workT.detail.industry}
                    </div>
                    <div className="font-medium text-surface-900 dark:text-white">
                      {caseStudy.industry}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-surface-500 uppercase tracking-wide mb-1">
                      {workT.detail.platform}
                    </div>
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                      platformColor === 'green'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      <Icon
                        name={platformColor === 'green' ? 'shopping-cart' : 'globe'}
                        size={16}
                      />
                      {caseStudy.platform}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-surface-500 uppercase tracking-wide mb-1">
                      {workT.detail.duration}
                    </div>
                    <div className="font-medium text-surface-900 dark:text-white">
                      {caseStudy.duration}
                    </div>
                  </div>
                </div>

                {/* Services */}
                {caseStudy.services && caseStudy.services.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
                    <div className="text-xs font-medium text-surface-500 uppercase tracking-wide mb-3">
                      {workT.detail.services}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.services.map((service) => (
                        <span
                          key={service}
                          className="px-2.5 py-1 text-xs font-medium bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300 rounded-lg"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
                  <Link href="/contact">
                    <Button className="w-full">
                      {workT.detail.startProject}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: isHe ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2"
            >
              {/* Testimonial */}
              {caseStudy.testimonial && (
                <div className={`mb-8 p-6 rounded-2xl border-s-4 ${
                  platformColor === 'green'
                    ? 'bg-green-50 border-green-500 dark:bg-green-950/20'
                    : 'bg-blue-50 border-blue-500 dark:bg-blue-950/20'
                }`}>
                  <blockquote className="text-lg italic text-surface-700 dark:text-surface-300 mb-4">
                    &ldquo;{caseStudy.testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      platformColor === 'green' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {caseStudy.testimonial.author[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-surface-900 dark:text-white">
                        {caseStudy.testimonial.author}
                      </div>
                      <div className="text-sm text-surface-500">
                        {caseStudy.testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Markdown Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-surface-600 dark:prose-p:text-surface-400 prose-li:text-surface-600 dark:prose-li:text-surface-400 prose-strong:text-surface-900 dark:prose-strong:text-white prose-code:px-1.5 prose-code:py-0.5 prose-code:bg-surface-100 dark:prose-code:bg-surface-800 prose-code:rounded prose-pre:bg-surface-900 dark:prose-pre:bg-surface-950">
                <ReactMarkdown>
                  {caseStudy.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section background="default" className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white font-display mb-6 leading-tight tracking-tight">
              {workT.detail.wantResults}
            </h2>
            <p className="text-base md:text-lg text-surface-600 dark:text-surface-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              {workT.detail.wantResultsDesc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="group">
                  <span className="relative z-10 flex items-center gap-2">
                    {workT.detail.getConsultation}
                    <svg
                      className="w-5 h-5 transition-transform rtl:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </Button>
              </Link>
              <Link href="/work">
                <Button variant="outline" size="lg">
                  {workT.detail.viewMore}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
};
