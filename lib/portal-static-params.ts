export const PORTAL_STATIC_ORG_ID = 'template';
export const PORTAL_STATIC_REQUEST_ID = 'request';
export const PORTAL_STATIC_PRICING_ID = 'pricing';
export const PORTAL_DYNAMIC_PARAMS = process.env.NODE_ENV === 'development';
export const SUPPORTED_LOCALES = ['en', 'he'];

export function getLocaleStaticParams() {
  return SUPPORTED_LOCALES.map(locale => ({ locale }));
}

export function getPortalStaticOrgParams() {
  return SUPPORTED_LOCALES.flatMap(locale =>
    [{ locale, orgId: PORTAL_STATIC_ORG_ID }]
  );
}

export function getPortalStaticRequestParams() {
  return SUPPORTED_LOCALES.flatMap(locale =>
    [{ locale, orgId: PORTAL_STATIC_ORG_ID, requestId: PORTAL_STATIC_REQUEST_ID }]
  );
}

export function getPortalStaticPricingParams() {
  return SUPPORTED_LOCALES.flatMap(locale =>
    [{ locale, orgId: PORTAL_STATIC_ORG_ID, pricingId: PORTAL_STATIC_PRICING_ID }]
  );
}

