import { useState, useEffect } from 'react';
import { publicService } from '../api/services/publicService';

export const usePointOfInterestDetail = (id) => {
  const [poi, setPoi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadPoi = async () => {
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
    } catch (error) {
      console.error('Error loading POI detail');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPoi();
  }, [id]);

  return { poi, loading, error, refetch: loadPoi };
};
