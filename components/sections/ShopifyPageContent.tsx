"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

import { useLanguage } from "@/components/providers/LanguageProvider";

export const ShopifyPageContent: React.FC = () => {
	const { t } = useLanguage();

	const getString = (path: string): string => {
		const value = t(path);
		return typeof value === "string" ? value : String(value);
	};

	const services = t("shopify.services.items") as unknown as Array<{ title: string; description: string }>;
	const whyItems = t("shopify.why.items") as unknown as string[];

	return (
		<>
			<Section background="default" className="relative overflow-hidden">
				<SectionHeader title={getString("shopify.services.title")} subtitle={getString("shopify.services.subtitle")} />
				<div className="grid md:grid-cols-2 gap-8">
					{services.map((service, index) => (
						<motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: index * 0.1 }}>
							<Card hover glow className="h-full group relative overflow-hidden">
								<CardHeader>
									<CardTitle>{service.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-base md:text-lg leading-relaxed">{service.description}</p>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</Section>

			<Section background="light" className="relative overflow-hidden">
				<div className="max-w-4xl mx-auto">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white font-display mb-8 text-center leading-tight tracking-tight">
						{getString("shopify.why.title")} <span className="gradient-text">{getString("shopify.why.titleSpan")}</span>
					</motion.h2>
					<div className="space-y-6">
						{whyItems.map((text, index) => (
							<motion.p
								key={index}
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								className="text-base md:text-lg text-slate-600 dark:text-surface-300 leading-relaxed">
								{text}
							</motion.p>
						))}
					</div>
				</div>
			</Section>

			<Section background="default" className="relative overflow-hidden">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white font-display mb-8 leading-tight tracking-tight">
							{getString("shopify.cta.title")} <span className="gradient-text">{getString("shopify.cta.titleSpan")}</span>
						</h2>
						<p className="text-base md:text-lg text-slate-600 dark:text-surface-300 mb-8 max-w-2xl mx-auto leading-relaxed">{getString("shopify.cta.description")}</p>
						<Link href="/contact">
							<Button size="lg" className="group">
								<span className="relative z-10 flex items-center gap-2">
									{getString("shopify.cta.button")}
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
