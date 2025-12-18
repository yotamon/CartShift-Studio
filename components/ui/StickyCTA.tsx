"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { trackBookCallClick } from "@/lib/analytics";
import { getScheduleUrl } from "@/lib/schedule";

interface StickyCTAProps {
	href?: string;
	showAfterPercent?: number;
	useSchedule?: boolean;
}

export const StickyCTA: React.FC<StickyCTAProps> = ({ href, showAfterPercent = 30, useSchedule = true }) => {
	const targetHref = href || (useSchedule ? getScheduleUrl() : "/contact");
	const isExternal = targetHref.startsWith("http");
	const [isVisible, setIsVisible] = useState(false);
	const { language } = useLanguage();
	const isHe = language === "he";

	useEffect(() => {
		let ticking = false;

		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
					setIsVisible(scrollPercent > showAfterPercent);
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [showAfterPercent]);

	const text = isHe ? "קבעו שיחה" : "Book a Call";

	const handleClick = () => {
		trackBookCallClick("sticky_cta");
	};

	const LinkWrapper = isExternal ? "a" : Link;
	const linkProps = isExternal ? { href: targetHref, target: "_blank", rel: "noopener noreferrer" } : { href: targetHref };

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: 20, scale: 0.9 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 20, scale: 0.9 }}
					transition={{ duration: 0.2 }}
					className="fixed bottom-6 end-6 z-50 hidden md:block">
					<LinkWrapper {...linkProps} onClick={handleClick}>
						<Button size="lg" className="shadow-2xl hover:shadow-accent-500/25 group">
							<Icon name="calendar" size={18} className="me-2" />
							{text}
							<Icon name="arrow-right" size={16} className="ms-2 group-hover:translate-x-1 transition-transform" />
						</Button>
					</LinkWrapper>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export const MobileBottomCTA: React.FC<StickyCTAProps> = ({ href, showAfterPercent = 30, useSchedule = true }) => {
	const targetHref = href || (useSchedule ? getScheduleUrl() : "/contact");
	const isExternal = targetHref.startsWith("http");
	const [isVisible, setIsVisible] = useState(false);
	const { language } = useLanguage();
	const isHe = language === "he";

	useEffect(() => {
		let ticking = false;

		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
					setIsVisible(scrollPercent > showAfterPercent);
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [showAfterPercent]);

	const text = isHe ? "קבעו שיחה" : "Book a Call";

	const handleClick = () => {
		trackBookCallClick("mobile_bottom_cta");
	};

	const LinkWrapper = isExternal ? "a" : Link;
	const linkProps = isExternal ? { href: targetHref, target: "_blank", rel: "noopener noreferrer" } : { href: targetHref };

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 100 }}
					transition={{ duration: 0.3 }}
					className="fixed bottom-0 inset-x-0 z-50 md:hidden safe-bottom">
					<div className="bg-white/95 dark:bg-surface-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-surface-800 px-4 py-3">
						<LinkWrapper {...linkProps} onClick={handleClick} className="block">
							<Button size="lg" className="w-full">
								<Icon name="calendar" size={18} className="me-2" />
								{text}
							</Button>
						</LinkWrapper>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
