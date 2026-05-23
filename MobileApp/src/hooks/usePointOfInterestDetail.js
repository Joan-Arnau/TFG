import { useState, useEffect, useCallback } from 'react';
import { publicService } from '../api/services/publicService';

export const usePointOfInterestDetail = (id) => {
  const [poi, setPoi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadPoi = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(false);
      const data = await publicService.getPointOfInterestById(id);
      if (!data) {
        setError(true);
      } else {
        setPoi(data);
      }
    } catch {
      console.error('Error loading POI detail');
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadPoi();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadPoi]);

  return { poi, loading, error, refetch: loadPoi };
};
