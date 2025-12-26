'use client';

import {useLocale} from 'next-intl';
import {useEffect} from 'react';

export function LocaleAttributes() {
  const locale = useLocale();
  const direction = locale === 'he' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    if (locale === 'he') {
      document.body.classList.add('lang-he');
    } else {
      document.body.classList.remove('lang-he');
    }
  }, [locale, direction]);

  return null;
}


