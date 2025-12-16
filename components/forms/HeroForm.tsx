"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { trackFormSubmission } from "@/components/analytics/GoogleAnalytics";
import { logError } from "@/lib/error-handler";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface FormData {
  name: string;
  email: string;
  interest: string;
}

export const HeroForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { t } = useLanguage();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit form");
      }

      trackFormSubmission("hero-form");
      setSubmitted(true);
    } catch (error) {
      logError("Form submission error", error);
      setError(error instanceof Error ? error.message : t("heroForm.error") as string);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-4xl mb-4">✓</div>
          <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight tracking-tight">{t("heroForm.successTitle") as string}</h3>
          <p className="text-slate-600 dark:text-surface-300 text-base md:text-lg leading-relaxed">{t("heroForm.successText") as string}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card glow className="border-2 border-accent-500/30">
      <CardHeader>
          <CardTitle className="text-xl md:text-2xl mb-2">{t("heroForm.title") as string}</CardTitle>
          <p className="text-slate-600 dark:text-surface-400 text-xs md:text-sm leading-relaxed">{t("heroForm.subtitle") as string}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-surface-300 mb-2">
              {t("heroForm.fields.name") as string}
            </label>
            <input
              id="name"
              type="text"
              {...register("name", { required: t("heroForm.fields.nameRequired") as string })}
              className="w-full px-4 py-3 glass-effect rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-surface-500 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
              placeholder={t("heroForm.fields.namePlaceholder") as string}
              aria-required="true"
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-surface-300 mb-2">
              {t("heroForm.fields.email") as string}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email", {
                required: t("heroForm.fields.emailRequired") as string,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t("heroForm.fields.emailInvalid") as string
                }
              })}
              className="w-full px-4 py-3 glass-effect rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-surface-500 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
              placeholder={t("heroForm.fields.emailPlaceholder") as string}
              aria-required="true"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-error" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="interest" className="block text-sm font-semibold text-slate-700 dark:text-surface-300 mb-2">
              {t("heroForm.fields.interest") as string}
            </label>
            <select
              id="interest"
              {...register("interest", { required: t("heroForm.fields.interestRequired") as string })}
              className="w-full px-4 py-3 glass-effect rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all bg-white/50 dark:bg-surface-900/50"
              aria-required="true"
              aria-invalid={errors.interest ? "true" : "false"}
              aria-describedby={errors.interest ? "interest-error" : undefined}
            >
              <option value="" className="bg-white dark:bg-surface-900 text-slate-900 dark:text-white">{t("heroForm.fields.selectOption") as string}</option>
              <option value="shopify" className="bg-white dark:bg-surface-900 text-slate-900 dark:text-white">{t("heroForm.fields.options.shopify") as string}</option>
              <option value="wordpress" className="bg-white dark:bg-surface-900 text-slate-900 dark:text-white">{t("heroForm.fields.options.wordpress") as string}</option>
              <option value="consultation" className="bg-white dark:bg-surface-900 text-slate-900 dark:text-white">{t("heroForm.fields.options.consultation") as string}</option>
            </select>
            {errors.interest && (
              <p id="interest-error" className="mt-2 text-sm text-error font-semibold" role="alert">
                {errors.interest.message}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-error/10 border border-error/20">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="md"
            variant="primary"
            disabled={loading}
          >
            {loading ? t("heroForm.submitting") as string : t("heroForm.submit") as string}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

