"use client";

import React from "react";
import { PageHero } from "@/components/sections/PageHero";
import { ClientPortalPageContent } from "@/components/sections/ClientPortalPageContent";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/components/providers/LanguageProvider";

export const ClientPortalTemplate: React.FC = () => {
  const { t, language } = useLanguage();
  const isHe = language === "he";

  const breadcrumbItems = [
    { name: isHe ? "ראשי" : "Home", url: "/" },
    { name: isHe ? "פתרונות" : "Solutions", url: "/" },
    { name: isHe ? "פורטל לקוחות" : "Client Portal", url: "/solutions/client-portal" },
  ];

  const getString = (path: string): string => {
    const value = t(path);
    return typeof value === "string" ? value : String(value);
  };

  return (
    <>
      <PageHero
        title={getString("clientPortal.hero.title")}
        subtitle={getString("clientPortal.hero.subtitle")}
        description={getString("clientPortal.hero.subtitle")}
        badge={getString("clientPortal.hero.badge")}
        seoH1={isHe ? "פורטל לקוחות לניהול פרויקטים | שקיפות ומהירות" : "Client Portal for Project Management | Fast & Transparent"}
      />
      <div className="bg-slate-50 dark:bg-surface-900 border-b border-slate-200 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <ClientPortalPageContent />
    </>
  );
};
