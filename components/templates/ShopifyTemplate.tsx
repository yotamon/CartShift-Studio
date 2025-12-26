"use client";

import React from "react";
import { PageHero } from "@/components/sections/PageHero";
import { ShopifyPageContent } from "@/components/sections/ShopifyPageContent";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useTranslations, useLocale } from "next-intl";

export const ShopifyTemplate: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isHe = locale === "he";

  const breadcrumbItems = [
    { name: isHe ? "ראשי" : "Home", url: "/" },
    { name: isHe ? "פתרונות" : "Solutions", url: "/" },
    { name: isHe ? "פתרונות שופיפיי" : "Shopify Solutions", url: "/solutions/shopify" },
  ];

  return (
    <>
      <PageHero
        title={t("shopify.hero.title")}
        subtitle={t("shopify.hero.subtitle")}
        description={t("shopify.hero.description")}
        badge={t("shopify.hero.badge")}
        seoH1="Shopify Development Services | Custom Store Setup & Optimization"
      />
      <div className="bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <ShopifyPageContent />
    </>
  );
};

