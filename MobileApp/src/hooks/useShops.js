import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { publicService, getTranslation } from '../api/services/publicService';

export const useShops = () => {
  const { t, i18n } = useTranslation();
  const [rawShops, setRawShops] = useState([]);
  const [rawCategories, setRawCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const [shopsData, categoriesData] = await Promise.all([
        publicService.getShops(),
        publicService.getCategories()
      ]);
      setRawShops(shopsData);
      setRawCategories(categoriesData);
    } catch {
      console.error('Error loading shops data');
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  const translatedCategories = useMemo(() => {
    const allCategory = { id: 'all', name: t('shop.categories.all'), icon: 'apps-outline' };

    const otherCategories = rawCategories.map(cat => ({
      id: cat.id,
      name: getTranslation(cat.name, i18n.language),
      icon: cat.icon || 'apps-outline'
    }));
    return [allCategory, ...otherCategories];
  }, [rawCategories, i18n.language, t]);

  const translatedShops = useMemo(() => {
    return rawShops.map(shop => ({
      ...shop,
      name: getTranslation(shop.name, i18n.language),
      description: getTranslation(shop.description, i18n.language),
      categoryName: getTranslation(shop.categoryName, i18n.language)
    }));
  }, [rawShops, i18n.language]);

  return { shops: translatedShops, categories: translatedCategories, loading, error, refetch: loadData };
};
