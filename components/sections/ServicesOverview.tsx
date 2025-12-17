"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/components/providers/LanguageProvider";



export const ServicesOverview: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    {
      title: t("servicesOverview.shopify.title") as string,
      description: t("servicesOverview.shopify.description") as string,
      features: t("servicesOverview.shopify.features") as string[],
      href: "/solutions/shopify",
      icon: "shopping-cart",
      gradient: "from-primary-500/20 to-accent-500/20",
    },
    {
      title: t("servicesOverview.wordpress.title") as string,
      description: t("servicesOverview.wordpress.description") as string,
      features: t("servicesOverview.wordpress.features") as string[],
      href: "/solutions/wordpress",
      icon: "globe",
      gradient: "from-accent-500/20 to-primary-500/20",
    },
  ];

  return (
    <Section background="default" className="relative overflow-hidden">
      <SectionHeader
        title={t("servicesOverview.title") as string}
        subtitle={t("servicesOverview.subtitle") as string}
      />
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <Card hover glow accent className="h-full group relative overflow-hidden">
              <CardHeader>
                <div className="w-20 h-20 mb-6 rounded-2xl bg-slate-100 dark:bg-surface-800 flex items-center justify-center border border-slate-200 dark:border-surface-700 group-hover:border-accent-500/50 transition-colors duration-300">
                  <Icon name={service.icon} className="w-10 h-10 text-accent-500 dark:text-accent-400" size={40} />
                </div>
                <CardTitle className="text-2xl md:text-3xl mb-4">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-8 text-base md:text-lg leading-relaxed text-slate-700 dark:text-surface-200">{service.description}</p>
                <ul className="space-y-4 mb-10">
                  {service.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + idx * 0.1 }}
                    >
                      <svg className="w-6 h-6 text-accent-500 dark:text-accent-400 me-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-700 dark:text-surface-200 text-base md:text-lg font-medium">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <Link href={service.href}>
                  <button className="group/link inline-flex items-center gap-3 px-6 py-3 border-2 border-accent-600 dark:border-accent-500 bg-transparent hover:bg-accent-600 dark:hover:bg-accent-500 text-accent-600 dark:text-accent-400 hover:text-white dark:hover:text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
                    {t("common.learnMore") as string}
                    <svg className="w-5 h-5 transition-transform group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

