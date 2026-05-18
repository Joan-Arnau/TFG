import { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { useTranslation } from 'react-i18next';
import { publicService, getTranslation } from '../api/services/publicService'; // Modified import to get getTranslation

export const useShops = () => {
  const { t, i18n } = useTranslation(); // Destructure i18n for language dependency
  const [rawShops, setRawShops] = useState([]); // Renamed shops to rawShops
  const [rawCategories, setRawCategories] = useState([]); // Renamed categories to rawCategories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(false);
      const [shopsData, categoriesData] = await Promise.all([
        publicService.getShops(),
        publicService.getCategories()
      ]);
      setRawShops(shopsData); // Use setRawShops
      setRawCategories(categoriesData); // Use setRawCategories
    } catch (error) {
      console.error('Error loading shops data');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const translatedCategories = useMemo(() => {
    // Add 'all' category first, translated
    const allCategory = { id: 'all', name: t('shop.categories.all'), icon: 'apps-outline' };
    
    // Translate other categories
    const otherCategories = rawCategories.map(cat => ({
      id: cat.id,
      name: getTranslation(cat.name),
      icon: cat.icon || 'apps-outline'
    }));
    return [allCategory, ...otherCategories];
  }, [rawCategories, i18n.language, t]); // Add i18n.language and t to dependencies

  const translatedShops = useMemo(() => {
    return rawShops.map(shop => ({
      ...shop,
      name: getTranslation(shop.name),
      description: getTranslation(shop.description),
      categoryName: getTranslation(shop.categoryName)
    }));
  }, [rawShops, i18n.language]); // Add i18n.language to dependencies

  return { shops: translatedShops, categories: translatedCategories, loading, error, refetch: loadData };
};
