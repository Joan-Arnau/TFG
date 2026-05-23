import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import * as Location from 'expo-location';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkPermissions = useCallback(async () => {
    setLoading(true);

    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setPermissionGranted(false);
      setLoading(false);
      return;
    }

    setPermissionGranted(true);
    try {
      // 1. Get last known position immediately (very fast)
      let lastLoc = await Location.getLastKnownPositionAsync({});
      if (lastLoc) {
        setLocation(lastLoc.coords);
      }

      // 2. Get fresh position in background (slower but more accurate)
      let freshLoc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(freshLoc.coords);
    } catch {
      console.warn('[useLocation] Error getting location');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        void checkPermissions();
      }
    });

    const timer = setTimeout(() => {
      void checkPermissions();
    }, 0);

    return () => {
      subscription.remove();
      clearTimeout(timer);
    };
  }, [checkPermissions]);

  return { location, permissionGranted, loading };
};
