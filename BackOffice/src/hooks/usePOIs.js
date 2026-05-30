import { useCallback, useEffect, useState } from 'react';
import { poiService } from '../api/services/poiService';
import { useTranslation } from 'react-i18next';

export const usePOIs = () => {
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { i18n } = useTranslation();

  const loadPOIs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await poiService.getAll();
      const sortedPois = data.sort((a, b) => {
        const nameA = a.name[i18n.language] || a.name['ca'] || '';
        const nameB = b.name[i18n.language] || b.name['ca'] || '';
        return nameA.localeCompare(nameB);
      });
      setPois(sortedPois);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  useEffect(() => {
    setTimeout(() => loadPOIs(), 0);
  }, [loadPOIs]);

  return {
    pois,
    loading,
    error,
    refresh: loadPOIs,
    create: poiService.create,
    update: poiService.update,
    delete: poiService.delete,
    uploadImage: poiService.uploadImage
  };
};
