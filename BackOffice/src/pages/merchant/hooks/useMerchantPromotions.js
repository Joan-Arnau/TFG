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
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchPromotions = async () => {
      if (!mounted) return;
      setLoading(true);
      try {
        const p = await merchantService.getPromotions();
        if (mounted) {
          setPromotions(p || []);
          setError(null);
        }
      } catch (error) {
        if (mounted) setError(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void fetchPromotions();
    return () => { mounted = false; };
  }, []);

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
    if (!data || !data.imageUrl || !data.startsAt || !data.endsAt) return false;
    
    // Strict check: check keys directly to avoid getLocalizedValue fallback logic
    const langs = ['ca', 'es', 'en'];
    const titleObj = data.title || {};
    const descObj = data.description || {};
    
    const hasAllTitles = langs.every(l => titleObj[l] && titleObj[l].trim() !== '');
    const hasAllDescs = langs.every(l => descObj[l] && descObj[l].trim() !== '');

    if (!hasAllTitles || !hasAllDescs) return false;

    return new Date(data.endsAt).getTime() > new Date(data.startsAt).getTime();
  }, []);

  return { promotions, loading, error, load, getPromotion, create, update, remove, validatePromotion };
}

export default useMerchantPromotions;
