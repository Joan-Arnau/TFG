import { useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/ui/Card';
import { useShops } from '../hooks/useShops';
import { useLocation } from '../hooks/useLocation';
import { calculateDistance, formatDistance } from '../utils/locationUtils';
import { getCommonStyles } from '../styles/commonStyles';
import { getShopDirectoryStyles } from '../styles/ShopDirectory.styles';
import { ROUTES } from '../navigation/routes';

const ShopDirectoryScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getShopDirectoryStyles(theme);
  
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const { shops, categories, loading, error, refetch } = useShops();
  const { location } = useLocation();

  const hasCoords = (item) => item?.latitude != null && item?.longitude != null;
  const safeDistance = (value) => (value == null ? Infinity : value);

  const shopsWithDistance = useMemo(() => {
    return shops.map(shop => {
      let distance = null;
      if (location && hasCoords(shop)) {
        distance = calculateDistance(
          location.latitude, location.longitude,
          shop.latitude, shop.longitude
        );
      }
      return { ...shop, distance };
    }).sort((a, b) => safeDistance(a.distance) - safeDistance(b.distance));
  }, [shops, location]);

  const filteredShops = shopsWithDistance.filter(shop => {
    const lowerCaseSearch = search.toLowerCase();
    const matchesSearch = shop.name.toLowerCase().includes(lowerCaseSearch) ||
                          shop.description.toLowerCase().includes(lowerCaseSearch) ||
                          shop.categoryName.toLowerCase().includes(lowerCaseSearch);
    const matchesCategory = activeCategory === 'all' || shop.categoryId === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const renderShopItem = ({ item }) => (
    <Card 
      style={styles.shopCard} 
      onPress={() => navigation.navigate(ROUTES.SHOP_DETAIL, { id: item.id })}
    >
      {item.headerImageUrl ? (
        <Image
          source={{ uri: item.headerImageUrl }}
          style={styles.shopImage}
        />
      ) : (
        <View style={[styles.shopImage, styles.shopImagePlaceholder]}>
          <Ionicons name="image-outline" size={32} color="#94A3B8" />
        </View>
      )}
      <View style={styles.shopInfo}>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.shopCategory}>
            {item.categoryName}
          </Text>
        </View>
        <View style={styles.distanceBadge}>
          <Ionicons name="location" size={12} color={theme.primaryColor} />
          <Text style={styles.distanceText}>
            {item.distance !== null ? formatDistance(item.distance, t) : '---'}
          </Text>
        </View>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={theme.primaryColor} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={commonStyles.centered}>
        <Ionicons name="cloud-offline-outline" size={48} color="#CCC" />
        <Text style={commonStyles.errorText}>{t('shop.error_loading')}</Text>
        <TouchableOpacity 
          style={commonStyles.retryButton}
          onPress={refetch}
        >
          <Text style={commonStyles.retryButtonText}>Tornar a provar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('shop.search')}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              style={[
                styles.categoryItem,
                activeCategory === cat.id && styles.categoryItemActive
              ]}
            >
              <Ionicons 
                name={cat.icon || 'apps-outline'} 
                size={18} 
                color={activeCategory === cat.id ? '#FFF' : '#666'} 
              />
              <Text style={[
                styles.categoryLabel,
                activeCategory === cat.id && styles.categoryLabelActive
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredShops}
        renderItem={renderShopItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t('shop.no_results')}</Text>
          </View>
        }
      />
    </View>
  );
};

export default ShopDirectoryScreen;
