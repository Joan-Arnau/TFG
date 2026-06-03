import { useMemo } from 'react';
import { View, Text, Image, ScrollView, Linking, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useShopDetail } from '../hooks/useShopDetail';
import { useLocation } from '../hooks/useLocation';
import { calculateDistance, formatDistance } from '../utils/locationUtils';
import { getCommonStyles } from '../styles/commonStyles';
import { getShopDetailStyles } from '../styles/ShopDetail.styles';
import { ROUTES } from '../navigation/routes';
import OSMMap from '../components/ui/OSMMap';

const ShopDetailScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getShopDetailStyles(theme);
  
  const { shop, loading, error } = useShopDetail(id);
  const { location } = useLocation();

  const distance = useMemo(() => {
    if (location && shop?.latitude && shop?.longitude) {
      return calculateDistance(
        location.latitude, location.longitude,
        shop.latitude, shop.longitude
      );
    }
    return null;
  }, [location, shop]);

  // Memoize markers to prevent OSMMap from reloading when location updates
  const shopMarkers = useMemo(() => {
    if (!shop) return [];
    return [{
      id: shop.id,
      latitude: shop.latitude,
      longitude: shop.longitude,
      name: shop.name,
      mapType: 'shop'
    }];
  }, [shop]);

  const handleCall = () => {
    if (shop.phoneNumber) {
      Linking.openURL(`tel:${shop.phoneNumber}`);
    }
  };

  const handleWhatsApp = () => {
    if (shop.phoneNumber) {
      const cleanPhone = shop.phoneNumber.replace(/\s+/g, '');
      Linking.openURL(`whatsapp://send?phone=${cleanPhone}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'ca' ? 'ca-ES' : i18n.language, { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={theme.primaryColor} />
      </View>
    );
  }

  if (error || !shop) {
    return (
      <View style={commonStyles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color="#CCC" />
        <Text style={commonStyles.errorText}>{t('shop.not_found')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.container}>
      {shop.headerImageUrl ? (
        <Image
          source={{ uri: shop.headerImageUrl }}
          style={styles.heroImage}
        />
      ) : (
        <View style={[styles.heroImage, styles.heroImagePlaceholder]}>
          <Ionicons name="image-outline" size={48} color="#94A3B8" />
        </View>
      )}
      
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{shop.name}</Text>
          <View style={{ backgroundColor: theme.secondaryColor, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15 }}>
            <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>{shop.categoryName}</Text>
          </View>
        </View>
        
        <Text style={styles.description}>{shop.description}</Text>

        {shop.images && shop.images.length > 0 && (
          <View style={styles.section}>
            <Text style={commonStyles.sectionTitle}>{t('shop.gallery')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
              {shop.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.galleryImage} />
              ))}
            </ScrollView>
          </View>
        )}

        {shop.promotions && shop.promotions.length > 0 && (
          <View style={styles.section}>
            <Text style={commonStyles.sectionTitle}>{t('shop.promotions')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScroll}>
              {shop.promotions.map((promo) => (
                <Card key={promo.id} style={styles.promoCard}>
                  {promo.imageUrl ? (
                    <Image source={{ uri: promo.imageUrl }} style={styles.promoImage} />
                  ) : null}
                  <Text style={styles.promoTitle} numberOfLines={2}>{promo.title}</Text>
                  {promo.description ? (
                    <Text style={styles.promoDescription} numberOfLines={3}>{promo.description}</Text>
                  ) : null}
                  <Text style={styles.promoDate}>
                    {t('shop.valid_until')} {formatDate(promo.endsAt)}
                  </Text>
                </Card>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.actionRow}>
          <IconButton icon="call" onPress={handleCall} disabled={!shop.phoneNumber} />
          <IconButton icon="logo-whatsapp" color="#25D366" onPress={handleWhatsApp} disabled={!shop.phoneNumber} />
          <IconButton 
            icon="map-outline" 
            color={theme.secondaryColor} 
            onPress={() => navigation.navigate(ROUTES.TOURISM_MAP, { 
              centerOn: { latitude: shop.latitude, longitude: shop.longitude } 
            })}
          />
        </View>

        <View style={styles.section}>
          <Text style={commonStyles.sectionTitle}>{t('shop.address')}</Text>
          <View style={styles.addressBox}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.addressText}>{shop.address}</Text>
          </View>
          {distance !== null && (
            <Text style={{ marginTop: 5, fontWeight: 'bold', color: theme.primaryColor }}>
              {t('shop.distance')}: {formatDistance(distance, t)}
            </Text>
          )}
          
          <View style={styles.mapContainer}>
            <OSMMap
              markers={shopMarkers}
              center={{
                latitude: shop.latitude,
                longitude: shop.longitude
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

export default ShopDetailScreen;
