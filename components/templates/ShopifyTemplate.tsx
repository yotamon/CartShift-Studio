"use client";

import React from "react";
import { PageHero } from "@/components/sections/PageHero";
import { ShopifyPageContent } from "@/components/sections/ShopifyPageContent";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/components/providers/LanguageProvider";

export const ShopifyTemplate: React.FC = () => {
  const { t, language } = useLanguage();
  const isHe = language === "he";

  const breadcrumbItems = [
    { name: isHe ? "ראשי" : "Home", url: "/" },
    { name: isHe ? "פתרונות" : "Solutions", url: "/" },
    { name: isHe ? "פתרונות שופיפיי" : "Shopify Solutions", url: "/solutions/shopify" },
  ];

  return (
    <>
      <PageHero
        title={t("shopify.hero.title") as string}
        subtitle={t("shopify.hero.subtitle") as string}
        description={t("shopify.hero.description") as string}
        badge={t("shopify.hero.badge") as string}
        seoH1="Shopify Development Services | Custom Store Setup & Optimization"
      />
      <div className="bg-slate-50 dark:bg-surface-900 border-b border-slate-200 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <ShopifyPageContent />
    </>
  );
};
