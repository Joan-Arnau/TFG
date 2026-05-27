import { useEffect, useState } from 'react';
import { merchantService } from '../../../api/services/merchantService';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';

export function useMerchantProfile() {
  const [shop, setShop] = useState(null);

  const { loading, error, success, handleSubmit } = useAsyncSubmit(
    async (data) => {
      const updated = await merchantService.updateMyShop(data);
      setShop(updated);
      return updated;
    }
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await merchantService.getMyShop();
        if (mounted) setShop(s);
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  const save = (data) => handleSubmit(data);

  return { shop, loading, error, success, save };
}

export default useMerchantProfile;
