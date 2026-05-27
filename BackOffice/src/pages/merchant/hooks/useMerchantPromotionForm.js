import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { buildLocalizedMap, getLocalizedDraft } from '../../../utils/localization';
import { MERCHANT_ROUTES } from '../constants';
import { useMerchantPromotions } from './useMerchantPromotions';
import { merchantService } from '../../../api/services/merchantService';

const emptyLocalized = { ca: '', es: '', en: '' };

const toDateTimeLocal = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toIsoString = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
};

const createDraft = (promotion) => ({
  title: getLocalizedDraft(promotion?.title) || emptyLocalized,
  description: getLocalizedDraft(promotion?.description) || emptyLocalized,
  startsAt: toDateTimeLocal(promotion?.startsAt),
  endsAt: toDateTimeLocal(promotion?.endsAt),
  imageUrl: promotion?.imageUrl || '',
});

export function useMerchantPromotionForm(id) {
  const navigate = useNavigate();
  const { getPromotion, create, update, validatePromotion } = useMerchantPromotions();
  const [draft, setDraft] = useState(createDraft(null));
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [loadingDraft, setLoadingDraft] = useState(Boolean(id));
  const [loadError, setLoadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    let active = true;

    const loadPromotion = async () => {
      if (!id) {
        setDraft(createDraft(null));
        setPendingImageFile(null);
        setLoadingDraft(false);
        return;
      }

      setLoadingDraft(true);
      try {
        const promotion = await getPromotion(id);
        if (active) {
          setDraft(createDraft(promotion));
          setPendingImageFile(null);
          setLoadError('');
        }
      } catch (error) {
        if (active) {
          setLoadError(error?.message || 'Error loading data');
        }
      } finally {
        if (active) setLoadingDraft(false);
      }
    };

    void loadPromotion();
    return () => { active = false; };
  }, [id, getPromotion]);

  const { loading: saving, error: submitError, handleSubmit } = useAsyncSubmit(async (payload) => {
    const result = id ? await update(id, payload) : await create(payload);
    navigate(MERCHANT_ROUTES.PROMOTIONS);
    return result;
  });

  const setLocalizedField = useCallback((field, language, value) => {
    setDraft((current) => ({
      ...current,
      [field]: { ...current[field], [language]: value },
    }));
  }, []);

  const setField = useCallback((field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  }, []);

  const uploadImage = useCallback(async (file) => {
    if (!file) return null;
    const MAX_BYTES = 2 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      setUploadError('File is too large. Maximum allowed size is 2MB.');
      return null;
    }
    setPendingImageFile(file);
    setUploadError('');
    return URL.createObjectURL(file);
  }, []);

  const submit = useCallback(async (event) => {
    event.preventDefault();
    setUploading(true);
    setUploadError('');
    try {
      let imageUrl = draft.imageUrl;

      if (pendingImageFile) {
        const resp = await merchantService.uploadImage(pendingImageFile);
        imageUrl = resp?.imageUrl || resp?.url || resp?.fileUrl || '';
        if (!imageUrl) {
          throw new Error('Upload succeeded but the server did not return an image URL.');
        }
        setDraft((current) => ({ ...current, imageUrl }));
        setPendingImageFile(null);
      }

      return await handleSubmit({
        title: buildLocalizedMap(draft.title),
        description: buildLocalizedMap(draft.description),
        startsAt: toIsoString(draft.startsAt),
        endsAt: toIsoString(draft.endsAt),
        imageUrl,
      });
    } catch (err) {
      setUploadError(err?.message || 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  }, [draft, handleSubmit, pendingImageFile]);

  const canSubmit = useMemo(() => validatePromotion({ title: draft.title, startsAt: draft.startsAt, endsAt: draft.endsAt }), [draft, validatePromotion]);
  const validationMessage = (() => {
    const title = draft.title.ca.trim() || draft.title.es.trim() || draft.title.en.trim();
    if (!title) return 'Omple el títol en català.';
    if (!draft.startsAt || !draft.endsAt) return 'Omple la data d’inici i la data de fi.';
    if (new Date(draft.endsAt).getTime() < new Date(draft.startsAt).getTime()) {
      return 'La data de fi ha de ser posterior a la data d’inici.';
    }
    return '';
  })();

  return {
    draft,
    loading: loadingDraft || saving,
    error: loadError || submitError,
    canSubmit,
    validationMessage,
    isEdit: Boolean(id),
    submit,
    setLocalizedField,
    setField,
    uploadImage,
    uploading,
    uploadError,
  };
}

export default useMerchantPromotionForm;