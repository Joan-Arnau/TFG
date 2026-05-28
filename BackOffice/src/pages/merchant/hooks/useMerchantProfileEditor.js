import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { buildLocalizedMap, getLocalizedDraft } from '../../../utils/localization';
import { merchantService } from '../../../api/services/merchantService';
import useConfirm from '../../../hooks/useConfirm';
import { useMerchantProfile } from './useMerchantProfile';

const emptyLocalized = { ca: '', es: '', en: '' };

const createDraft = (shop) => ({
  name: getLocalizedDraft(shop?.name) || emptyLocalized,
  description: getLocalizedDraft(shop?.description) || emptyLocalized,
  address: shop?.address || '',
  phoneNumber: shop?.phoneNumber || '',
  categoryId: shop?.category?.id ? String(shop.category.id) : '',
  latitude: shop?.latitude != null ? String(shop.latitude) : '',
  longitude: shop?.longitude != null ? String(shop.longitude) : '',
});

const normalizeCoordinate = (value) => {
  if (value === '' || value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeNameMap = (value) => buildLocalizedMap(value);

export function useMerchantProfileEditor() {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const { shop, loading, error, success, save, setError } = useMerchantProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(createDraft(null));
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const hasShop = useMemo(() => Boolean(shop), [shop]);

  const hasCriticalChanges = useMemo(() => {
    if (!shop) return false;
    const draftName = normalizeNameMap(draft.name);
    const shopName = normalizeNameMap(shop.name);
    const nameChanged = JSON.stringify(draftName) !== JSON.stringify(shopName);

    const draftCategoryId = draft.categoryId ? Number(draft.categoryId) : null;
    const shopCategoryId = shop.category?.id ?? null;
    const categoryChanged = draftCategoryId != null && draftCategoryId !== shopCategoryId;

    const draftLat = normalizeCoordinate(draft.latitude);
    const draftLon = normalizeCoordinate(draft.longitude);
    const coordsChanged = draftLat != null && draftLon != null &&
      (draftLat !== shop.latitude || draftLon !== shop.longitude);

    return nameChanged || categoryChanged || coordsChanged;
  }, [draft, shop]);

  const startEditing = useCallback(() => {
    setDraft(createDraft(shop));
    setIsEditing(true);
  }, [shop]);

  const cancelEditing = useCallback(() => {
    setDraft(createDraft(shop));
    setIsEditing(false);
  }, [shop]);

  const setLocalizedField = useCallback((field, language, value) => {
    setDraft((current) => ({
      ...current,
      [field]: { ...current[field], [language]: value },
    }));
  }, []);

  const setField = useCallback((field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  }, []);

  const submit = useCallback(async () => {
    try {
      setError('');
      const draftLat = normalizeCoordinate(draft.latitude);
      const draftLon = normalizeCoordinate(draft.longitude);
      if ((draftLat == null) !== (draftLon == null)) {
        setError(t('merchant.coordsBothRequired', 'Latitude and longitude must be provided together.'));
        return;
      }

      if (hasCriticalChanges) {
        const confirmed = await confirm(
          'merchant.confirmCriticalChanges',
          'These changes will send your shop back to municipal review. Continue?'
        );
        if (!confirmed) return;
      }

      await save({
        name: buildLocalizedMap(draft.name),
        description: buildLocalizedMap(draft.description),
        address: draft.address,
        phoneNumber: draft.phoneNumber,
        categoryId: draft.categoryId ? Number(draft.categoryId) : null,
        latitude: draftLat,
        longitude: draftLon,
      });
      setIsEditing(false);
    } catch {
      // handled by useAsyncSubmit
    }
  }, [confirm, draft, hasCriticalChanges, save, setError, t]);

  useEffect(() => {
    let active = true;
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const data = await merchantService.getCategories('SHOP');
        if (active) setCategories(Array.isArray(data) ? data : []);
      } catch {
        if (active) setCategories([]);
      } finally {
        if (active) setCategoriesLoading(false);
      }
    };
    void loadCategories();
    return () => {
      active = false;
    };
  }, []);

  return {
    shop,
    hasShop,
    loading,
    error,
    success,
    isEditing,
    draft,
    categories,
    categoriesLoading,
    hasCriticalChanges,
    startEditing,
    cancelEditing,
    setLocalizedField,
    setField,
    submit,
  };
}

export default useMerchantProfileEditor;