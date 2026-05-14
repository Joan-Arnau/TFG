import { useCallback, useEffect, useState } from 'react';
import { shopService } from '../api/services/shopService';

const normalizeShops = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.shops)) {
    return data.shops;
  }

  return [];
};

export const usePendingShops = () => {
  const [pendingShops, setPendingShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPendingShops = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await shopService.getPendingShops();
      setPendingShops(normalizeShops(data));
    } catch (currentError) {
      console.error('Error fetching pending shops:', currentError);
      setError(currentError);
      setPendingShops([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadInitialPendingShops = async () => {
      try {
        const data = await shopService.getPendingShops();

        if (!isMounted) {
          return;
        }

        setPendingShops(normalizeShops(data));
      } catch (currentError) {
        console.error('Error fetching pending shops:', currentError);

        if (!isMounted) {
          return;
        }

        setError(currentError);
        setPendingShops([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInitialPendingShops();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    pendingShops,
    loading,
    error,
    refresh: loadPendingShops,
  };
};
