"use client";

import React from "react";
import { PageHero } from "@/components/sections/PageHero";
import { ShopifyPageContent } from "@/components/sections/ShopifyPageContent";
import { useLanguage } from "@/components/providers/LanguageProvider";

export const ShopifyTemplate: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <PageHero
        title={t("shopify.hero.title") as string}
        subtitle={t("shopify.hero.subtitle") as string}
        description={t("shopify.hero.description") as string}
        badge={t("shopify.hero.badge") as string}
      />
      <ShopifyPageContent />
    </>
  );
};
