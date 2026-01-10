import { Metadata } from "next";

export interface SEOConfig {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export function generateMetadata(config: SEOConfig, language?: "en" | "he"): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cart-shift.com";
  const imageUrl = config.image;

  const alternates: Metadata["alternates"] = {
    canonical: config.url || siteUrl,
  };

  if (language) {
    alternates.languages = {
      en: language === "en" ? config.url || siteUrl : `${siteUrl}/en${config.url?.replace(siteUrl, "") || ""}`,
      he: language === "he" ? config.url || siteUrl : `${siteUrl}/he${config.url?.replace(siteUrl, "") || ""}`,
    };
  }

  return {
    title: config.title,
    description: config.description,
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.url || siteUrl,
      siteName: "CartShift Studio",
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ] : undefined,
      type: config.type || "website",
      ...(config.publishedTime && { publishedTime: config.publishedTime }),
      ...(config.modifiedTime && { modifiedTime: config.modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates,
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CartShift Studio",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://cart-shift.com",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://cart-shift.com"}/logo.png`,
    description: "Bold eCommerce solutions built for your unique vision. We design, develop, and optimize Shopify and WordPress websites.",
    sameAs: [],
  };
}

export function generateServiceSchema(serviceName: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: serviceName,
    provider: {
      "@type": "Organization",
      name: "CartShift Studio",
    },
    description: description,
    areaServed: "Worldwide",
  };
}

export function generateArticleSchema(post: {
  title: string;
  description: string;
  date: string;
  url: string;
  author?: string;
  category?: string;
  image?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cart-shift.com";


  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: post.author || "CartShift Studio",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "CartShift Studio",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.url,
    },
    ...(post.category && { articleSection: post.category }),
    ...(post.image && {
      image: {
        "@type": "ImageObject",
        url: post.image,
        width: 1200,
        height: 630,
      },
    }),
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "CartShift Studio",
    description: "E-commerce development agency specializing in Shopify and WordPress solutions",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://cart-shift.com",
  };
}

export function generateWebSiteSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cart-shift.com";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CartShift Studio",
    url: siteUrl,
    description: "Bold eCommerce solutions built for your unique vision",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cart-shift.com";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

export function generateFAQPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateReviewSchema(reviews: Array<{
  author: string;
  text: string;
  rating: number;
  date?: string;
}>) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CartShift Studio",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author,
      },
      reviewBody: review.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      ...(review.date && { datePublished: review.date }),
    })),
  };
}

export function generatePersonSchema(person: {
  name: string;
  jobTitle?: string;
  description?: string;
  url?: string;
  image?: string;
  sameAs?: string[];
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cart-shift.com";

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    ...(person.jobTitle && { jobTitle: person.jobTitle }),
    ...(person.description && { description: person.description }),
    ...(person.url && { url: person.url }),
    ...(person.image && {
      image: {
        "@type": "ImageObject",
        url: person.image.startsWith("http") ? person.image : `${siteUrl}${person.image}`,
      },
    }),
    ...(person.sameAs && person.sameAs.length > 0 && { sameAs: person.sameAs }),
    worksFor: {
      "@type": "Organization",
      name: "CartShift Studio",
      url: siteUrl,
    },
  };
}

