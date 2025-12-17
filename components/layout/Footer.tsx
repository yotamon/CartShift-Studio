"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

import { useLanguage } from "@/components/providers/LanguageProvider";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const footerLinks = {
    solutions: [
      { name: t("footer.links.shopify") as string, href: "/solutions/shopify" },
      { name: t("footer.links.wordpress") as string, href: "/solutions/wordpress" },
    ],
    company: [
      { name: t("footer.links.about") as string, href: "/about" },
      { name: t("footer.links.blog") as string, href: "/blog" },
      { name: t("footer.links.contact") as string, href: "/contact" },
    ],
  };

  return (
    <footer className="relative border-t border-slate-200 dark:border-white/10 bg-white dark:bg-surface-950">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-black/50 via-white dark:via-surface-950/50 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 text-start">
            <Logo size="lg" className="mb-6" />
            <p className="text-slate-600 dark:text-surface-400 max-w-md mb-6 text-base md:text-lg leading-relaxed">
              {t("footer.description") as string}
            </p>
            <p className="text-xs md:text-sm text-slate-500 dark:text-surface-500 leading-relaxed">
              © {new Date().getFullYear()} CartShift Studio. {t("footer.rights") as string}
            </p>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-6 text-base md:text-lg leading-tight text-start">{t("footer.solutions") as string}</h3>
            <ul className="space-y-3 text-start">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-600 dark:text-surface-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-6 text-base md:text-lg leading-tight text-start">{t("footer.company") as string}</h3>
            <ul className="space-y-3 text-start">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-600 dark:text-surface-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

