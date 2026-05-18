import { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { useTranslation } from 'react-i18next'; // New import
import { publicService, getTranslation } from '../api/services/publicService'; // Modified import

export const useShopDetail = (id) => {
  const { i18n } = useTranslation(); // New: Get i18n instance for reactive translation
  const [rawShop, setRawShop] = useState(null); // Changed shop to rawShop
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadShop = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(false);
      const data = await publicService.getShopById(id);
      if (!data) {
        setError(true);
      } else {
        setRawShop(data); // Use setRawShop
      }
    } catch (error) {
      console.error('Error loading shop detail');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShop();
  }, [id]);

  const translatedShop = useMemo(() => {
    if (!rawShop) return null;

    return {
      ...rawShop,
      name: getTranslation(rawShop.name),
      description: getTranslation(rawShop.description),
      categoryName: getTranslation(rawShop.categoryName),
      promotions: rawShop.promotions.map(p => ({
        ...p,
        title: getTranslation(p.title),
        description: getTranslation(p.description),
      }))
    };
  }, [rawShop, i18n.language]);

  return { shop: translatedShop, loading, error, refetch: loadShop };
};
