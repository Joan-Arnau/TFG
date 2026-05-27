import { useCallback, useEffect, useState } from 'react';
import { merchantService } from '../../../api/services/merchantService';
import useConfirm from '../../../hooks/useConfirm';
import { getLocalizedValue } from '../../../utils/localization';

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
    if (!data) return false;
    const title = typeof data.title === 'object'
      ? getLocalizedValue(data.title, 'ca', '').trim() || getLocalizedValue(data.title, 'es', '').trim() || getLocalizedValue(data.title, 'en', '').trim()
      : (data.title != null ? String(data.title).trim() : '');
    const startsAt = data.startsAt != null ? String(data.startsAt).trim() : '';
    const endsAt = data.endsAt != null ? String(data.endsAt).trim() : '';
    if (!title || !startsAt || !endsAt) return false;
    return new Date(endsAt).getTime() >= new Date(startsAt).getTime();
  }, []);

  return { promotions, loading, error, load, getPromotion, create, update, remove, validatePromotion };
}

export default useMerchantPromotions;
