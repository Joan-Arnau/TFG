import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { publicService } from '../api/services/publicService';

export const useShops = () => {
  const { t } = useTranslation();
  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);
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
      setShops(shopsData);
      setCategories([{ id: 'all', name: t('shop.categories.all'), icon: 'apps-outline' }, ...categoriesData]);
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

  return { shops, categories, loading, error, refetch: loadData };
};
