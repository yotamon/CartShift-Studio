"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ParallaxLayer } from "@/components/ui/Parallax";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { getScheduleUrl } from "@/lib/schedule";
import { trackBookCallClick } from "@/lib/analytics";
import { ArrowRight, ArrowDown, Sparkles } from "lucide-react";
import Image from "next/image";

const platformIcons = [
	{
		name: "Shopify",
		iconPath: "/icons/shopify.svg",
		color: "#96BF48"
	},
	{
		name: "WordPress",
		iconPath: "/icons/wordpress.svg",
		color: "#21759B"
	},
	{
		name: "Wix",
		iconPath: "/icons/wix.svg",
		color: "#0C6EFC"
	},
	{
		name: "Webflow",
		iconPath: "/icons/webflow.svg",
		color: "#4353FF"
	},
	{
		name: "BigCommerce",
		iconPath: "/icons/bigcommerce.svg",
		color: "#121118"
	},
	{
		name: "Squarespace",
		iconPath: "/icons/squarespace.svg",
		color: "#000000"
	}
];

export const Hero: React.FC = () => {
	const { t, direction } = useLanguage();
	const isRtl = direction === "rtl";

	return (
		<section className="relative min-h-[100dvh] flex items-center justify-center py-16 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#f0f4f8] dark:bg-surface-950">
			{/* Background Ambience */}
			<div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-[#e8f0f8] to-slate-200 dark:from-surface-950 dark:to-surface-900"></div>
			<div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.06] dark:opacity-5"></div>

			{/* Animated Orbs with Parallax - Dramatic 3D depth */}
			<ParallaxLayer depth={2} baseSpeed={0.5}>
				<div className="absolute top-[-15%] left-[-10%] w-[45rem] h-[45rem] bg-primary-500/15 dark:bg-primary-600/15 rounded-full blur-[120px] animate-slow-spin"></div>
			</ParallaxLayer>
			<ParallaxLayer depth={3} baseSpeed={0.4}>
				<div
					className="absolute bottom-[-15%] right-[-10%] w-[45rem] h-[45rem] bg-accent-500/10 dark:bg-accent-600/10 rounded-full blur-[120px] animate-slow-spin"
					style={{ animationDirection: "reverse" }}></div>
			</ParallaxLayer>

			{/* Floating geometric shapes - Impressive spread across entire section */}

			{/* TOP ROW - Left to Right */}
			<motion.div
				className="absolute top-[8%] left-[5%] w-2 h-2 bg-primary-500/20 rounded-full"
				animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
				transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute top-[12%] left-[15%] w-20 h-20 border-2 border-primary-500/20 rounded-xl"
				animate={{ rotate: [0, 90, 180, 270, 360], y: [0, -15, 0, 15, 0] }}
				transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
			/>
			<motion.div
				className="absolute top-[5%] left-[28%] w-3 h-3 bg-accent-400/15 rounded-full"
				animate={{ y: [0, -15, 0], x: [0, 8, 0], opacity: [0.15, 0.4, 0.15] }}
				transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute top-[15%] left-[42%] w-14 h-14 border border-primary-400/15 rounded-2xl"
				animate={{ rotate: [0, -180, -360], scale: [1, 1.1, 1] }}
				transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
			/>
			<motion.div
				className="absolute top-[8%] right-[35%] w-1.5 h-1.5 bg-primary-600/25 rounded-full"
				animate={{ scale: [1, 1.8, 1], opacity: [0.25, 0.6, 0.25] }}
				transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
			/>
			<motion.div
				className="absolute top-[18%] right-[22%] w-10 h-10 border-2 border-accent-500/25 rounded-full"
				animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
				transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute top-[6%] right-[12%] w-16 h-16 border border-primary-500/10 rounded-xl"
				animate={{ rotate: [0, 45, 0, -45, 0], y: [0, -10, 0] }}
				transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute top-[14%] right-[4%] w-2.5 h-2.5 bg-accent-500/20 rounded-full"
				animate={{ scale: [1, 1.4, 1], y: [0, -12, 0], opacity: [0.2, 0.5, 0.2] }}
				transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
			/>

			{/* UPPER-MID ROW */}
			<motion.div
				className="absolute top-[28%] left-[3%] w-24 h-24 border border-accent-400/10 rounded-3xl"
				animate={{ rotate: [0, -30, 0, 30, 0] }}
				transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute top-[32%] left-[18%] w-5 h-5 bg-primary-500/20 rounded-lg"
				animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
				transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
			/>
			<motion.div
				className="absolute top-[25%] left-[35%] w-8 h-8 border-2 border-accent-400/20 rounded-full"
				animate={{ y: [0, -25, 0], rotate: [0, 360] }}
				transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute top-[30%] right-[30%] w-1.5 h-1.5 bg-accent-600/30 rounded-full"
				animate={{ scale: [1, 2, 1], opacity: [0.3, 0.7, 0.3] }}
				transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute top-[22%] right-[15%] w-12 h-12 bg-primary-500/5 rounded-xl"
				animate={{ y: [0, 20, 0], rotate: [0, 45, 0] }}
				transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute top-[35%] right-[6%] w-18 h-18 border border-accent-500/15 rounded-2xl"
				animate={{ rotate: [0, 90, 0], scale: [1, 1.05, 1] }}
				transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
			/>

			{/* MIDDLE ROW */}
			<motion.div
				className="absolute top-[45%] left-[6%] w-6 h-6 border-2 border-primary-500/25 rounded-lg"
				animate={{ rotate: [0, -90, -180, -270, -360] }}
				transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
			/>
			<motion.div
				className="absolute top-[50%] left-[22%] w-2 h-2 bg-accent-500/15 rounded-full"
				animate={{ scale: [1, 1.6, 1], y: [0, -8, 0], opacity: [0.15, 0.45, 0.15] }}
				transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
			/>
			<motion.div
				className="absolute top-[42%] left-[38%] w-16 h-16 border border-primary-400/10 rounded-full"
				animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
				transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute top-[48%] right-[38%] w-2.5 h-2.5 bg-primary-400/12 rounded-full"
				animate={{ y: [0, -20, 0], x: [0, 10, 0], opacity: [0.12, 0.35, 0.12] }}
				transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute top-[52%] right-[25%] w-10 h-10 border-2 border-accent-400/20 rounded-xl"
				animate={{ rotate: [0, 60, 0, -60, 0], y: [0, -15, 0] }}
				transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute top-[44%] right-[8%] w-1.5 h-1.5 bg-accent-500/25 rounded-full"
				animate={{ scale: [1, 1.7, 1], opacity: [0.25, 0.55, 0.25] }}
				transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
			/>

			{/* LOWER-MID ROW */}
			<motion.div
				className="absolute top-[62%] left-[4%] w-3 h-3 bg-primary-600/18 rounded-full"
				animate={{ y: [0, -15, 0], scale: [1, 1.2, 1], opacity: [0.18, 0.4, 0.18] }}
				transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute top-[58%] left-[15%] w-14 h-14 border border-accent-500/15 rounded-2xl"
				animate={{ rotate: [0, -45, 0], y: [0, 15, 0] }}
				transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute top-[65%] left-[30%] w-6 h-6 border-2 border-primary-400/20 rounded-full"
				animate={{ scale: [1, 1.4, 1], rotate: [0, 180, 360] }}
				transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute top-[60%] right-[32%] w-20 h-20 border border-accent-400/10 rounded-3xl"
				animate={{ rotate: [0, 30, 0, -30, 0], scale: [1, 1.08, 1] }}
				transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute top-[68%] right-[18%] w-2 h-2 bg-primary-500/22 rounded-full"
				animate={{ scale: [1, 1.6, 1], opacity: [0.22, 0.5, 0.22] }}
				transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
			/>
			<motion.div
				className="absolute top-[55%] right-[5%] w-8 h-8 bg-accent-500/8 rounded-lg"
				animate={{ y: [0, 25, 0], rotate: [0, -45, 0] }}
				transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
			/>

			{/* BOTTOM ROW */}
			<motion.div
				className="absolute bottom-[22%] left-[8%] w-12 h-12 border-2 border-accent-500/20 rounded-xl"
				animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.1, 1] }}
				transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
			/>
			<motion.div
				className="absolute bottom-[28%] left-[25%] w-1.5 h-1.5 bg-primary-500/28 rounded-full"
				animate={{ scale: [1, 1.8, 1], opacity: [0.28, 0.6, 0.28] }}
				transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
			/>
			<motion.div
				className="absolute bottom-[18%] left-[40%] w-18 h-18 border border-primary-400/10 rounded-2xl"
				animate={{ rotate: [0, -60, 0], y: [0, -20, 0] }}
				transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute bottom-[25%] right-[35%] w-5 h-5 border-2 border-accent-400/25 rounded-full"
				animate={{ y: [0, -15, 0], scale: [1, 1.3, 1] }}
				transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute bottom-[30%] right-[20%] w-2.5 h-2.5 bg-accent-600/15 rounded-full"
				animate={{ rotate: [0, 180, 360], y: [0, -8, 0], opacity: [0.15, 0.38, 0.15] }}
				transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
			/>
			<motion.div
				className="absolute bottom-[20%] right-[8%] w-16 h-16 border border-primary-500/15 rounded-3xl"
				animate={{ rotate: [0, 45, 0, -45, 0], scale: [1, 1.12, 1] }}
				transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute bottom-[35%] right-[3%] w-2 h-2 bg-primary-400/20 rounded-full"
				animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.48, 0.2] }}
				transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
			/>

			{/* EXTRA ACCENT DOTS - scattered subtle pulsing dots with varied opacity/size */}
			<motion.div
				className="absolute top-[38%] left-[48%] w-1.5 h-1.5 bg-accent-500/18 rounded-full"
				animate={{ scale: [1, 1.6, 1], opacity: [0.18, 0.42, 0.18] }}
				transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
			/>
			<motion.div
				className="absolute top-[72%] left-[12%] w-2.5 h-2.5 bg-primary-600/12 rounded-full"
				animate={{ scale: [1, 1.4, 1], opacity: [0.12, 0.32, 0.12] }}
				transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
			/>
			<motion.div
				className="absolute top-[20%] right-[42%] w-1.5 h-1.5 bg-accent-400/22 rounded-full"
				animate={{ scale: [1, 1.7, 1], opacity: [0.22, 0.5, 0.22] }}
				transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
			/>
			<motion.div
				className="absolute bottom-[40%] left-[52%] w-2 h-2 bg-primary-500/15 rounded-full"
				animate={{ scale: [1, 1.5, 1], opacity: [0.15, 0.38, 0.15] }}
				transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
			/>

			<div className="max-w-7xl mx-auto relative z-10 w-full">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<motion.div initial={{ opacity: 0, x: isRtl ? 50 : -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="space-y-8 md:space-y-10">
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 backdrop-blur-md shadow-premium">
							<Sparkles className="w-4 h-4 text-accent-500" />
							<span className="text-slate-700 dark:text-surface-200 text-sm font-semibold">{t("hero.tag") as string}</span>
						</motion.div>

						<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white">
							{t("hero.titleLine1") as string} <br />
							<span className="gradient-text text-glow-subtle">{t("hero.titleLine2") as string}</span>
						</h1>

						<motion.p
							className="text-lg md:text-xl text-slate-600 dark:text-surface-300 leading-relaxed max-w-xl"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}>
							{t("hero.description") as string}
						</motion.p>

						<motion.div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
							<a href={getScheduleUrl()} target="_blank" rel="noopener noreferrer" onClick={() => trackBookCallClick("hero_cta")} className="w-full sm:w-auto">
								<Button size="lg" className="group text-base md:text-lg px-8 md:px-10 py-4 md:py-5 shadow-premium hover:shadow-premium-hover w-full sm:w-auto">
									<span className="relative z-10 flex items-center gap-3 justify-center">
										{t("hero.primaryCta") as string}
										<motion.div animate={{ x: isRtl ? [0, -5, 0] : [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
											<ArrowRight className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} strokeWidth={2.5} />
										</motion.div>
									</span>
								</Button>
							</a>
							<a href="/about" className="w-full sm:w-auto">
								<Button variant="outline" size="lg" className="text-base md:text-lg px-8 md:px-10 py-4 md:py-5 shadow-premium hover:shadow-premium-hover w-full sm:w-auto">
									{t("hero.secondaryCta") as string}
								</Button>
							</a>
						</motion.div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.8, duration: 1 }}
							className="pt-8 md:pt-10 border-t border-slate-300/60 dark:border-white/5 flex flex-wrap gap-8 md:gap-12">
							<div className="flex flex-col">
								<span className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-1">{t("hero.stats.clients.value") as string}</span>
								<span className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-surface-400 font-medium">{t("hero.stats.clients.label") as string}</span>
							</div>
							<div className="flex flex-col">
								<span className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-1">{t("hero.stats.dedication.value") as string}</span>
								<span className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-surface-400 font-medium">{t("hero.stats.dedication.label") as string}</span>
							</div>
						</motion.div>

						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} className="pt-6 md:pt-8">
							<span className="text-xs uppercase tracking-wider text-slate-400 dark:text-surface-500 font-medium mb-4 block">{t("hero.platforms.label") as string}</span>
							<div className="flex flex-wrap items-center gap-3 md:gap-4">
								{platformIcons.map((platform, index) => (
									<motion.div
										key={platform.name}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{
											delay: 1.1 + index * 0.08,
											duration: 0.4,
											ease: "easeOut"
										}}
										whileHover={{
											scale: 1.1,
											transition: { duration: 0.2 }
										}}
										className="group relative"
										title={platform.name}>
										<div className="w-10 h-10 md:w-11 md:h-11 p-2 md:p-2.5 rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-sm shadow-sm transition-all duration-300 group-hover:border-slate-300 dark:group-hover:border-white/20 group-hover:shadow-md">
											<div className="relative w-full h-full grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 dark:invert dark:opacity-70 dark:group-hover:invert-0 dark:group-hover:opacity-100">
												<Image src={platform.iconPath} alt={`${platform.name} logo`} fill className="object-contain" />
											</div>
										</div>
									</motion.div>
								))}
							</div>
						</motion.div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 50 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 50 }}
						className="relative hidden lg:block">
						<div className="absolute inset-0 bg-gradient-brand opacity-15 blur-3xl rounded-full"></div>
						<div className="relative">
							<Image src="/images/website-builders-illustration.svg" alt="Website builders illustration" width={876} height={661} className="w-full h-auto" priority />
						</div>
					</motion.div>
				</div>
			</div>

			{/* Scroll Indicator */}
			<motion.div className="absolute bottom-10 inset-x-0 flex justify-center z-20" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8 }}>
				<motion.div
					className="flex flex-col items-center gap-2 text-slate-500 dark:text-surface-400 hover:text-slate-700 dark:hover:text-surface-200 transition-colors cursor-pointer"
					animate={{ y: [0, 10, 0] }}
					transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
					<span className="text-sm font-medium text-center">{t("hero.scrollIndicator") as string}</span>
					<ArrowDown className="w-6 h-6" strokeWidth={2} />
				</motion.div>
			</motion.div>

			{/* Decorative Elements */}
			<div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#f0f4f8] dark:from-surface-950 via-[#f0f4f8]/60 dark:via-surface-950/50 to-transparent z-20"></div>
		</section>
	);
};
