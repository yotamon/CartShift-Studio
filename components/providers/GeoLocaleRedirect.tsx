'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

const GEO_LOCALE_KEY = 'geo_locale_detected';
const GEO_LOCALE_TIMESTAMP_KEY = 'geo_locale_timestamp';
const USER_LOCALE_PREFERENCE_KEY = 'user_locale_preference';

// Re-detect location after 7 days (in milliseconds)
const GEO_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

/**
 * GeoLocaleRedirect component
 *
 * Detects the user's country and redirects to the appropriate locale:
 * - Users from Israel (IL) are redirected to Hebrew (/he/...)
 * - All other users default to English (/en/...)
 *
 * The detected country is stored in localStorage for consistency across sessions.
 * Detection is re-run after 7 days or if the cache is cleared.
 * If the user manually changes the language, their preference is respected.
 */
export function GeoLocaleRedirect() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Skip if user has manually set a preference
    const userPreference = localStorage.getItem(USER_LOCALE_PREFERENCE_KEY);
    if (userPreference) {
      return;
    }

    // Check if we have a cached detection that's still valid
    const cachedCountry = localStorage.getItem(GEO_LOCALE_KEY);
    const cachedTimestamp = localStorage.getItem(GEO_LOCALE_TIMESTAMP_KEY);

    if (cachedCountry && cachedTimestamp) {
      const timestamp = parseInt(cachedTimestamp, 10);
      const now = Date.now();

      // If cache is still valid, use cached value
      if (now - timestamp < GEO_CACHE_DURATION) {
        // Determine target locale based on cached country
        const targetLocale = cachedCountry === 'IL' ? 'he' : 'en';

        // Only redirect if we need to change locale (first visit to this locale path)
        // Check sessionStorage to avoid redirecting on every page navigation
        const sessionChecked = sessionStorage.getItem(GEO_LOCALE_KEY);
        if (!sessionChecked && targetLocale !== locale) {
          sessionStorage.setItem(GEO_LOCALE_KEY, cachedCountry);
          const pathWithoutLocale = pathname.replace(/^\/(en|he)/, '');
          const newPath = `/${targetLocale}${pathWithoutLocale || '/'}`;
          router.replace(newPath);
        } else if (!sessionChecked) {
          sessionStorage.setItem(GEO_LOCALE_KEY, cachedCountry);
        }
        return;
      }
    }

    // Skip if we've already done geo detection in this session
    const sessionDetected = sessionStorage.getItem(GEO_LOCALE_KEY);
    if (sessionDetected) {
      return;
    }

    // Mark that we're performing detection
    sessionStorage.setItem(GEO_LOCALE_KEY, 'pending');

    async function detectAndRedirect() {
      try {
        // Use ipapi.co for free geo-IP detection (1000 requests/day free)
        // You can also use other services like ip-api.com, ipinfo.io, etc.
        const response = await fetch('https://ipapi.co/country/', {
          method: 'GET',
          headers: {
            'Accept': 'text/plain',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to detect country');
        }

        const countryCode = (await response.text()).trim().toUpperCase();

        // Store detection result in both localStorage (persistent) and sessionStorage (session)
        localStorage.setItem(GEO_LOCALE_KEY, countryCode);
        localStorage.setItem(GEO_LOCALE_TIMESTAMP_KEY, Date.now().toString());
        sessionStorage.setItem(GEO_LOCALE_KEY, countryCode);

        // Determine target locale based on country
        const targetLocale = countryCode === 'IL' ? 'he' : 'en';

        // Only redirect if we need to change locale
        if (targetLocale !== locale) {
          // Build the new path with the target locale
          // Current pathname includes the locale prefix, e.g., /en/about
          // We need to replace the locale prefix
          const pathWithoutLocale = pathname.replace(/^\/(en|he)/, '');
          const newPath = `/${targetLocale}${pathWithoutLocale || '/'}`;

          router.replace(newPath);
        }
      } catch (error) {
        // If detection fails, mark as completed to avoid retrying this session
        sessionStorage.setItem(GEO_LOCALE_KEY, 'error');
        console.warn('Geo locale detection failed:', error);
      }
    }

    detectAndRedirect();
  }, [locale, pathname, router]);

  return null;
}

/**
 * Call this function when the user manually changes the language
 * to store their preference and prevent geo-based redirects
 */
export function setUserLocalePreference(locale: 'en' | 'he') {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_LOCALE_PREFERENCE_KEY, locale);
  }
}

/**
 * Clear the user's locale preference and geo cache (useful for testing)
 */
export function clearUserLocalePreference() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_LOCALE_PREFERENCE_KEY);
    localStorage.removeItem(GEO_LOCALE_KEY);
    localStorage.removeItem(GEO_LOCALE_TIMESTAMP_KEY);
    sessionStorage.removeItem(GEO_LOCALE_KEY);
  }
}

/**
 * Get the detected country code (for debugging/display purposes)
 */
export function getDetectedCountry(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(GEO_LOCALE_KEY);
  }
  return null;
}
