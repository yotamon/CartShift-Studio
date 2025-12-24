export const PORTAL_STATIC_ORG_ID = 'template';
export const PORTAL_STATIC_REQUEST_ID = 'request';
export const PORTAL_DYNAMIC_PARAMS = process.env.NODE_ENV === 'development';

export function getPortalStaticOrgParams() {
  return [{ orgId: PORTAL_STATIC_ORG_ID }];
}

export function getPortalStaticRequestParams() {
  return [{ orgId: PORTAL_STATIC_ORG_ID, requestId: PORTAL_STATIC_REQUEST_ID }];
}
