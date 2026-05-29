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

export function useMerchantPromotionForm(id) {
  const navigate = useNavigate();
  const { getPromotion, create, update, validatePromotion } = useMerchantPromotions();
  const [draft, setDraft] = useState({
    title: emptyLocalized,
    description: emptyLocalized,
    startsAt: '',
    endsAt: '',
    imageUrl: '',
  });
  const [originalPromotion, setOriginalPromotion] = useState(null);
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [loadingDraft, setLoadingDraft] = useState(Boolean(id));
  const [loadError, setLoadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    let active = true;

    const loadPromotion = async () => {
      if (!id) {
        setDraft({
          title: emptyLocalized,
          description: emptyLocalized,
          startsAt: '',
          endsAt: '',
          imageUrl: '',
        });
        setOriginalPromotion(null);
        setPendingImageFile(null);
        setLoadingDraft(false);
        return;
      }

      setLoadingDraft(true);
      try {
        const promotion = await getPromotion(id);
        if (active) {
          setOriginalPromotion(promotion);
          setDraft({
            title: getLocalizedDraft(promotion?.title) || emptyLocalized,
            description: getLocalizedDraft(promotion?.description) || emptyLocalized,
            startsAt: toDateTimeLocal(promotion?.startsAt),
            endsAt: toDateTimeLocal(promotion?.endsAt),
            imageUrl: promotion?.imageUrl || '',
          });
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
    // If editing, prevent changing startsAt
    if (id && field === 'startsAt') return;

    // Prevent years > 4 digits in datetime-local (format: YYYY-MM-DDTHH:mm)
    if ((field === 'startsAt' || field === 'endsAt') && value) {
      const yearPart = value.split('-')[0];
      if (yearPart.length > 4) return;
    }

    setDraft((current) => ({ ...current, [field]: value }));
  }, [id]);

  const uploadImage = useCallback(async (file) => {
    if (!file) return null;
    const MAX_BYTES = 2 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      setUploadError('File is too large. Maximum allowed size is 2MB.');
      return null;
    }
    setPendingImageFile(file);
    setUploadError('');
    const previewUrl = URL.createObjectURL(file);
    setDraft(prev => ({ ...prev, imageUrl: previewUrl }));
    return previewUrl;
  }, []);

  const canSubmit = useMemo(() => validatePromotion({ 
    title: draft.title, 
    description: draft.description, 
    startsAt: draft.startsAt, 
    endsAt: draft.endsAt,
    imageUrl: draft.imageUrl
  }), [draft, validatePromotion]);

  const validationMessage = (() => {
    const langs = ['ca', 'es', 'en'];
    const hasAllTitles = langs.every(l => draft.title[l] && draft.title[l].trim() !== '');
    const hasAllDescs = langs.every(l => draft.description[l] && draft.description[l].trim() !== '');

    if (!hasAllTitles) return 'Has d’omplir el títol en tots els idiomes.';
    if (!hasAllDescs) return 'Has d’omplir la descripció en tots els idiomes.';
    if (!draft.startsAt || !draft.endsAt) return 'Omple la data d’inici i la data de fi.';
    
    const now = new Date();
    const startDate = new Date(draft.startsAt);
    const endDate = new Date(draft.endsAt);

    // Only check past start date if we are creating a new promotion
    if (!id && startDate < now) {
      return 'La data d’inici no pot ser anterior a l’actual.';
    }

    if (endDate <= startDate) {
      return 'La data de fi ha de ser posterior a la data d’inici.';
    }
    if (!draft.imageUrl) return 'La imatge és obligatòria.';
    return '';
  })();

  const submit = useCallback(async (event) => {
    if (event) event.preventDefault();
    
    // Final check before sending
    if (!validatePromotion({ 
      title: draft.title, 
      description: draft.description, 
      startsAt: draft.startsAt, 
      endsAt: draft.endsAt,
      imageUrl: draft.imageUrl
    })) {
      setUploadError('Tots els camps són obligatoris i han de ser vàlids.');
      return null;
    }

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
      }

      // Defense: if editing, always use original startsAt
      const finalStartsAt = id ? originalPromotion?.startsAt : toIsoString(draft.startsAt);

      return await handleSubmit({
        title: buildLocalizedMap(draft.title),
        description: buildLocalizedMap(draft.description),
        startsAt: finalStartsAt,
        endsAt: toIsoString(draft.endsAt),
        imageUrl,
      });
    } catch (err) {
      setUploadError(err?.message || 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  }, [canSubmit, draft, handleSubmit, id, originalPromotion, pendingImageFile]);

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
