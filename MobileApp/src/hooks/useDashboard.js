import { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { useTranslation } from 'react-i18next'; // New import
import { publicService, getTranslation } from '../api/services/publicService'; // Modified import

export const useDashboard = () => {
  const { i18n } = useTranslation(); // New: Get i18n instance for reactive translation
  const [rawFeaturedItem, setRawFeaturedItem] = useState(null); // Changed featuredItem to rawFeaturedItem
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        setLoading(true);
        // We fetch both and pick the most recent/urgent
        const [announcements, events] = await Promise.all([
          publicService.getAnnouncements(),
          publicService.getEvents()
        ]);
        
        const urgent = announcements.find(a => a.urgent);
        if (urgent) {
          setRawFeaturedItem({ // Use setRawFeaturedItem
            type: 'announcement',
            title: urgent.title, // Keep raw title
            subtitle: urgent.categoryName, // Keep raw categoryName
            isUrgent: true
          });
        } else if (events.length > 0) {
          const nextEvent = events[0];
          setRawFeaturedItem({ // Use setRawFeaturedItem
            type: 'event',
            title: nextEvent.title, // Keep raw title
            subtitle: new Date(nextEvent.startsAt).toLocaleDateString(), // Keep as is
            isUrgent: false
          });
        }
      } catch (error) {
        console.error('Error loading dashboard featured item');
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, []);

  const translatedFeaturedItem = useMemo(() => {
    if (!rawFeaturedItem) return null;

    if (rawFeaturedItem.type === 'announcement') {
      return {
        ...rawFeaturedItem,
        title: getTranslation(rawFeaturedItem.title),
        subtitle: getTranslation(rawFeaturedItem.subtitle), // Translate subtitle (categoryName)
      };
    } else if (rawFeaturedItem.type === 'event') {
      return {
        ...rawFeaturedItem,
        title: getTranslation(rawFeaturedItem.title),
        // Subtitle is a date string, no translation needed
      };
    }
    return null;
  }, [rawFeaturedItem, i18n.language]);

  return { featuredItem: translatedFeaturedItem, loading };
};
