import { useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { publicService } from '../api/services/publicService';

const DEFAULT_REGION = {
  latitude: 41.1544,
  longitude: 1.2450,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export const useMapData = () => {
  const [data, setData] = useState({
    shops: [],
    pois: [],
    events: [],
    initialRegion: DEFAULT_REGION
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const toFiniteNumberOr = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const hasValidCoordinates = (item) => (
    Number.isFinite(Number(item?.latitude)) && Number.isFinite(Number(item?.longitude))
  );

  const loadMapData = async () => {
    try {
      setLoading(true);
      setError(false);
      const [config, shops, pois, events] = await Promise.all([
        publicService.getConfig(),
        publicService.getShops(),
        publicService.getPointsOfInterest(),
        publicService.getEvents()
      ]);

      setData({
        shops: shops.filter(hasValidCoordinates),
        pois: pois.filter(hasValidCoordinates),
        events: events.filter(hasValidCoordinates),
        initialRegion: {
          latitude: toFiniteNumberOr(config?.latitude, DEFAULT_REGION.latitude),
          longitude: toFiniteNumberOr(config?.longitude, DEFAULT_REGION.longitude),
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }
      });
    } catch (err) {
      console.error('Error loading map data');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMapData();
    }, [])
  );

  return useMemo(() => ({ 
    ...data, 
    loading, 
    error 
  }), [data, loading, error]);
};
