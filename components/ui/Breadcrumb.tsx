"use client";

import React from "react";
import { Link } from '@/i18n/navigation';
import { generateBreadcrumbSchema } from "@/lib/seo";
import Script from "next/script";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = "" }) => {
  const breadcrumbSchema = generateBreadcrumbSchema(items);

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-2 text-sm ${className}`}
      >
        <ol className="flex items-center gap-2" itemScope itemType="https://schema.org/BreadcrumbList">
          {items.map((item, index) => (
            <li
              key={index}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center"
            >
              {index < items.length - 1 ? (
                <>
                  <Link
                    href={item.url}
                    itemProp="item"
                    className="text-surface-600 dark:text-surface-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
                  >
                    <span itemProp="name">{item.name}</span>
                  </Link>
                  <meta itemProp="position" content={String(index + 1)} />
                  <svg
                    className="w-4 h-4 text-surface-400 dark:text-surface-500 rtl:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              ) : (
                <span
                  itemProp="name"
                  className="text-surface-900 dark:text-white font-medium"
                  aria-current="page"
                >
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};


