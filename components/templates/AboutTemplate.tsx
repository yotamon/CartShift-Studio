"use client";

import React from "react";
import { PageHero } from "@/components/sections/PageHero";
import { AboutPageContent } from "@/components/sections/AboutPageContent";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/components/providers/LanguageProvider";

export const AboutTemplate: React.FC = () => {
  const { t, language } = useLanguage();
  const isHe = language === "he";

  const breadcrumbItems = [
    { name: isHe ? "ראשי" : "Home", url: "/" },
    { name: isHe ? "אודות" : "About", url: "/about" },
  ];

  return (
    <>
      <PageHero
        title={t("about.hero.title") as string}
        subtitle={t("about.hero.subtitle") as string}
        description=""
        badge={t("about.hero.badge") as string}
      />
      <div className="bg-slate-50 dark:bg-surface-900 border-b border-slate-200 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <AboutPageContent />
    </>
  );
};
