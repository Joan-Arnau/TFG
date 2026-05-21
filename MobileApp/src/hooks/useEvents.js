import { useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { publicService } from '../api/services/publicService';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const [eventData, catData] = await Promise.all([
        publicService.getEvents(),
        publicService.getCategories('EVENT')
      ]);

      setEvents(eventData);
      setCategories(catData);
    } catch (err) {
      console.error('Error fetching events data:', err);
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

  // Group events by date for SectionList format
  const groupEventsByDate = (eventList) => {
    const grouped = {};
    eventList.forEach(event => {
      const dateKey = new Date(event.startsAt).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          title: dateKey,
          data: []
        };
      }
      grouped[dateKey].data.push(event);
    });
    return Object.values(grouped).sort((a, b) => {
      return new Date(a.data[0].startsAt) - new Date(b.data[0].startsAt);
    });
  };

  const filterEvents = (eventList, activeCategory) => {
    if (activeCategory === 'all') return eventList;
    return eventList.filter(item => item.categoryName === activeCategory);
  };

  return useMemo(() => ({
    events,
    categories,
    loading,
    error,
    refetch: fetchData,
    groupEventsByDate,
    filterEvents
  }), [events, categories, loading, error, fetchData]);
};