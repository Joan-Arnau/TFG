import React from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '../components/ui/Button';
import { usePointOfInterestDetail } from '../hooks/usePointOfInterestDetail';
import { getCommonStyles } from '../styles/commonStyles';
import { getShopDetailStyles } from '../styles/ShopDetail.styles';
import { ROUTES } from '../navigation/routes';
import { getTranslation } from '../api/services/publicService'; // New import

const PointOfInterestDetailScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const { t } = useTranslation();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getShopDetailStyles(theme);
  
  const { poi, loading, error } = usePointOfInterestDetail(id);

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
    <View style={commonStyles.container}>
      <ScrollView style={{ flex: 1 }}>
        <Image 
          source={{ uri: poi.imageUrl || 'https://via.placeholder.com/800x400' }} 
          style={styles.heroImage} 
        />
        
        <View style={styles.infoContainer}>
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.name}>{getTranslation(poi.name)}</Text>
            <View style={{ backgroundColor: theme.secondaryColor, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 5 }}>
              <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>{getTranslation(poi.categoryName)}</Text>
            </View>
          </View>
          
          <Text style={styles.description}>{getTranslation(poi.description)}</Text>

          <View style={styles.actionRow}>
            <IconButton 
              icon="map" 
              color={theme.secondaryColor} 
              onPress={() => navigation.navigate(ROUTES.TOURISM_MAP, { 
                centerOn: { latitude: poi.latitude, longitude: poi.longitude } 
              })}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PointOfInterestDetailScreen;
