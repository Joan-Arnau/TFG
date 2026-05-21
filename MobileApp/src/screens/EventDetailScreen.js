import { View, Text, ScrollView, TouchableOpacity, Linking, Image, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { getEventStyles } from '../styles/Event.styles';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const EventDetailScreen = ({ route }) => {
  const { event } = route.params;
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const styles = getEventStyles(theme);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'ca' ? 'ca-ES' : i18n.language, { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString(i18n.language, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openMap = () => {
    if (event.latitude && event.longitude) {
      const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
      const latLng = `${event.latitude},${event.longitude}`;
      const label = event.locationText || event.title;
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
      });
      if (url) {
        Linking.openURL(url);
      }
    }
  };

  const shareEvent = async () => {
    try {
      const { Share } = require('react-native');
      await Share.share({
        message: `${event.title}\n\n${event.description}\n\n${event.locationText ? event.locationText + '\n' : ''}${formatDate(event.startsAt)} ${formatTime(event.startsAt)} - ${formatTime(event.endsAt)}`,
        title: event.title,
      });
    } catch (error) {
      console.error('Error sharing event:', error);
    }
  };

  const addToCalendar = () => {
    // This would use expo-calendar or a native module
    // For now, open a Google Calendar event creation URL
    const startDate = new Date(event.startsAt);
    const endDate = new Date(event.endsAt);
    
    const formatGoogleDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.locationText || '')}`;
    
    Linking.openURL(googleUrl).catch(() => {
      // Fallback: just show the date info
      console.log('Calendar URL not available');
    });
  };

  return (
    <ScrollView style={styles.detailContainer}>
      {/* Event Image */}
      {event.imageUrl ? (
        <Image source={{ uri: event.imageUrl }} style={styles.detailImage} />
      ) : (
        <View style={[styles.detailImage, { backgroundColor: '#F1F3F5', justifyContent: 'center', alignItems: 'center' }]}>
          <Ionicons name="calendar-outline" size={48} color="#CCC" />
        </View>
      )}

      <View style={styles.detailContent}>
        {/* Festival Badge */}
        {event.isFestival && (
          <View style={styles.detailFestivalBadge}>
            <Ionicons name="ribbon-outline" size={16} color="#FFF" />
            <Text style={styles.detailFestivalText}>{t('event.festival_program')}</Text>
          </View>
        )}

        {/* Title */}
        <Text style={styles.detailTitle}>{event.title}</Text>

        {/* Date & Time */}
        <View style={styles.detailDateRow}>
          <Ionicons name="calendar-outline" size={18} color={theme.primaryColor} />
          <Text style={styles.detailDateText}>{formatDate(event.startsAt)}</Text>
        </View>
        <View style={styles.detailDateRow}>
          <Ionicons name="time-outline" size={18} color={theme.primaryColor} />
          <Text style={styles.detailDateText}>
            {formatTime(event.startsAt)} - {formatTime(event.endsAt)}
          </Text>
        </View>

        {/* Location */}
        {event.locationText && (
          <View style={styles.detailLocationRow}>
            <Ionicons name="location-outline" size={18} color={theme.primaryColor} />
            <Text style={styles.detailLocationText}>{event.locationText}</Text>
          </View>
        )}

        {/* Map */}
        {event.latitude && event.longitude && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: event.latitude,
                longitude: event.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: event.latitude,
                  longitude: event.longitude,
                }}
                title={event.title}
                description={event.locationText}
              />
            </MapView>
          </View>
        )}

        {/* Description */}
        <Text style={styles.detailSectionTitle}>{t('event.description')}</Text>
        <Text style={styles.detailDescription}>{event.description}</Text>

        {/* Actions */}
        <View style={styles.detailActions}>
          {event.latitude && event.longitude && (
            <TouchableOpacity style={styles.actionButton} onPress={openMap}>
              <Ionicons name="map-outline" size={24} color={theme.primaryColor} />
              <Text style={styles.actionText}>{t('event.open_map')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={shareEvent}>
            <Ionicons name="share-outline" size={24} color={theme.primaryColor} />
            <Text style={styles.actionText}>{t('event.share')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={addToCalendar}>
            <Ionicons name="calendar-outline" size={24} color={theme.primaryColor} />
            <Text style={styles.actionText}>{t('event.add_calendar')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default EventDetailScreen;