import React from 'react';
import { View, Text, ActivityIndicator, TextInput, ScrollView, TouchableOpacity, FlatList, Image, Modal, StyleSheet } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { getCommonStyles } from '../styles/commonStyles';
import { getMapStyles } from '../styles/Map.styles';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../navigation/routes';
import { useTourismMapLogic } from '../hooks/useTourismMapLogic';

const TourismMapScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getMapStyles(theme);

  const {
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
    activeItem,
    markersFrozen,
  } = useTourismMapLogic(navigation, route);

  if (loading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={theme.primaryColor} />
      </View>
    );
  }

  const renderListItem = ({ item }) => {
    const imageUrl = item.mapType === 'shop' ? item.headerImageUrl : item.imageUrl;
    
    return (
      <TouchableOpacity 
        style={styles.listItem}
        onPress={() => {
          if (item.mapType === 'shop') {
            navigation.navigate(ROUTES.SHOP_DETAIL, { id: item.id });
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
              name={item.mapType === 'shop' ? 'cart' : 'location'} 
              size={20} 
              color={item.mapType === 'shop' ? theme.primaryColor : theme.secondaryColor} 
            />
          )}
        </View>
        <View style={styles.listItemContent}>
          <Text style={styles.listItemTitle}>{item.name}</Text>
          <Text style={styles.listItemSub}>{item.categoryName || t('dashboard.tourism')}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={styles.iconChevron} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={commonStyles.container}>
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
          onPress={() => setIsListVisible(!isListExpanded)}
        >
          <Ionicons 
            name="list" 
            size={24} 
            color={isListVisible ? "#FFF" : theme.primaryColor} 
          />
        </TouchableOpacity>
      </View>

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
          </ScrollView>
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
        onPress={() => setSelectedMarkerId(null)}
      >
        <UrlTile
          urlTemplate="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        {filteredData && filteredData.length > 0 && filteredData.map((item) => {
          const markerKey = `${item.mapType}-${item.id}`;
          return (
            <Marker
              key={markerKey}
              coordinate={{ latitude: item.latitude, longitude: item.longitude }}
              onPress={() => focusOnMarker(item)}
              tracksViewChanges={markersFrozen ? false : true}
            >
              <View style={item.mapType === 'shop' ? styles.shopMarker : styles.poiMarker}>
                <Ionicons name={item.mapType === 'shop' ? 'cart' : 'location'} size={20} color={styles.iconMarker} />
              </View>
            </Marker>
          );
        })}
      </MapView>

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
            data={filteredData}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}> 
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{activeItem?.name}</Text>
            <Text style={styles.modalDescription}>
              {activeItem?.mapType === 'shop' ? activeItem?.categoryName : activeItem?.description}
            </Text>
            
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity 
                style={[styles.btn, { backgroundColor: theme.primaryColor }]}
                onPress={() => {
                  setIsModalVisible(false);
                  if (activeItem?.mapType === 'shop') {
                    navigation.navigate(ROUTES.SHOP_DETAIL, { id: activeItem.id });
                  } else {
                    navigation.navigate(ROUTES.POI_DETAIL, { id: activeItem.id });
                  }
                }}
              >
                <Text style={styles.btnText}>
                  {activeItem?.mapType === 'shop' ? t('shop.detail') : t('poi.detail')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.btnCancel} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.btnCancelText}>{t('shop.close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TourismMapScreen;
