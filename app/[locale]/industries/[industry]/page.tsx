import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { IndustryPageContent } from '@/components/sections/IndustryPageContent';

interface IndustryPageProps {
  params: Promise<{ locale: string; industry: string }>;
}

// Define all supported industries
const INDUSTRIES = ['fashion', 'food', 'health', 'tech', 'arts', 'local'] as const;
type IndustrySlug = (typeof INDUSTRIES)[number];

// Industry metadata mapping
const INDUSTRY_META: Record<IndustrySlug, { en: { title: string; description: string }; he: { title: string; description: string } }> = {
  fashion: {
    en: {
      title: 'Fashion & Apparel E-commerce | CartShift Studio',
      description: 'Build a stunning fashion e-commerce store that converts. Shopify & WordPress solutions for fashion brands.',
    },
    he: {
      title: 'חנויות אופנה | CartShift Studio',
      description: 'בנו חנות אופנה אונליין מרהיבה שממירה. פתרונות שופיפיי ווורדפרס למותגי אופנה.',
    },
  },
  food: {
    en: {
      title: 'Food & Beverage Websites | CartShift Studio',
      description: 'Online ordering, digital menus, and reservation systems for restaurants and food businesses.',
    },
    he: {
      title: 'אתרים למזון ומשקאות | CartShift Studio',
      description: 'הזמנות אונליין, תפריטים דיגיטליים ומערכות הזמנות למסעדות ועסקי מזון.',
    },
  },
  health: {
    en: {
      title: 'Health & Wellness E-commerce | CartShift Studio',
      description: 'E-commerce solutions for supplements, fitness, and wellness brands.',
    },
    he: {
      title: 'חנויות בריאות ואיכות חיים | CartShift Studio',
      description: 'פתרונות מסחר אלקטרוני לתוספי תזונה, כושר ומותגי בריאות.',
    },
  },
  tech: {
    en: {
      title: 'Tech & SaaS Websites | CartShift Studio',
      description: 'High-converting landing pages and websites for tech startups and SaaS products.',
    },
    he: {
      title: 'אתרים לטכנולוגיה ו-SaaS | CartShift Studio',
      description: 'דפי נחיתה ואתרים ממירים לסטארטאפים ומוצרי SaaS.',
    },
  },
  arts: {
    en: {
      title: 'Arts & Crafts E-commerce | CartShift Studio',
      description: 'Beautiful online stores for artists, creators, and craftspeople.',
    },
    he: {
      title: 'חנויות לאמנות ויצירה | CartShift Studio',
      description: 'חנויות אונליין יפהפיות לאמנים, יוצרים ובעלי מלאכה.',
    },
  },
  local: {
    en: {
      title: 'Local Business Websites | CartShift Studio',
      description: 'Professional websites for small and medium businesses ready to grow online.',
    },
    he: {
      title: 'אתרים לעסקים מקומיים | CartShift Studio',
      description: 'אתרים מקצועיים לעסקים קטנים ובינוניים שמוכנים לצמוח אונליין.',
    },
  },
};

export async function generateStaticParams() {
  const locales = ['en', 'he'];
  const params: { locale: string; industry: string }[] = [];

  for (const locale of locales) {
    for (const industry of INDUSTRIES) {
      params.push({ locale, industry });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: IndustryPageProps): Promise<Metadata> {
  const { locale, industry } = await params;
  const meta = INDUSTRY_META[industry as IndustrySlug]?.[locale as 'en' | 'he'] || INDUSTRY_META.fashion.en;

  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { locale, industry } = await params;
  setRequestLocale(locale as 'en' | 'he');

  return <IndustryPageContent industry={industry as IndustrySlug} />;
}
