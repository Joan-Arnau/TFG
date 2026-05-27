import { useCallback, useEffect, useState } from 'react';
import { merchantService } from '../../../api/services/merchantService';
import useConfirm from '../../../hooks/useConfirm';

export function useMerchantImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const confirm = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const i = await merchantService.getImages();
      setImages(i || []);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const upload = useCallback(async (file) => {
    const uploaded = await merchantService.uploadImage(file);
    setImages((s) => [uploaded, ...s]);
    return uploaded;
  }, []);

  const remove = useCallback(async (id) => {
    const ok = await confirm('merchant.confirmDeleteImage', 'Delete image?');
    if (!ok) return false;
    await merchantService.deleteImage(id);
    setImages((s) => s.filter((i) => i.id !== id));
    return true;
  }, [confirm]);

  return { images, loading, error, load, upload, remove };
}

export default useMerchantImages;
