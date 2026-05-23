import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getTranslation } from '../api/services/publicService';
import { useMapData } from './useMapData';

export const useTourismMapLogic = (navigation, route) => {
  const { i18n } = useTranslation();
  const mapRef = useRef(null);
  
  const { shops, pois, initialRegion, loading } = useMapData();
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); 
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false);
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [markersFrozen, setMarkersFrozen] = useState(false);

  const filteredData = useMemo(() => {
    const translatedShops = shops.map(s => ({
      ...s,
      name: getTranslation(s.name, i18n.language),
      description: getTranslation(s.description, i18n.language),
      categoryName: getTranslation(s.categoryName, i18n.language),
      mapType: 'shop'
    }));

    const translatedPois = pois.map(p => ({
      ...p,
      name: getTranslation(p.name, i18n.language),
      description: getTranslation(p.description, i18n.language),
      categoryName: getTranslation(p.categoryName, i18n.language),
      mapType: 'poi'
    }));

    let combined = [...translatedShops, ...translatedPois];

    if (filter === 'shop') combined = combined.filter(i => i.mapType === 'shop');
    if (filter === 'poi') combined = combined.filter(i => i.mapType === 'poi');

    if (search) {
      const lowerCaseSearch = search.toLowerCase();
      combined = combined.filter(i => 
        i.name.toLowerCase().includes(lowerCaseSearch) ||
        i.description.toLowerCase().includes(lowerCaseSearch) ||
        i.categoryName.toLowerCase().includes(lowerCaseSearch)
      );
    }

    return combined;
  }, [shops, pois, filter, search, i18n.language]);

  useEffect(() => {
    let timeoutId;
    Promise.resolve().then(() => {
      setMarkersFrozen(false);
      timeoutId = setTimeout(() => {
        setMarkersFrozen(true);
      }, 350);
    });
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [filteredData]);

  useEffect(() => {
    if (route.params?.centerOn && mapRef.current) {
      const { latitude, longitude } = route.params.centerOn;
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);

      if (route.params.centerOn.id && route.params.centerOn.mapType) {
        Promise.resolve().then(() => {
          setSelectedMarkerId(`${route.params.centerOn.mapType}-${route.params.centerOn.id}`);
        });
      }
    }
  }, [route.params?.centerOn]);

  const centerToMyPosition = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 1000);
    }
  };

  const focusOnMarker = (item) => {
    setSelectedMarkerId(`${item.mapType}-${item.id}`);
    setActiveItem(item);

    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: item.latitude,
        longitude: item.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 400);
    }

    setIsModalVisible(true);
  };

  const closeSearch = () => {
    setIsSearchVisible(false);
    setSearch('');
    setFilter('all');
  };

  const translatedActiveItem = useMemo(() => {
    if (!activeItem) return null;
    return {
      ...activeItem,
      name: getTranslation(activeItem.name, i18n.language),
      description: getTranslation(activeItem.description, i18n.language),
      categoryName: getTranslation(activeItem.categoryName, i18n.language),
    };
  }, [activeItem, i18n.language]);

  return {
    mapRef,
    shops,
    pois,
    initialRegion,
    loading,
    search,
    setSearch,
    filter,
    setFilter,
    isSearchVisible,
    setIsSearchVisible,
    isListVisible,
    setIsListVisible,
    isListExpanded,
    setIsListExpanded,
    selectedMarkerId,
    setSelectedMarkerId,
    filteredData,
    centerToMyPosition,
    focusOnMarker,
    closeSearch,
    isModalVisible,
    setIsModalVisible,
    activeItem: translatedActiveItem,
    setActiveItem,
    markersFrozen,
  };
};
