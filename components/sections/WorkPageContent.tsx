'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PageHero } from '@/components/sections/PageHero';
import { Link } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';

interface Project {
  name: string;
  industry: string;
  platform: 'shopify' | 'wordpress';
  brief: string;
  image?: string;
  slug?: string;
}

const placeholderProjects: Project[] = [
  {
    name: 'Artisan Creations',
    industry: 'Handmade Goods',
    platform: 'shopify',
    brief: 'Custom Shopify store with advanced product filtering and subscription features.',
    slug: 'artisan-creations',
  },
  {
    name: 'TechGear Pro',
    industry: 'Electronics',
    platform: 'shopify',
    brief: 'Migration from WooCommerce with 40% speed improvement and new checkout flow.',
    slug: 'techgear-pro',
  },
  {
    name: 'Boutique Fashion Co',
    industry: 'Fashion',
    platform: 'shopify',
    brief: 'Premium store redesign with lookbook features and size recommendation.',
    slug: 'boutique-fashion',
  },
  {
    name: 'Content Hub Media',
    industry: 'Media & Publishing',
    platform: 'wordpress',
    brief: 'High-traffic news platform with custom CMS and ad integration.',
    slug: 'content-hub-media',
  },
  {
    name: 'Local Services Pro',
    industry: 'Services',
    platform: 'wordpress',
    brief: 'Service business website with booking system and lead generation.',
    slug: 'local-services-pro',
  },
  {
    name: 'Wellness Brand',
    industry: 'Health & Wellness',
    platform: 'shopify',
    brief: 'Subscription-based wellness products with personalized recommendations.',
    slug: 'wellness-brand',
  },
];

export const WorkPageContent: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isHe = locale === 'he';
  const [activeFilter, setActiveFilter] = useState<'all' | 'shopify' | 'wordpress'>('all');

  const work = t.raw('work' as any) as {
    hero: { title: string; subtitle: string; description: string; badge: string };
    filters: { all: string; shopify: string; wordpress: string };
    cta: { title: string; titleSpan: string; description: string; button: string };
    viewProject: string;
    comingSoon: string;
  };

  const filteredProjects =
    activeFilter === 'all'
      ? placeholderProjects
      : placeholderProjects.filter(p => p.platform === activeFilter);

  const filters: Array<{ key: 'all' | 'shopify' | 'wordpress'; label: string }> = [
    { key: 'all', label: work.filters.all },
    { key: 'shopify', label: work.filters.shopify },
    { key: 'wordpress', label: work.filters.wordpress },
  ];

  const breadcrumbItems = [
    { name: isHe ? 'ראשי' : 'Home', url: '/' },
    { name: work.hero.title, url: '/work' },
  ];

  return (
    <>
      <PageHero
        title={work.hero.title}
        subtitle={work.hero.subtitle}
        description={work.hero.description}
        badge={work.hero.badge}
      />
      <div className="bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="sticky top-16 md:top-20 z-30 bg-white/95 dark:bg-surface-800/95 backdrop-blur-lg border-b border-surface-200 dark:border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-2">
            {filters.map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === filter.key
                    ? 'bg-accent-600 text-white'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Section background="light" className="relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={project.slug ? `/work/${project.slug}` : '#'}>
                <Card hover className="h-full group relative overflow-hidden p-0">
                  <div
                    className={`relative aspect-[4/3] overflow-hidden ${
                      project.platform === 'shopify'
                        ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/20 dark:to-teal-950/30'
                        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-purple-950/30'
                    }`}
                  >
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-5"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`relative w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 ${
                          project.platform === 'shopify'
                            ? 'bg-green-100/50 dark:bg-green-900/30 border border-green-200/50 dark:border-green-800/30'
                            : 'bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-800/30'
                        }`}
                      >
                        <Icon
                          name={project.platform === 'shopify' ? 'shopping-cart' : 'globe'}
                          size={40}
                          className={`transition-transform duration-300 group-hover:scale-110 ${
                            project.platform === 'shopify'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide backdrop-blur-sm ${
                          project.platform === 'shopify'
                            ? 'bg-green-500/90 text-white dark:bg-green-600/80'
                            : 'bg-blue-500/90 text-white dark:bg-blue-600/80'
                        }`}
                      >
                        {project.platform}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="inline-block text-xs font-medium text-surface-500 dark:text-surface-400 mb-2">
                        {project.industry}
                      </span>
                      <CardTitle className="text-xl font-bold mb-3 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors line-clamp-2">
                        {project.name}
                      </CardTitle>
                    </div>
                    <p className="text-sm text-surface-600 dark:text-surface-400 mb-4 line-clamp-3 leading-relaxed">
                      {project.brief}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-accent-600 dark:text-accent-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                      <span>{work.viewProject}</span>
                      <Icon
                        name="arrow-right"
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-surface-500 dark:text-surface-500 italic">{work.comingSoon}</p>
        </motion.div>
      </Section>

      <Section background="default" className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white font-display mb-8 leading-tight tracking-tight">
              {work.cta.title} <span className="gradient-text">{work.cta.titleSpan}</span>
            </h2>
            <p className="text-base md:text-lg text-surface-600 dark:text-surface-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              {work.cta.description}
            </p>
            <Link href="/contact">
              <Button size="lg" className="group">
                <span className="relative z-10 flex items-center gap-2">
                  {work.cta.button}
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
          </motion.div>
        </div>
      </Section>
    </>
  );
};

