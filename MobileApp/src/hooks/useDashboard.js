import { useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { publicService, getTranslation } from '../api/services/publicService';

export const useDashboard = () => {
  const { i18n } = useTranslation();
  const [rawFeaturedItem, setRawFeaturedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadFeatured = useCallback(async () => {
    try {
      setLoading(true);
      const [announcements, events] = await Promise.all([
        publicService.getAnnouncements(),
        publicService.getEvents()
      ]);
      
      const urgent = announcements.find(a => a.urgent);
      if (urgent) {
        setRawFeaturedItem({
          type: 'announcement',
          title: urgent.title,
          subtitle: urgent.categoryName,
          isUrgent: true
        });
      } else if (events.length > 0) {
        const nextEvent = events[0];
        setRawFeaturedItem({
          type: 'event',
          title: nextEvent.title,
          subtitle: new Date(nextEvent.startsAt).toLocaleDateString(),
          isUrgent: false
        });
      } else {
        setRawFeaturedItem(null);
      }
    } catch (err) {
      console.error('Error loading dashboard featured item:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFeatured();
    }, [loadFeatured])
  );

  const translatedFeaturedItem = useMemo(() => {
    if (!rawFeaturedItem) return null;

    if (rawFeaturedItem.type === 'announcement') {
      return {
        ...rawFeaturedItem,
        title: getTranslation(rawFeaturedItem.title, i18n.language),
        subtitle: getTranslation(rawFeaturedItem.subtitle, i18n.language),
      };
    } else if (rawFeaturedItem.type === 'event') {
      return {
        ...rawFeaturedItem,
        title: getTranslation(rawFeaturedItem.title, i18n.language),
      };
    }
    return null;
  }, [rawFeaturedItem, i18n.language]);

  return { featuredItem: translatedFeaturedItem, loading };
};
