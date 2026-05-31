import { useEffect, useState } from 'react';
import { shopService } from '../../api/services/shopService';
import { useAsyncSubmit } from '../common/useAsyncSubmit';

export function useMerchantProfile() {
  const [shop, setShop] = useState(null);

  const { loading, error, success, handleSubmit, setError } = useAsyncSubmit(
    async (data) => {
      const updated = await shopService.updateMyShop(data);
      setShop(updated);
      return updated;
    }
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await shopService.getMyShop();
        if (mounted) setShop(s);
      } catch {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  const save = (data) => handleSubmit(data);

  return { shop, loading, error, success, save, setError };
}

export default useMerchantProfile;
