import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { buildLocalizedMap, getLocalizedDraft } from '../../../utils/localization';
import { MERCHANT_ROUTES } from '../constants';
import { useMerchantPromotions } from './useMerchantPromotions';

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
  const [loadingDraft, setLoadingDraft] = useState(Boolean(id));
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;

    const loadPromotion = async () => {
      if (!id) {
        setDraft(createDraft(null));
        setLoadingDraft(false);
        return;
      }

      setLoadingDraft(true);
      try {
        const promotion = await getPromotion(id);
        if (active) {
          setDraft(createDraft(promotion));
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

  const submit = useCallback(async (event) => {
    event.preventDefault();
    try {
      return await handleSubmit({
        title: buildLocalizedMap(draft.title),
        description: buildLocalizedMap(draft.description),
        startsAt: toIsoString(draft.startsAt),
        endsAt: toIsoString(draft.endsAt),
        imageUrl: draft.imageUrl,
      });
    } catch {
      return null;
    }
  }, [draft, handleSubmit]);

  const canSubmit = useMemo(() => validatePromotion({ title: draft.title, startsAt: draft.startsAt, endsAt: draft.endsAt }), [draft, validatePromotion]);

  return {
    draft,
    loading: loadingDraft || saving,
    error: loadError || submitError,
    canSubmit,
    isEdit: Boolean(id),
    submit,
    setLocalizedField,
    setField,
  };
}

export default useMerchantPromotionForm;