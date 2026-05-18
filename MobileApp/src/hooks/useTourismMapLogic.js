import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { publicService, getTranslation } from '../api/services/publicService';
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

  useEffect(() => {
    setMarkersFrozen(false);
    const freezeTimer = setTimeout(() => {
      setMarkersFrozen(true);
    }, 350);
    return () => clearTimeout(freezeTimer);
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
        setSelectedMarkerId(`${route.params.centerOn.mapType}-${route.params.centerOn.id}`);
      }
    }
  }, [route.params?.centerOn]);

  const filteredData = useMemo(() => {
    const translatedShops = shops.map(s => ({
      ...s,
      name: getTranslation(s.name),
      description: getTranslation(s.description),
      categoryName: getTranslation(s.categoryName),
      mapType: 'shop'
    }));

    const translatedPois = pois.map(p => ({
      ...p,
      name: getTranslation(p.name),
      description: getTranslation(p.description),
      categoryName: getTranslation(p.categoryName),
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
      name: getTranslation(activeItem.name),
      description: getTranslation(activeItem.description),
      categoryName: getTranslation(activeItem.categoryName),
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
