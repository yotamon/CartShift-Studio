import {useLocale} from 'next-intl';

export function useDirection(): 'ltr' | 'rtl' {
  const locale = useLocale();
  return locale === 'he' ? 'rtl' : 'ltr';
}

