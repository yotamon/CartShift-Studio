"use client";

import React from "react";
import { PageHero } from "@/components/sections/PageHero";
import { WordPressPageContent } from "@/components/sections/WordPressPageContent";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useTranslations, useLocale } from "next-intl";

export const WordPressTemplate: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isHe = locale === "he";

  const breadcrumbItems = [
    { name: isHe ? "ראשי" : "Home", url: "/" },
    { name: isHe ? "פתרונות" : "Solutions", url: "/" },
    { name: isHe ? "פתרונות וורדפרס" : "WordPress Solutions", url: "/solutions/wordpress" },
  ];

  return (
    <>
      <PageHero
        title={t("wordpress.hero.title")}
        subtitle={t("wordpress.hero.subtitle")}
        description={t("wordpress.hero.description")}
        badge={t("wordpress.hero.badge")}
        seoH1="WordPress E-commerce Development Services | Custom Websites & Content Sites"
      />
      <div className="bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <WordPressPageContent />
    </>
  );
};

