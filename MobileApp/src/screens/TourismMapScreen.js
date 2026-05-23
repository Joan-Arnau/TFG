import { useState, useMemo, useRef } from 'react';
import { View, Text, ActivityIndicator, TextInput, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useMapData } from '../hooks/useMapData';
import { useLocation } from '../hooks/useLocation';
import { calculateDistance, formatDistance } from '../utils/locationUtils';
import { getCommonStyles } from '../styles/commonStyles';
import { getMapStyles } from '../styles/Map.styles';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../navigation/routes';
import OSMMap from '../components/ui/OSMMap';

const TourismMapScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getMapStyles(theme);
  const webViewRef = useRef(null);
  
  const { shops, pois, events, initialRegion, loading } = useMapData();
  const { location } = useLocation();
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); 
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false);
  const [isListExpanded, setIsListExpanded] = useState(false);

  const hasCoords = (item) => item?.latitude != null && item?.longitude != null;
  const safeDistance = (value) => (value == null ? Infinity : value);

  const baseData = useMemo(() => {
    return [
      ...shops.map(s => ({ ...s, mapType: 'shop' })),
      ...pois.map(p => ({ ...p, mapType: 'poi' })),
      ...events.map(e => ({ ...e, mapType: 'event' }))
    ];
  }, [shops, pois, events]);

  const filteredBase = useMemo(() => {
    let combined = [...baseData];

    if (filter === 'shop') combined = combined.filter(i => i.mapType === 'shop');
    if (filter === 'poi') combined = combined.filter(i => i.mapType === 'poi');
    if (filter === 'agenda') combined = combined.filter(i => i.mapType === 'event' && !i.isFestival);
    if (filter === 'festival') combined = combined.filter(i => i.mapType === 'event' && i.isFestival);

    if (search) {
      const lowerSearch = search.toLowerCase();
      combined = combined.filter(i =>
        i.name?.toLowerCase().includes(lowerSearch) ||
        (i.title && i.title.toLowerCase().includes(lowerSearch))
      );
    }

    return combined;
  }, [baseData, filter, search]);

  const listData = useMemo(() => {
    return filteredBase.map(item => {
      let distance = null;
      if (location && hasCoords(item)) {
        distance = calculateDistance(
          location.latitude, location.longitude,
          item.latitude, item.longitude
        );
      }
      return { ...item, distance };
    }).sort((a, b) => safeDistance(a.distance) - safeDistance(b.distance));
  }, [filteredBase, location]);

  const markers = useMemo(() => {
    return filteredBase.map(({ id, latitude, longitude, mapType, name, title, isFestival }) => ({
      id,
      latitude,
      longitude,
      mapType,
      name,
      title,
      isFestival
    }));
  }, [filteredBase]);

  const centerToMyPosition = () => {
    if (webViewRef.current) {
      const lat = location?.latitude || initialRegion.latitude;
      const lon = location?.longitude || initialRegion.longitude;
      webViewRef.current.injectJavaScript(`if(window.centerMap) window.centerMap(${lat}, ${lon}); true;`);
    }
  };

  const handleMarkerPress = (data) => {
    if (data.mapType === 'shop') {
      navigation.navigate(ROUTES.SHOP_DETAIL, { id: data.id });
    } else if (data.mapType === 'event') {
      navigation.navigate(ROUTES.EVENT_DETAIL, { event: data.item });
    } else {
      navigation.navigate(ROUTES.POI_DETAIL, { id: data.id });
    }
  };

  const closeSearch = () => {
    setIsSearchVisible(false);
    setSearch('');
    setFilter('all');
  };

  if (loading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={theme.primaryColor} />
      </View>
    );
  }

  const renderListItem = ({ item }) => {
    const imageUrl = item.mapType === 'shop' ? item.headerImageUrl : (item.imageUrl || null);
    const title = item.name || item.title;
    
    return (
      <TouchableOpacity 
        style={styles.listItem}
        onPress={() => {
          if (item.mapType === 'shop') {
            navigation.navigate(ROUTES.SHOP_DETAIL, { id: item.id });
          } else if (item.mapType === 'event') {
            navigation.navigate(ROUTES.EVENT_DETAIL, { event: item });
          } else {
            navigation.navigate(ROUTES.POI_DETAIL, { id: item.id });
          }
        }}
      >
        <View style={styles.listIconContainer}>
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={{ width: 40, height: 40 }} 
              resizeMode="cover"
            />
          ) : (
            <Ionicons 
              name={item.mapType === 'shop' ? 'cart' : (item.mapType === 'event' ? 'calendar' : 'location')} 
              size={20} 
              color={item.mapType === 'shop' ? theme.primaryColor : theme.secondaryColor} 
            />
          )}
        </View>
        <View style={styles.listItemContent}>
          <Text style={styles.listItemTitle}>{title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.listItemSub}>{item.categoryName || t('dashboard.tourism')}</Text>
            {item.distance !== null && (
              <Text style={[styles.listItemSub, { marginLeft: 10, fontWeight: 'bold', color: theme.primaryColor }]}>
                • {formatDistance(item.distance, t)}
              </Text>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={styles.iconChevron} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={commonStyles.container}>
      {/* Floating controls */}
      <View style={[styles.floatingControls, { top: isSearchVisible ? 120 : 10 }]}>
        <TouchableOpacity 
          style={styles.roundButton} 
          onPress={() => setIsSearchVisible(!isSearchVisible)}
        >
          <Ionicons 
            name={isSearchVisible ? "close" : "search"} 
            size={24} 
            color={theme.primaryColor} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.roundButton} 
          onPress={centerToMyPosition}
        >
          <Ionicons name="locate" size={24} color={theme.secondaryColor} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.roundButton, isListVisible && { backgroundColor: theme.primaryColor }]} 
          onPress={() => setIsListVisible(!isListVisible)}
        >
          <Ionicons 
            name="list" 
            size={24} 
            color={isListVisible ? "#FFF" : theme.primaryColor} 
          />
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      {isSearchVisible && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={styles.iconSearch} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('shop.search')}
              value={search}
              onChangeText={setSearch}
              autoFocus={true}
            />
            <TouchableOpacity onPress={closeSearch}>
              <Ionicons name="close-circle" size={24} color={styles.iconClose} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.filterScroll}
          >
            <TouchableOpacity 
              style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
              onPress={() => setFilter('all')}
            >
              <Ionicons 
                name="apps-outline" 
                size={16} 
                color={filter === 'all' ? styles.iconFilterActive : styles.iconFilterInactive} 
              />
              <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>{t('shop.categories.all')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterChip, filter === 'shop' && styles.filterChipActive]}
              onPress={() => setFilter('shop')}
            >
              <Ionicons 
                name="cart-outline" 
                size={16} 
                color={filter === 'shop' ? styles.iconFilterActive : styles.iconFilterInactive} 
              />
              <Text style={[styles.filterText, filter === 'shop' && styles.filterTextActive]}>{t('dashboard.shops')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterChip, filter === 'poi' && styles.filterChipActive]}
              onPress={() => setFilter('poi')}
            >
              <Ionicons 
                name="location-outline" 
                size={16} 
                color={filter === 'poi' ? styles.iconFilterActive : styles.iconFilterInactive} 
              />
              <Text style={[styles.filterText, filter === 'poi' && styles.filterTextActive]}>{t('dashboard.tourism')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterChip, filter === 'agenda' && styles.filterChipActive]}
              onPress={() => setFilter('agenda')}
            >
              <Ionicons 
                name="calendar-outline" 
                size={16} 
                color={filter === 'agenda' ? styles.iconFilterActive : styles.iconFilterInactive} 
              />
              <Text style={[styles.filterText, filter === 'agenda' && styles.filterTextActive]}>{t('dashboard.agenda')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.filterChip, filter === 'festival' && styles.filterChipActive]}
              onPress={() => setFilter('festival')}
            >
              <Ionicons 
                name="sparkles-outline" 
                size={16} 
                color={filter === 'festival' ? styles.iconFilterActive : styles.iconFilterInactive} 
              />
              <Text style={[styles.filterText, filter === 'festival' && styles.filterTextActive]}>{t('dashboard.events')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* OSM Map Component */}
      <OSMMap
        webViewRef={webViewRef}
        markers={markers}
        userLocation={location}
        initialRegion={initialRegion}
        onMarkerPress={handleMarkerPress}
        style={styles.map}
        theme={theme}
        detailLabel={t('app.details')}
        interactive={true}
      />

      {/* Expandable floating list */}
      {isListVisible && (
        <View style={[
          styles.bottomSheet, 
          { height: isListExpanded ? '70%' : '30%' }
        ]}>
          <TouchableOpacity 
            style={styles.sheetHandleContainer}
            onPress={() => setIsListExpanded(!isListExpanded)}
          >
            <View style={styles.sheetHandle} />
          </TouchableOpacity>
          
          <Text style={styles.sheetTitle}>
            {search || filter !== 'all' ? t('shop.search_results') : t('dashboard.tourism')}
          </Text>
          <FlatList
            data={listData}
            renderItem={renderListItem}
            keyExtractor={item => `${item.mapType}-${item.id}`}
            ListEmptyComponent={
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: '#999' }}>{t('shop.no_results')}</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
};

export default TourismMapScreen;
