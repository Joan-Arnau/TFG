import { useCallback, useEffect, useState } from 'react';
import { shopService } from '../../api/services/shopService';
import { promotionService } from '../../api/services/promotionService';
import useConfirm from '../common/useConfirm';

export function useMerchantImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState('');
  const confirm = useConfirm();

  useEffect(() => {
    return () => {
      if (pendingPreviewUrl && pendingPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pendingPreviewUrl);
      }
    };
  }, [pendingPreviewUrl]);

  const filterPromotionImages = useCallback((imagesList, promotionsList) => {
    return (imagesList || []).filter((img) => {
      const isFromPromoFolder = img.imageUrl && (img.imageUrl.includes('/promotions/') || img.imageUrl.includes('/uploads/promotions/'));
      const isUsedInPromo = (promotionsList || []).some((p) => p.imageUrl === img.imageUrl);
      return !isFromPromoFolder && !isUsedInPromo;
    });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [imagesData, promotionsData] = await Promise.all([
        shopService.getImages(),
        promotionService.getAll().catch(() => [])
      ]);
      setImages(filterPromotionImages(imagesData, promotionsData));
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [filterPromotionImages]);

  useEffect(() => {
    let mounted = true;
    const fetchImages = async () => {
      if (!mounted) return;
      setLoading(true);
      try {
        const [imagesData, promotionsData] = await Promise.all([
          shopService.getImages(),
          promotionService.getAll().catch(() => [])
        ]);
        if (mounted) {
          setImages(filterPromotionImages(imagesData, promotionsData));
          setError(null);
        }
      } catch (error) {
        if (mounted) setError(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void fetchImages();
    return () => { mounted = false; };
  }, [filterPromotionImages]);

  const stageUpload = useCallback(async (file) => {
    if (!file) return '';
    const MAX_BYTES = 2 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      setUploadError('File is too large. Maximum allowed size is 2MB.');
      return '';
    }

    if (pendingPreviewUrl && pendingPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(pendingPreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setPendingImageFile(file);
    setPendingPreviewUrl(previewUrl);
    setUploadError('');
    return previewUrl;
  }, [pendingPreviewUrl]);

  const saveUpload = useCallback(async () => {
    if (!pendingImageFile) return null;

    setUploading(true);
    setUploadError('');
    try {
      const uploaded = await shopService.uploadImage(pendingImageFile);
      setImages((s) => [uploaded, ...s]);
      setPendingImageFile(null);

      if (pendingPreviewUrl && pendingPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pendingPreviewUrl);
      }
      setPendingPreviewUrl('');

      return uploaded;
    } catch (error) {
      setUploadError(error?.message || 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  }, [pendingImageFile, pendingPreviewUrl]);

  const remove = useCallback(async (id) => {
    const ok = await confirm('merchant.confirmDeleteImage', 'Delete image?');
    if (!ok) return false;
    await shopService.deleteImage(id);
    setImages((s) => s.filter((i) => i.id !== id));
    return true;
  }, [confirm]);

  return {
    images,
    loading,
    error,
    load,
    stageUpload,
    saveUpload,
    remove,
    uploading,
    uploadError,
    pendingPreviewUrl,
  };
}

export default useMerchantImages;
