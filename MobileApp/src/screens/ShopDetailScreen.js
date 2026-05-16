import React from 'react';
import { View, Text, Image, ScrollView, Linking, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '../components/ui/Button';
import { ThemedCard } from '../components/ui/Card';
import { useShopDetail } from '../hooks/useShopDetail';
import { getCommonStyles } from '../styles/commonStyles';
import { getShopDetailStyles } from '../styles/ShopDetail.styles';

const ShopDetailScreen = ({ route }) => {
  const { id } = route.params;
  const { t } = useTranslation();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getShopDetailStyles(theme);
  
  const { shop, loading, error } = useShopDetail(id);

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

  const handleCall = () => shop.phoneNumber && Linking.openURL(`tel:${shop.phoneNumber}`);
  const handleWhatsApp = () => shop.phoneNumber && Linking.openURL(`whatsapp://send?phone=${shop.phoneNumber}`);

  return (
    <ScrollView style={commonStyles.container}>
      <Image 
        source={{ uri: shop.headerImageUrl || 'https://via.placeholder.com/800x400' }} 
        style={styles.heroImage} 
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{shop.name}</Text>
        <Text style={styles.description}>{shop.description}</Text>

        <View style={styles.actionRow}>
          <IconButton icon="call" onPress={handleCall} disabled={!shop.phoneNumber} />
          <IconButton icon="logo-whatsapp" color="#25D366" onPress={handleWhatsApp} disabled={!shop.phoneNumber} />
          <IconButton icon="map" color={theme.secondaryColor} />
        </View>

        {shop.promotions && shop.promotions.length > 0 && (
          <View style={styles.section}>
            <Text style={commonStyles.sectionTitle}>{t('shop.promotions')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScroll}>
              {shop.promotions.map(promo => (
                <ThemedCard key={promo.id} style={styles.promoCard}>
                  <Text style={styles.promoTitle}>{promo.title}</Text>
                  <Text style={styles.promoDate}>{promo.endsAt}</Text>
                </ThemedCard>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <Text style={commonStyles.sectionTitle}>{t('shop.address')}</Text>
          <View style={styles.addressBox}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.addressText}>{shop.address}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ShopDetailScreen;
