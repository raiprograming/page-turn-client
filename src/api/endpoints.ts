// Centralized endpoint path definitions, grouped by domain.
// Services should import paths from here instead of hardcoding strings,
// so route changes only need to happen in one place.

export const AUTH_ENDPOINTS = {
  googleRedirectUrl: '/login/google/getRedirectUrl',
  googleCallback: '/login/google/callback',
  emailLogin: '/login/email/login',
} as const;

export const HYPER_PARAMETER_ENDPOINTS = {
  list: '/hyper_parameters',
} as const;

export const ASSET_ENDPOINTS = {
  upload: '/asset',
  url: '/asset/url',
} as const;

export const NEWS_ENDPOINTS = {
  add: '/news',
  list: '/news/list',
  remove: '/news',
} as const;
