import { useState, useEffect } from 'react';
import { publicService } from '../api/services/publicService';

export const useDashboard = () => {
  const [featuredItem, setFeaturedItem] = useState(null);
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
          setFeaturedItem({
            type: 'announcement',
            title: urgent.title,
            subtitle: urgent.categoryName,
            isUrgent: true
          });
        } else if (events.length > 0) {
          const nextEvent = events[0];
          setFeaturedItem({
            type: 'event',
            title: nextEvent.title,
            subtitle: new Date(nextEvent.startsAt).toLocaleDateString(),
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

  return { featuredItem, loading };
};
