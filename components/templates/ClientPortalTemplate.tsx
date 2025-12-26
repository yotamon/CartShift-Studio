"use client";

import React from "react";
import { PageHero } from "@/components/sections/PageHero";
import { ClientPortalPageContent } from "@/components/sections/ClientPortalPageContent";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useTranslations, useLocale } from "next-intl";

export const ClientPortalTemplate: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isHe = locale === "he";

  const breadcrumbItems = [
    { name: isHe ? "ראשי" : "Home", url: "/" },
    { name: isHe ? "פתרונות" : "Solutions", url: "/" },
    { name: isHe ? "פורטל לקוחות" : "Client Portal", url: "/solutions/client-portal" },
  ];

  return (
    <>
      <PageHero
        title={t("clientPortal.hero.title" as any)}
        subtitle={t("clientPortal.hero.subtitle" as any)}
        description={t("clientPortal.hero.subtitle" as any)}
        badge={t("clientPortal.hero.badge" as any)}
        seoH1={isHe ? "פורטל לקוחות לניהול פרויקטים | שקיפות ומהירות" : "Client Portal for Project Management | Fast & Transparent"}
      />
      <div className="bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <ClientPortalPageContent />
    </>
  );
};

