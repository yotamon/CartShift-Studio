export const PORTAL_STATIC_ORG_ID = 'template';
export const PORTAL_STATIC_REQUEST_ID = 'request';
export const PORTAL_STATIC_PRICING_ID = 'pricing';
export const PORTAL_DYNAMIC_PARAMS = process.env.NODE_ENV === 'development';
export const SUPPORTED_LOCALES = ['en', 'he'] as const;

export function getLocaleStaticParams() {
  return SUPPORTED_LOCALES.map(locale => ({ locale }));
}

/**
 * For pages at /[locale]/portal/org/[orgId]/...
 * Only need to return orgId - locale is handled by parent layout
 */
export function getPortalStaticOrgParams() {
  return [{ orgId: PORTAL_STATIC_ORG_ID }];
}

/**
 * For pages at /[locale]/portal/org/[orgId]/requests/[requestId]
 * Only need to return orgId and requestId - locale is handled by parent layout
 */
export function getPortalStaticRequestParams() {
  return [{ orgId: PORTAL_STATIC_ORG_ID, requestId: PORTAL_STATIC_REQUEST_ID }];
}

/**
 * For pages at /[locale]/portal/org/[orgId]/pricing/[pricingId]
 * Only need to return orgId and pricingId - locale is handled by parent layout
 */
export function getPortalStaticPricingParams() {
  return [{ orgId: PORTAL_STATIC_ORG_ID, pricingId: PORTAL_STATIC_PRICING_ID }];
}
