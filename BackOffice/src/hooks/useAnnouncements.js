import { useCallback, useEffect, useState } from 'react';
import { announcementService } from '../api/services/announcementService';

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnnouncements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await announcementService.getAll();
      setAnnouncements(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => loadAnnouncements(), 0);
  }, [loadAnnouncements]);

  return {
    announcements,
    loading,
    error,
    refresh: loadAnnouncements,
    create: announcementService.create,
    update: announcementService.update,
    updateStatus: announcementService.updateStatus,
    delete: announcementService.delete
  };
};
