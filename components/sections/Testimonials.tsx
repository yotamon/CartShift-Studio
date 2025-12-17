"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";

import { useLanguage } from "@/components/providers/LanguageProvider";

export const Testimonials: React.FC = () => {
  const { t } = useLanguage();
  const testimonials = t("testimonials.items") as any[];

  if (!testimonials || testimonials.length === 0) return null;

  const featuredTestimonial = testimonials[0];
  const otherTestimonials = testimonials.slice(1);

  return (
    <Section background="light" className="relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 start-10 w-32 h-32 border border-accent-500/10 rounded-full"></div>
      <div className="absolute bottom-20 end-10 w-48 h-48 border border-primary-500/10 rounded-full"></div>

      <SectionHeader
        title={t("testimonials.title") as string}
        subtitle={t("testimonials.subtitle") as string}
      />

      {/* Featured Spotlight Testimonial */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-10"
      >
        <div className="relative rounded-[2rem] p-10 md:p-14 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 dark:from-surface-800 dark:via-surface-900 dark:to-surface-800 shadow-2xl overflow-hidden">
          {/* Large decorative quote */}
          <div className="absolute top-6 start-8 md:start-12 text-[120px] md:text-[180px] font-serif text-white/10 dark:text-white/5 leading-none select-none pointer-events-none">
            "
          </div>
          <div className="absolute bottom-0 end-8 md:end-12 text-[120px] md:text-[180px] font-serif text-white/10 dark:text-white/5 leading-none select-none pointer-events-none rotate-180">
            "
          </div>

          {/* Glow effect */}
          <div className="absolute top-1/2 start-1/2 rtl:translate-x-1/2 ltr:-translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent-500/20 dark:bg-accent-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="relative z-10">
            {/* Star Rating - Animated */}
            <div className="flex gap-1.5 mb-8">
              {[...Array(featuredTestimonial.rating)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 200 }}
                >
                  <Icon name="star" className="w-6 h-6 md:w-7 md:h-7 text-amber-400" size={28} />
                </motion.div>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-white leading-relaxed mb-10 max-w-4xl">
              "{featuredTestimonial.quote}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/30 dark:border-white/20 flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg">
                {featuredTestimonial.author.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <p className="font-bold text-white text-lg md:text-xl">{featuredTestimonial.author}</p>
                <p className="text-sm md:text-base text-white/80 dark:text-slate-400">{featuredTestimonial.company}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Other Testimonials - Smaller Cards */}
      {otherTestimonials.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {otherTestimonials.map((testimonial, index) => (
            <motion.div
              key={index + 1}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
            >
              <div className="h-full glass-effect rounded-2xl p-7 md:p-8 group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 shadow-premium hover:shadow-premium-hover relative overflow-hidden">
                {/* Subtle quote icon */}
                <div className="absolute top-4 end-4 text-4xl font-serif text-accent-500/10 select-none">"</div>

                {/* Star Rating */}
                <div className="flex gap-1 mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Icon key={i} name="star" className="w-4 h-4 text-amber-400" size={16} />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-700 dark:text-surface-100 mb-6 text-base md:text-lg leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-5 border-t border-slate-200 dark:border-white/10">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-surface-800 flex items-center justify-center border border-slate-200 dark:border-surface-700 flex-shrink-0">
                    <span className="text-slate-700 dark:text-white font-semibold text-sm">
                      {testimonial.author.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm md:text-base">{testimonial.author}</p>
                    <p className="text-xs text-slate-500 dark:text-surface-400">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Section>
  );
};

