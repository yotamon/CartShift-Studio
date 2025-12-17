"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { trackFormSubmission } from "@/components/analytics/GoogleAnalytics";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { logError } from "@/lib/error-handler";

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  message: string;
}

export const ContactPageContent: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>();
  const { t, direction } = useLanguage();

  const onSubmit = async (data: ContactFormData) => {
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

      trackFormSubmission("contact-form");
      setSubmitted(true);
    } catch (error) {
      logError("Form submission error", error);
      setError(error instanceof Error ? error.message : "Something went wrong. Please try again or contact us directly.");
    } finally {
      setLoading(false);
    }
  };

  const isRtl = direction === 'rtl';

  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative bg-slate-50 dark:bg-surface-900">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 30 : -30 }} // Logical start
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white font-display mb-8 text-center md:text-start leading-tight tracking-tight">
              {t("contact.title") as string}
            </h2>
            <div className="space-y-6 text-start">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-base md:text-lg">{t("contact.emailLabel") as string}</h3>
                <a
                  href="mailto:hello@cartshiftstudio.com"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-base md:text-lg"
                >
                  hello@cartshiftstudio.com
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-base md:text-lg">{t("contact.quickResponseTitle") as string}</h3>
                <p className="text-slate-600 dark:text-surface-300 text-base md:text-lg leading-relaxed">
                  {t("contact.quickResponseText") as string}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-base md:text-lg">{t("contact.scheduleTitle") as string}</h3>
                <p className="text-slate-600 dark:text-surface-300 mb-2 text-base md:text-lg leading-relaxed">
                  {t("contact.scheduleText1") as string}
                </p>
                <p className="text-slate-600 dark:text-surface-300 text-base md:text-lg leading-relaxed">
                  {t("contact.scheduleText2") as string}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isRtl ? -30 : 30 }} // Logical end
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {submitted ? (
              <Card glow>
                <CardContent className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">✓</div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">{t("contact.form.successTitle") as string}</h3>
                  <p className="text-slate-600 dark:text-surface-300 mb-6 text-base md:text-lg leading-relaxed">
                    {t("contact.form.successText") as string}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                  >
                    {t("contact.form.sendAnother") as string}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card glow>
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl text-start">{t("contact.form.title") as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-start">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-surface-200 mb-2">
                        {t("contact.form.nameLabel") as string} <span className="text-error">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className="w-full px-4 py-3 rounded-xl glass-effect text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-surface-500 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                        placeholder={t("contact.form.namePlaceholder") as string}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-error">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-surface-200 mb-2">
                        {t("contact.form.emailLabel") as string} <span className="text-error">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                        className="w-full px-4 py-3 rounded-xl glass-effect text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-surface-500 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-start"
                        style={{ direction: 'ltr' }} // Email should always be LTR
                        placeholder={t("contact.form.emailPlaceholder") as string}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-error">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-slate-700 dark:text-surface-200 mb-2">
                        {t("contact.form.companyLabel") as string}
                      </label>
                      <input
                        id="company"
                        type="text"
                        {...register("company")}
                        className="w-full px-4 py-3 rounded-xl glass-effect text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-surface-500 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                        placeholder={t("contact.form.companyPlaceholder") as string}
                      />
                    </div>

                    <div>
                      <label htmlFor="projectType" className="block text-sm font-medium text-slate-700 dark:text-surface-200 mb-2">
                        {t("contact.form.projectTypeLabel") as string} <span className="text-error">*</span>
                      </label>
                      <select
                        id="projectType"
                        {...register("projectType", { required: "Please select a project type" })}
                        className="w-full px-4 py-3 rounded-xl glass-effect text-slate-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all bg-white dark:bg-surface-900 [&>option]:text-slate-900 dark:[&>option]:text-white"
                      >
                        <option value="">{t("contact.form.selectOption") as string}</option>
                        <option value="shopify">{t("contact.form.options.shopify") as string}</option>
                        <option value="wordpress">{t("contact.form.options.wordpress") as string}</option>
                        <option value="consultation">{t("contact.form.options.consultation") as string}</option>
                        <option value="other">{t("contact.form.options.other") as string}</option>
                      </select>
                      {errors.projectType && (
                        <p className="mt-1 text-sm text-error">{errors.projectType.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-surface-200 mb-2">
                        {t("contact.form.messageLabel") as string} <span className="text-error">*</span>
                      </label>
                      <textarea
                        id="message"
                        rows={6}
                        {...register("message", { required: "Message is required" })}
                        className="w-full px-4 py-3 rounded-xl glass-effect text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-surface-500 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all resize-none"
                        placeholder={t("contact.form.messagePlaceholder") as string}
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-error">{errors.message.message}</p>
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
                      disabled={loading}
                    >
                      {loading ? (t("contact.form.submitting") as string) || "Submitting..." : (t("contact.form.submitButton") as string)}
                    </Button>

                    <p className="text-xs text-surface-400 text-center">
                      {t("contact.form.privacy") as string}
                    </p>
                  </form>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

