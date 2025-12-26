"use client";

import React from "react";
import { PageHero } from "@/components/sections/PageHero";
import { ContactPageContent } from "@/components/sections/ContactPageContent";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useTranslations, useLocale } from "next-intl";

export const ContactTemplate: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isHe = locale === "he";

  const breadcrumbItems = [
    { name: isHe ? "ראשי" : "Home", url: "/" },
    { name: isHe ? "צור קשר" : "Contact", url: "/contact" },
  ];

  return (
    <>
      <PageHero
        title={t("contact.hero.title")}
        subtitle={t("contact.hero.subtitle")}
        description={t("contact.hero.description")}
        badge={t("contact.hero.badge")}
      />
      <div className="bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <ContactPageContent />
    </>
  );
};

