import { useMemo } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '../components/ui/Button';
import { usePointOfInterestDetail } from '../hooks/usePointOfInterestDetail';
import { useLocation } from '../hooks/useLocation';
import { calculateDistance, formatDistance } from '../utils/locationUtils';
import { getCommonStyles } from '../styles/commonStyles';
import { getShopDetailStyles } from '../styles/ShopDetail.styles';
import { ROUTES } from '../navigation/routes';
import OSMMap from '../components/ui/OSMMap';

const PointOfInterestDetailScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const { t } = useTranslation();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getShopDetailStyles(theme);
  
  const { poi, loading, error } = usePointOfInterestDetail(id);
  const { location } = useLocation();

  const distance = useMemo(() => {
    if (location && poi?.latitude && poi?.longitude) {
      return calculateDistance(
        location.latitude, location.longitude,
        poi.latitude, poi.longitude
      );
    }
    return null;
  }, [location, poi]);

  const poiMarkers = useMemo(() => {
    if (!poi) return [];
    return [{
      id: poi.id,
      latitude: poi.latitude,
      longitude: poi.longitude,
      name: poi.name,
      mapType: 'poi'
    }];
  }, [poi]);

  if (loading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={theme.primaryColor} />
      </View>
    );
  }

  if (error || !poi) {
    return (
      <View style={commonStyles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color="#CCC" />
        <Text style={commonStyles.errorText}>{t('shop.not_found')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.container}>
      {poi.imageUrl ? (
        <Image
          source={{ uri: poi.imageUrl }}
          style={styles.heroImage}
        />
      ) : (
        <View style={[styles.heroImage, styles.heroImagePlaceholder]}>
          <Ionicons name="image-outline" size={48} color="#94A3B8" />
        </View>
      )}
      
      <View style={styles.infoContainer}>
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.name}>{poi.name}</Text>
          <View style={{ backgroundColor: theme.secondaryColor, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 5 }}>
            <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>{poi.categoryName}</Text>
          </View>
        </View>
        
        <Text style={styles.description}>{poi.description}</Text>

        <View style={styles.actionRow}>
          <IconButton 
            icon="map-outline" 
            color={theme.secondaryColor} 
            onPress={() => navigation.navigate(ROUTES.TOURISM_MAP, { 
              centerOn: { latitude: poi.latitude, longitude: poi.longitude } 
            })}
          />
        </View>

        <View style={styles.section}>
          {distance !== null && (
            <Text style={{ marginTop: 5, fontWeight: 'bold', color: theme.primaryColor }}>
              {t('shop.distance')}: {formatDistance(distance, t)}
            </Text>
          )}
          
          <View style={styles.mapContainer}>
            <OSMMap
              markers={poiMarkers}
              center={{
                latitude: poi.latitude,
                longitude: poi.longitude
              }}
              style={styles.map}
              theme={theme}
              interactive={false}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default PointOfInterestDetailScreen;
