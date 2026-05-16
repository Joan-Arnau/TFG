import { useState, useEffect } from 'react';
import { publicService } from '../api/services/publicService';

export const useShopDetail = (id) => {
  const [shop, setShop] = useState(null);
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
        setShop(data);
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

  return { shop, loading, error, refetch: loadShop };
};
