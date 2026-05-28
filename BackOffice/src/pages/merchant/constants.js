// Centralized merchant routes and config
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

export const MERCHANT_LANGUAGES = ['ca', 'es', 'en'];

// API endpoints (can be overridden via Vite env)
export const MERCHANT_API_BASE = import.meta.env.VITE_MERCHANT_API_BASE || '/merchant';
export const MERCHANT_API = {
  MY_SHOP: `${MERCHANT_API_BASE}/my-shop`,
  PROMOTIONS: `${MERCHANT_API_BASE}/promotions`,
  PROMOTION: (id) => `${MERCHANT_API_BASE}/promotions/${id}`,
  IMAGES: `${MERCHANT_API_BASE}/my-shop/images`,
  IMAGE: (id) => `${MERCHANT_API_BASE}/my-shop/images/${id}`,
  CATEGORIES: `${MERCHANT_API_BASE}/categories`,
};

export const buildPromotionEditPath = (id) => `${MERCHANT_ROUTES.PROMOTIONS}/${id}/edit`;
