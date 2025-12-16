"use client";

import React from "react";
import { PageHero } from "@/components/sections/PageHero";
import { WordPressPageContent } from "@/components/sections/WordPressPageContent";
import { useLanguage } from "@/components/providers/LanguageProvider";

export const WordPressTemplate: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <PageHero
        title={t("wordpress.hero.title") as string}
        subtitle={t("wordpress.hero.subtitle") as string}
        description={t("wordpress.hero.description") as string}
        badge={t("wordpress.hero.badge") as string}
      />
      <WordPressPageContent />
    </>
  );
};
