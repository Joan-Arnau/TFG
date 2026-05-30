import { useCallback, useEffect, useState } from 'react';
import { eventService } from '../api/services/eventService';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.getAll();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => loadEvents(), 0);
  }, [loadEvents]);

  const createEvent = async (eventData) => {
    try {
      await eventService.create(eventData);
      await loadEvents();
    } catch (err) {
      console.error("Error creating event:", err);
      throw err;
    }
  };

  const updateEvent = async (id, eventData) => {
    try {
      await eventService.update(id, eventData);
      await loadEvents();
    } catch (err) {
      console.error("Error updating event:", err);
      throw err;
    }
  };

  const deleteEvent = async (id) => {
    try {
      await eventService.delete(id);
      await loadEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
      throw err;
    }
  };

  const uploadImage = async (file) => {
    try {
      return await eventService.uploadImage(file);
    } catch (err) {
      console.error("Error uploading image:", err);
      throw err;
    }
  };

  return {
    events,
    loading,
    error,
    refresh: loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    uploadImage,
  };
};
