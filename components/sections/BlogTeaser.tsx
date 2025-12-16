"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

import { useLanguage } from "@/components/providers/LanguageProvider";

export const BlogTeaser: React.FC = () => {
    const { t, language } = useLanguage();
    const latestPosts = t("blogTeaser.posts") as any[];

	return (
		<Section background="default">
			<SectionHeader title={t("blogTeaser.title") as string} subtitle={t("blogTeaser.subtitle") as string} />
			<div className="grid md:grid-cols-2 gap-8">
				{latestPosts.map((post, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 40, scale: 0.95 }}
						whileInView={{ opacity: 1, y: 0, scale: 1 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.7, delay: index * 0.2, type: "spring" }}>
						<Card hover glow className="h-full group relative overflow-hidden">
							<CardHeader>
								<CardTitle className="mb-4 leading-tight">{post.title}</CardTitle>
								<p className="text-xs md:text-sm text-slate-500 dark:text-surface-500 uppercase tracking-wider">{new Date(post.date).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}</p>
							</CardHeader>
							<CardContent>
								<p className="mb-8 text-base md:text-lg leading-relaxed">{post.excerpt}</p>
								<Link href={post.href}>
									<button className="text-accent-600 dark:text-accent-400 font-bold hover:text-accent-700 dark:hover:text-accent-300 transition-colors text-base md:text-lg flex items-center gap-3 group/link">
										{t("blogTeaser.readMore") as string}
										<svg className="w-6 h-6 transition-transform rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
										</svg>
									</button>
								</Link>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>
			<div className="text-center mt-12">
				<Link href="/blog">
					<button className="text-accent-600 dark:text-accent-400 font-bold hover:text-accent-700 dark:hover:text-accent-300 transition-colors text-base md:text-lg flex items-center gap-2 mx-auto group">
						{t("blogTeaser.viewAll") as string}
						<svg className="w-5 h-5 transition-transform rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</button>
				</Link>
			</div>
		</Section>
	);
};
