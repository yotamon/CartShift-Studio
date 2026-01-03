'use client';

import {useLocale} from 'next-intl';
import {useEffect} from 'react';
import { getLocaleDirection, isRTLLocale } from '@/lib/locale-config';

export function LocaleAttributes() {
  const locale = useLocale();
  const direction = getLocaleDirection(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    if (isRTLLocale(locale)) {
      document.body.classList.add('lang-he');
    } else {
      document.body.classList.remove('lang-he');
    }
  }, [locale, direction]);

  return null;
}


