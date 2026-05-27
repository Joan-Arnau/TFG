import { useCallback, useMemo, useState } from 'react';
import { buildLocalizedMap, getLocalizedDraft } from '../../../utils/localization';
import { useMerchantProfile } from './useMerchantProfile';

const emptyLocalized = { ca: '', es: '', en: '' };

const createDraft = (shop) => ({
  name: getLocalizedDraft(shop?.name) || emptyLocalized,
  description: getLocalizedDraft(shop?.description) || emptyLocalized,
  address: shop?.address || '',
  phoneNumber: shop?.phoneNumber || '',
});

export function useMerchantProfileEditor() {
  const { shop, loading, error, success, save } = useMerchantProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(createDraft(null));

  const hasShop = useMemo(() => Boolean(shop), [shop]);

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
      await save({
        name: buildLocalizedMap(draft.name),
        description: buildLocalizedMap(draft.description),
        address: draft.address,
        phoneNumber: draft.phoneNumber,
      });
      setIsEditing(false);
    } catch {
      // handled by useAsyncSubmit
    }
  }, [draft, save]);

  return {
    shop,
    hasShop,
    loading,
    error,
    success,
    isEditing,
    draft,
    startEditing,
    cancelEditing,
    setLocalizedField,
    setField,
    submit,
  };
}

export default useMerchantProfileEditor;