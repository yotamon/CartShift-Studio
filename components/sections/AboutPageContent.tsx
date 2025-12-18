"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ParallaxText } from "@/components/ui/Parallax";

import { useLanguage } from "@/components/providers/LanguageProvider";

export const AboutPageContent: React.FC = () => {
  const { t, direction } = useLanguage();
  const storyContent = t("about.story.content") as string[];
  const teamMembers = t("about.team.members") as any[];
  const valuesItems = t("about.values.items") as any[];
  const expectContent = t("about.expect.content") as string[];

  return (
    <>
      <Section background="default" className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <ParallaxText type="fade-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white font-display mb-8 text-center leading-tight tracking-tight">
              {t("about.story.title") as string}
            </h2>
          </ParallaxText>
          <div className="space-y-6">
            {storyContent.map((text, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-base md:text-lg text-slate-600 dark:text-surface-300 leading-relaxed"
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>
      </Section>

      {/* Founders Image & Team Section */}
      <Section background="light" className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t("about.team.title") as string}
            </h2>
            <p className="text-lg text-slate-600 dark:text-surface-400">
              {t("about.team.subtitle") as string}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200 dark:ring-white/10 mb-12"
          >
            <div className="aspect-[4/3] md:aspect-[16/9] relative">
              <Image
                src="/images/the-team.png"
                alt="CartShift Studio Founders"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8" dir="ltr">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                dir={direction}
              >
                <Card hover glow="glow" className="h-full group relative overflow-hidden">
                  <CardHeader>
                    <CardTitle>{member.name}</CardTitle>
                    <p className="text-primary-500 dark:text-primary-400 font-medium mt-2 text-base md:text-lg">{member.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base md:text-lg leading-relaxed">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section background="default" className="relative overflow-hidden">
        <SectionHeader
          title={t("about.values.title") as string}
          subtitle={t("about.values.subtitle") as string}
        />
        <div className="grid md:grid-cols-2 gap-8">
          {valuesItems.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card hover glow="glow" className="h-full group relative overflow-hidden">
                <CardHeader>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base md:text-lg leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section background="light" className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <ParallaxText type="fade-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white font-display mb-8 text-center leading-tight tracking-tight">
              {t("about.expect.title") as string} <span className="gradient-text">{t("about.expect.titleSpan") as string}</span>
            </h2>
          </ParallaxText>
          <div className="space-y-6">
            {expectContent.map((text, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-base md:text-lg text-slate-600 dark:text-surface-300 leading-relaxed"
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>
      </Section>

      <Section background="default" className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white font-display mb-8 leading-tight tracking-tight">
              {t("about.cta.title") as string} <span className="gradient-text">{t("about.cta.titleSpan") as string}</span>
            </h2>
            <p className="text-base md:text-lg text-slate-600 dark:text-surface-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              {t("about.cta.description") as string}
            </p>
            <Link href="/contact">
              <Button size="lg" className="group">
                <span className="relative z-10 flex items-center gap-2">
                  {t("about.cta.button") as string}
                  <svg className="w-5 h-5 transition-transform rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </Section>
    </>
  );
};

