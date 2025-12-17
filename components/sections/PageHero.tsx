"use client";

import React from "react";
import { motion } from "framer-motion";

interface PageHeroProps {
	title: string;
	subtitle: string;
	description: string;
	badge?: string;
	highlightLastWord?: boolean;
	seoH1?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, description, badge, highlightLastWord = true, seoH1 }) => {
	return (
		<section className="relative min-h-[70vh] flex items-center justify-center py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-50 dark:bg-surface-950">
			<div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-surface-950 dark:to-surface-900 opacity-50 dark:opacity-40"></div>
			<div className="absolute top-0 start-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-10"></div>

			<div className="absolute top-[-10%] start-[-10%] w-[30rem] h-[30rem] bg-primary-400/10 dark:bg-primary-600/15 rounded-full blur-[80px] animate-slow-spin"></div>
			<div
				className="absolute bottom-[-10%] end-[-10%] w-[30rem] h-[30rem] bg-accent-400/5 dark:bg-accent-600/10 rounded-full blur-[80px] animate-slow-spin"
				style={{ animationDirection: "reverse" }}></div>

			<div className="max-w-7xl mx-auto relative z-10 w-full">
				<div className="max-w-4xl mx-auto text-center">
					{badge && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md mb-8">
							<span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
							<span className="text-slate-700 dark:text-surface-200 text-sm font-medium">{badge}</span>
						</motion.div>
					)}

					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
						className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight mb-6 text-slate-900 dark:text-white">
						{seoH1 ? (
							<>
								<span className="sr-only">{seoH1}</span>
								<span aria-hidden="true">
									{highlightLastWord
										? (() => {
												const titleWords = title.split(" ");
												const lastWord = titleWords.pop();
												return (
													<>
														{titleWords.join(" ")} {lastWord && <span className="gradient-text text-glow-subtle">{lastWord}</span>}
													</>
												);
										  })()
										: title}
								</span>
							</>
						) : highlightLastWord ? (
							(() => {
								const titleWords = title.split(" ");
								const lastWord = titleWords.pop();
								return (
									<>
										{titleWords.join(" ")} {lastWord && <span className="gradient-text text-glow-subtle">{lastWord}</span>}
									</>
								);
							})()
						) : (
							title
						)}
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="text-lg md:text-xl text-slate-600 dark:text-surface-300 mb-6 font-light leading-relaxed">
						{subtitle}
					</motion.p>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="text-base md:text-lg text-slate-600 dark:text-surface-300 max-w-3xl mx-auto leading-relaxed">
						{description}
					</motion.p>
				</div>
			</div>

			<div className="absolute bottom-0 start-0 end-0 h-32 bg-gradient-to-t from-slate-50 dark:from-surface-950 to-transparent z-20"></div>
		</section>
	);
};
