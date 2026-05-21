import React from 'react';
import { View, Text, Image, ScrollView, Linking, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useShopDetail } from '../hooks/useShopDetail';
import { getCommonStyles } from '../styles/commonStyles';
import { getShopDetailStyles } from '../styles/ShopDetail.styles';
import { ROUTES } from '../navigation/routes';
import OSMMap from '../components/ui/OSMMap';

const ShopDetailScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const { t } = useTranslation();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getShopDetailStyles(theme);
  
  const { shop, loading, error } = useShopDetail(id);

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
      <Image 
        source={{ uri: shop.headerImageUrl || 'https://via.placeholder.com/800x400' }} 
        style={styles.heroImage} 
      />
      
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{shop.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{shop.categoryName}</Text>
          </View>
        </View>
        
        <Text style={styles.description}>{shop.description}</Text>

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

        {shop.promotions && shop.promotions.length > 0 && (
          <View style={styles.section}>
            <Text style={commonStyles.sectionTitle}>{t('shop.promotions')}</Text>
            {shop.promotions.map(promo => (
              <Card key={promo.id} style={styles.promoCard}>
                <Image source={{ uri: promo.imageUrl }} style={styles.promoImage} />
                <View style={styles.promoContent}>
                  <Text style={styles.promoTitle}>{promo.title}</Text>
                  <Text style={styles.promoDescription}>{promo.description}</Text>
                </View>
              </Card>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={commonStyles.sectionTitle}>{t('shop.gallery')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
            {shop.images && shop.images.length > 0 ? (
              shop.images.map((img, index) => (
                <Image key={index} source={{ uri: img }} style={styles.galleryImage} />
              ))
            ) : (
              <View style={styles.emptyGallery}>
                <Ionicons name="images-outline" size={32} color="#CCC" />
                <Text style={styles.emptyGalleryText}>No images available</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={commonStyles.sectionTitle}>{t('shop.address')}</Text>
          <View style={styles.addressBox}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.addressText}>{shop.address}</Text>
          </View>
          
          <View style={styles.mapContainer}>
            <OSMMap
              markers={[{
                id: shop.id,
                latitude: shop.latitude,
                longitude: shop.longitude,
                name: shop.name,
                mapType: 'shop'
              }]}
              initialRegion={{
                latitude: shop.latitude,
                longitude: shop.longitude
              }}
              style={styles.map}
              theme={theme}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ShopDetailScreen;