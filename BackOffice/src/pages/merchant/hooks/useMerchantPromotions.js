import { useCallback, useEffect, useState } from 'react';
import { merchantService } from '../../../api/services/merchantService';
import useConfirm from '../../../hooks/useConfirm';

export function useMerchantPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const confirm = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = await merchantService.getPromotions();
      setPromotions(p || []);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const getPromotion = useCallback(async (id) => {
    return merchantService.getPromotion(id);
  }, []);

  const create = useCallback(async (data) => {
    const r = await merchantService.createPromotion(data);
    setPromotions((s) => [r, ...s]);
    return r;
  }, []);

  const update = useCallback(async (id, data) => {
    const r = await merchantService.updatePromotion(id, data);
    setPromotions((s) => s.map((x) => (x.id === id ? r : x)));
    return r;
  }, []);

  const remove = useCallback(async (id) => {
    const ok = await confirm('merchant.confirmDeletePromotion', 'Delete promotion?');
    if (!ok) return false;
    await merchantService.deletePromotion(id);
    setPromotions((s) => s.filter((x) => x.id !== id));
    return true;
  }, [confirm]);

  const validatePromotion = useCallback((data) => {
    if (!data) return false;
    const title = data.title != null ? String(data.title).trim() : '';
    // Future: validate dates when added (startDate/endDate)
    return title.length > 0;
  }, []);

  return { promotions, loading, error, load, getPromotion, create, update, remove, validatePromotion };
}

export default useMerchantPromotions;
