"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { trackNewsletterSignup } from "@/lib/analytics";

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isHe = language === "he";

  const footerLinks = {
    solutions: [
      { name: t("footer.links.shopify") as string, href: "/solutions/shopify" },
      { name: t("footer.links.wordpress") as string, href: "/solutions/wordpress" },
      { name: isHe ? "מחירים" : "Pricing", href: "/pricing" },
      { name: isHe ? "תחזוקה" : "Maintenance", href: "/maintenance" },
    ],
    company: [
      { name: t("footer.links.about") as string, href: "/about" },
      { name: isHe ? "עבודות" : "Our Work", href: "/work" },
      { name: t("footer.links.blog") as string, href: "/blog" },
      { name: t("footer.links.contact") as string, href: "/contact" },
    ],
  };

  const socialLinks = [
    { name: "LinkedIn", href: "https://linkedin.com/company/cartshiftstudio", icon: "linkedin" },
    { name: "Twitter", href: "https://twitter.com/cartshiftstudio", icon: "twitter" },
    { name: "GitHub", href: "https://github.com/cartshiftstudio", icon: "github" },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setSubscribed(true);
      setEmail("");
      trackNewsletterSignup("footer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative border-t border-slate-300/60 dark:border-white/10 bg-white dark:bg-surface-950">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-200/80 dark:from-black/50 via-white/60 dark:via-surface-950/50 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1 text-start">
            <Logo size="lg" className="mb-6" />
            <p className="text-slate-600 dark:text-surface-400 max-w-md mb-6 text-sm md:text-base leading-relaxed">
              {t("footer.description") as string}
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-200/70 dark:bg-surface-800 flex items-center justify-center text-slate-600 dark:text-surface-400 hover:bg-accent-100 dark:hover:bg-accent-500/10 hover:text-accent-600 dark:hover:text-accent-400 transition-all border border-slate-300/40 dark:border-transparent"
                  aria-label={social.name}
                >
                  <Icon name={social.icon} size={20} />
                </Link>
              ))}
            </div>
          </div>

          <div className="text-start">
            <h3 className="text-slate-900 dark:text-white font-bold mb-6 text-base md:text-lg leading-tight">{t("footer.solutions") as string}</h3>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-600 dark:text-surface-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors font-medium text-sm md:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-start">
            <h3 className="text-slate-900 dark:text-white font-bold mb-6 text-base md:text-lg leading-tight">{t("footer.company") as string}</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-600 dark:text-surface-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors font-medium text-sm md:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-start">
            <h3 className="text-slate-900 dark:text-white font-bold mb-6 text-base md:text-lg leading-tight">
              {isHe ? "הישארו מעודכנים" : "Stay Updated"}
            </h3>
            {subscribed ? (
              <div className="flex items-center gap-2 text-success">
                <Icon name="check" size={20} />
                <span className="text-sm font-medium">
                  {isHe ? "תודה שנרשמת!" : "Thanks for subscribing!"}
                </span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <p className="text-slate-600 dark:text-surface-400 text-sm leading-relaxed mb-4">
                  {isHe
                    ? "קבלו טיפים וחדשות על מסחר אלקטרוני ישירות למייל."
                    : "Get e-commerce tips and news delivered to your inbox."}
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    placeholder={isHe ? "האימייל שלך" : "Your email"}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/80 dark:bg-surface-800 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-surface-400 border border-slate-300/60 dark:border-surface-700 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-sm shadow-sm"
                    style={{ direction: 'ltr' }}
                    required
                    disabled={loading}
                  />
                  <Button type="submit" size="sm" variant="primary" className="!px-2 !py-2" loading={loading} disabled={loading}>
                    <Icon name="mail" size={20} />
                  </Button>
                </div>
                {error && (
                  <p className="text-error text-sm">
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-300/60 dark:border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="text-xs md:text-sm text-slate-500 dark:text-surface-500 leading-relaxed text-center md:text-start">
                © {new Date().getFullYear()} CartShift Studio. {t("footer.rights") as string}
              </p>
              <div className="flex items-center gap-3 text-xs md:text-sm">
                <Link href="/privacy" className="text-slate-500 dark:text-surface-500 hover:text-accent-600 dark:hover:text-accent-400 transition-colors">
                  {isHe ? "מדיניות פרטיות" : "Privacy Policy"}
                </Link>
                <span className="text-slate-300 dark:text-surface-700">|</span>
                <Link href="/terms" className="text-slate-500 dark:text-surface-500 hover:text-accent-600 dark:hover:text-accent-400 transition-colors">
                  {isHe ? "תנאי שימוש" : "Terms of Service"}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs md:text-sm text-slate-500 dark:text-surface-500">
              <span className="flex items-center gap-2">
                <Icon name="shield" size={16} className="text-success" />
                {isHe ? "SSL מאובטח" : "SSL Secured"}
              </span>
              <span className="flex items-center gap-2">
                <Icon name="award" size={16} className="text-accent-500" />
                {isHe ? "שותף Shopify" : "Shopify Partner"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
