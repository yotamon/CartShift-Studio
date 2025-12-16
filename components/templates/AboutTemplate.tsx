"use client";

import React from "react";
import { PageHero } from "@/components/sections/PageHero";
import { AboutPageContent } from "@/components/sections/AboutPageContent";
import { useLanguage } from "@/components/providers/LanguageProvider";

export const AboutTemplate: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <PageHero
        title={t("about.hero.title") as string}
        subtitle={t("about.hero.subtitle") as string}
        description=""
        badge={t("about.hero.badge") as string}
      />
      <AboutPageContent />
    </>
  );
};
