import { useCallback, useEffect, useState } from 'react';
import { shopService } from '../../api/services/shopService';

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
  const [allShops, setAllShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadShops = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [pendingData, allData] = await Promise.all([
        shopService.getPendingShops(),
        shopService.adminGetAll(),
      ]);

      setPendingShops(normalizeShops(pendingData));
      setAllShops(normalizeShops(allData));
    } catch (currentError) {
      console.error('Error fetching admin shops:', currentError);
      setError(currentError);
    } finally {
      setLoading(false);
    }
  }, []);

  const approveShop = async (id) => {
    await shopService.updateStatus(id, 'APPROVED');
    await loadShops();
  };

  const rejectShop = async (id, reason) => {
    await shopService.updateStatus(id, 'REJECTED', reason);
    await loadShops();
  };

  const suspendShop = async (id) => {
    await shopService.updateStatus(id, 'SUSPENDED');
    await loadShops();
  };

  const deleteShop = async (id) => {
    await shopService.adminDelete(id);
    await loadShops();
  };

  useEffect(() => {
    setTimeout(() => loadShops(), 0);
  }, [loadShops]);

  return {
    pendingShops,
    allShops,
    loading,
    error,
    refresh: loadShops,
    approveShop,
    rejectShop,
    suspendShop,
    deleteShop,
  };
};
