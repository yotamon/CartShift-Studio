export const PORTAL_STATIC_ORG_ID = 'template';
export const PORTAL_STATIC_REQUEST_ID = 'request';
export const PORTAL_STATIC_PRICING_ID = 'pricing';
export const PORTAL_STATIC_CLIENT_ID = 'template';
export const PORTAL_DYNAMIC_PARAMS = process.env.NODE_ENV === 'development';
export const SUPPORTED_LOCALES = ['en', 'he'] as const;

export function getLocaleStaticParams() {
  return SUPPORTED_LOCALES.map(locale => ({ locale }));
}

/**
 * For pages at /[locale]/portal/(workspace)/requests/[requestId]
 * Only need to return requestId - locale is handled by parent layout
 * Note: orgId is now stored in session/context, not in the URL
 */
export function getPortalStaticRequestParams() {
  return [{ requestId: PORTAL_STATIC_REQUEST_ID }];
}

/**
 * For pages at /[locale]/portal/(workspace)/pricing/[pricingId]
 * Only need to return pricingId - locale is handled by parent layout
 * Note: orgId is now stored in session/context, not in the URL
 */
export function getPortalStaticPricingParams() {
  return [{ pricingId: PORTAL_STATIC_PRICING_ID }];
}

/**
 * For pages at /[locale]/portal/agency/clients/[clientId]
 * Only need to return clientId - locale is handled by parent layout
 */
export function getPortalStaticClientParams() {
  return [{ clientId: PORTAL_STATIC_CLIENT_ID }];
}
