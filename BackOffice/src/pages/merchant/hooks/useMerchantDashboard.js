import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MERCHANT_ROUTES, MERCHANT_TEXT_KEYS } from '../constants';
import { useMerchantProfile } from './useMerchantProfile';
import { getLocalizedValue } from '../../../utils/localization';

export function useMerchantDashboard() {
  const { t, i18n } = useTranslation();

  const { shop } = useMerchantProfile();

  const hero = useMemo(() => ({
    eyebrow: t(MERCHANT_TEXT_KEYS.EYEBROW, 'Merchant backoffice'),
    title: shop ? getLocalizedValue(shop.name, i18n.language, t(MERCHANT_TEXT_KEYS.HERO_TITLE, 'Manage your shop content')) : t(MERCHANT_TEXT_KEYS.HERO_TITLE, 'Manage your shop content'),
    description: t(MERCHANT_TEXT_KEYS.HERO_DESC, 'Update your profile, publish promotions and manage the image gallery from one place.'),
  }), [i18n.language, shop, t]);

  const navItems = useMemo(() => ([
    { key: 'profile', label: t('merchant.profile', 'Profile'), to: MERCHANT_ROUTES.PROFILE },
    { key: 'promotions', label: t('merchant.promotions', 'Promotions'), to: MERCHANT_ROUTES.PROMOTIONS },
    { key: 'images', label: t('merchant.images', 'Images'), to: MERCHANT_ROUTES.IMAGES },
  ]), [t]);

  return { hero, navItems };
}

export default useMerchantDashboard;
