import { useMemo } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from '../hooks/useLocation';
import { calculateDistance, formatDistance } from '../utils/locationUtils';
import { getEventStyles } from '../styles/Event.styles';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '../components/ui/Button';
import { ROUTES } from '../navigation/routes';
import OSMMap from '../components/ui/OSMMap';

const EventDetailScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const styles = getEventStyles(theme);
  const { location } = useLocation();

  const distance = useMemo(() => {
    if (location && event?.latitude && event?.longitude) {
      return calculateDistance(
        location.latitude, location.longitude,
        event.latitude, event.longitude
      );
    }
    return null;
  }, [location, event]);

  const eventMarkers = useMemo(() => {
    if (!event) return [];
    return [{
      id: event.id,
      latitude: event.latitude,
      longitude: event.longitude,
      title: event.title,
      mapType: 'event',
      isFestival: event.isFestival
    }];
  }, [event]);



  const formatEventDates = (startsAt, endsAt) => {
    if (!startsAt) return '';
    const startDateObj = new Date(startsAt);
    const startStr = startDateObj.toLocaleDateString(i18n.language === 'ca' ? 'ca-ES' : i18n.language, { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric'
    });
    
    if (!endsAt) return startStr;
    
    const endDateObj = new Date(endsAt);
    const endStr = endDateObj.toLocaleDateString(i18n.language === 'ca' ? 'ca-ES' : i18n.language, { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric'
    });
    
    if (startDateObj.toDateString() === endDateObj.toDateString()) {
      return startStr;
    }
    
    return `${startStr} - ${endStr}`;
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString(i18n.language, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ScrollView style={styles.detailContainer}>
      {event.imageUrl && (
        <Image source={{ uri: event.imageUrl }} style={styles.detailImage} />
      )}
      
      <View style={styles.detailContent}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
          {event.categoryName ? (
            <View style={[styles.categoryBadge, { marginTop: 0, marginRight: 8, paddingVertical: 4, paddingHorizontal: 10 }]}>
              <Ionicons name="pricetag-outline" size={12} color="#495057" />
              <Text style={styles.categoryText}>{event.categoryName}</Text>
            </View>
          ) : null}

          {event.isFestival ? (
            <View style={[styles.categoryBadge, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A', borderWidth: 1, marginTop: 0, paddingVertical: 4, paddingHorizontal: 10 }]}>
              <Ionicons name="ribbon-outline" size={12} color="#D97706" />
              <Text style={[styles.categoryText, { color: '#D97706' }]}>{t('event.festival')}</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.detailTitle}>{event.title}</Text>

        <View style={styles.detailDateRow}>
          <Ionicons name="calendar-outline" size={18} color={theme.primaryColor} />
          <Text style={styles.detailDateText}>{formatEventDates(event.startsAt, event.endsAt)}</Text>
        </View>

        <View style={styles.detailDateRow}>
          <Ionicons name="time-outline" size={18} color={theme.primaryColor} />
          <Text style={styles.detailDateText}>
            {formatTime(event.startsAt)} - {formatTime(event.endsAt)}
          </Text>
        </View>

        {event.locationText && (
          <View style={styles.detailLocationRow}>
            <Ionicons name="location-outline" size={18} color={theme.primaryColor} />
            <Text style={styles.detailLocationText}>{event.locationText}</Text>
          </View>
        )}

        <Text style={styles.detailSectionTitle}>{t('event.description')}</Text>
        <Text style={styles.detailDescription}>{event.description}</Text>

        <View style={styles.detailActions}>
          <IconButton 
            icon="map-outline" 
            color={theme.secondaryColor} 
            onPress={() => navigation.navigate(ROUTES.TOURISM_MAP, { 
              centerOn: { latitude: event.latitude, longitude: event.longitude } 
            })}
            label={t('event.open_map')}
          />
        </View>

        {event.latitude && event.longitude && (
          <View>
            {distance !== null && (
              <Text style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold', color: theme.primaryColor }}>
                {t('shop.distance')}: {formatDistance(distance, t)}
              </Text>
            )}
            <View style={styles.mapContainer}>
              <OSMMap
                markers={eventMarkers}
                center={{
                  latitude: event.latitude,
                  longitude: event.longitude
                }}
                style={styles.map}
                theme={theme}
                interactive={false}
              />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default EventDetailScreen;
