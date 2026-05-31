import { useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { publicService } from '../api/services/publicService';

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const [annData, catData] = await Promise.all([
        publicService.getAnnouncements(),
        publicService.getCategories('ANNOUNCEMENT')
      ]);

      const sortedAnnouncements = annData.sort((a, b) => {
        // Urgent first (true before false)
        if (a.urgent !== b.urgent) {
          return a.urgent ? -1 : 1;
        }
        // Then by date descending
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      });

      setAnnouncements(sortedAnnouncements);
      setCategories(catData);
    } catch (err) {
      console.error('Error fetching announcements data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  return useMemo(() => ({
    announcements,
    categories,
    loading,
    error,
    refetch: fetchData
  }), [announcements, categories, loading, error, fetchData]);
};
