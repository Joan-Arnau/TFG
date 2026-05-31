// Centralized App routes, languages, and config
export const SUPPORTED_LANGUAGES = ['ca', 'es', 'en'];

// Merchant section configurations
export const MERCHANT_BASE_PATH = import.meta.env.VITE_MERCHANT_BASE_PATH || '/merchant';

export const MERCHANT_ROUTES = {
  BASE: MERCHANT_BASE_PATH,
  PROFILE: `${MERCHANT_BASE_PATH}/profile`,
  PROMOTIONS: `${MERCHANT_BASE_PATH}/promotions`,
  IMAGES: `${MERCHANT_BASE_PATH}/images`,
  PROMOTION_NEW: `${MERCHANT_BASE_PATH}/promotions/new`,
  PROMOTION_EDIT: `${MERCHANT_BASE_PATH}/promotions/:id/edit`,
};

export const MERCHANT_TEXT_KEYS = {
  EYEBROW: 'merchant.eyebrow',
  HERO_TITLE: 'merchant.heroTitle',
  HERO_DESC: 'merchant.heroDescription',
};

// API Endpoints
export const AUTH_API = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
};

export const PUBLIC_API = {
  CONFIG: '/public/config',
  SHOPS: '/public/shops',
  SHOP: (id) => `/public/shops/${id}`,
};

export const ADMIN_API = {
  CONFIG: '/admin/config',
  UPLOAD: '/admin/upload',
  ANNOUNCEMENTS: '/admin/announcements',
  ANNOUNCEMENT: (id) => `/admin/announcements/${id}`,
  ANNOUNCEMENT_STATUS: (id) => `/admin/announcements/${id}/status`,
  CATEGORIES: '/admin/categories',
  CATEGORY: (id) => `/admin/categories/${id}`,
  CONTACTS: '/admin/contacts',
  CONTACT: (id) => `/admin/contacts/${id}`,
  EVENTS: '/admin/events',
  EVENT: (id) => `/admin/events/${id}`,
  POIS: '/admin/pois',
  POI: (id) => `/admin/pois/${id}`,
  POI_IMAGE: (id) => `/admin/pois/${id}/image`,
  SHOPS: '/admin/shops',
  SHOPS_PENDING: '/admin/shops/pending',
  SHOP: (id) => `/admin/shops/${id}`,
  SHOP_STATUS: (id) => `/admin/shops/${id}/status`,
};

export const MERCHANT_API_BASE = import.meta.env.VITE_MERCHANT_API_BASE || '/merchant';
export const MERCHANT_API = {
  BASE: '/shops',
  BY_ID: (id) => `/shops/${id}`,
  MY_SHOP: `${MERCHANT_API_BASE}/my-shop`,
  PROMOTIONS: `${MERCHANT_API_BASE}/promotions`,
  PROMOTION: (id) => `${MERCHANT_API_BASE}/promotions/${id}`,
  IMAGES: `${MERCHANT_API_BASE}/my-shop/images`,
  IMAGE: (id) => `${MERCHANT_API_BASE}/my-shop/images/${id}`,
  CATEGORIES: `${MERCHANT_API_BASE}/categories`,
};

export const buildPromotionEditPath = (id) => `${MERCHANT_ROUTES.PROMOTIONS}/${id}/edit`;
