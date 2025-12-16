"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card, CardContent } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";

import { useLanguage } from "@/components/providers/LanguageProvider";

export const Testimonials: React.FC = () => {
  const { t } = useLanguage();
  const testimonials = t("testimonials.items") as any[];

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <Section background="light">
      <SectionHeader
        title={t("testimonials.title") as string}
        subtitle={t("testimonials.subtitle") as string}
      />
      <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.15, type: "spring" }}
          >
            <Card hover glow className="h-full group relative overflow-hidden">
              <CardContent>
                {/* Star Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Icon key={i} name="star" className="w-5 h-5 text-accent-500 dark:text-accent-400" size={20} />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-700 dark:text-surface-100 mb-8 text-base md:text-lg leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center border border-slate-200 dark:border-white/10 flex-shrink-0">
                    <span className="text-slate-900 dark:text-white font-bold text-lg">
                      {testimonial.author.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-base md:text-lg">{testimonial.author}</p>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-surface-400 font-medium">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

