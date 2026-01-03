"use client";

import React from "react";
import { PageHero } from "@/components/sections/PageHero";
import { AboutPageContent } from "@/components/sections/AboutPageContent";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useTranslations, useLocale } from "next-intl";
import { isRTLLocale } from '@/lib/locale-config';

export const AboutTemplate: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isHe = isRTLLocale(locale);

  const breadcrumbItems = [
    { name: t("navigation.home"), url: "/" },
    { name: t("navigation.about"), url: "/about" },
  ];

  return (
    <>
      <PageHero
        title={t("about.hero.title")}
        subtitle={t("about.hero.subtitle")}
        description=""
        badge={t("about.hero.badge")}
      />
      <div className="bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <AboutPageContent />
    </>
  );
};

