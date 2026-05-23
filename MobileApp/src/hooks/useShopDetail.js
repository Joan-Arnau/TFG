import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { publicService, getTranslation } from '../api/services/publicService';

export const useShopDetail = (id) => {
  const { i18n } = useTranslation();
  const [rawShop, setRawShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadShop = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(false);
      const data = await publicService.getShopById(id);
      if (!data) {
        setError(true);
      } else {
        setRawShop(data);
      }
    } catch {
      console.error('Error loading shop detail');
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadShop();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadShop]);

  const translatedShop = useMemo(() => {
    if (!rawShop) return null;

    return {
      ...rawShop,
      name: getTranslation(rawShop.name, i18n.language),
      description: getTranslation(rawShop.description, i18n.language),
      categoryName: getTranslation(rawShop.categoryName, i18n.language),
      promotions: rawShop.promotions.map(p => ({
        ...p,
        title: getTranslation(p.title, i18n.language),
        description: getTranslation(p.description, i18n.language),
      }))
    };
  }, [rawShop, i18n.language]);

  return { shop: translatedShop, loading, error, refetch: loadShop };
};
