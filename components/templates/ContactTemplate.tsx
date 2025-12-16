"use client";

import React from "react";
import { PageHero } from "@/components/sections/PageHero";
import { ContactPageContent } from "@/components/sections/ContactPageContent";
import { useLanguage } from "@/components/providers/LanguageProvider";

export const ContactTemplate: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <PageHero
        title={t("contact.hero.title") as string}
        subtitle={t("contact.hero.subtitle") as string}
        description={t("contact.hero.description") as string}
        badge={t("contact.hero.badge") as string}
      />
      <ContactPageContent />
    </>
  );
};
