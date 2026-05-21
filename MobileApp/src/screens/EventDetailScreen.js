import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import * as Calendar from 'expo-calendar';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { getEventStyles } from '../styles/Event.styles';
import { getCommonStyles } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '../components/ui/Button';
import { ROUTES } from '../navigation/routes';
import OSMMap from '../components/ui/OSMMap';

const EventDetailScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const styles = getEventStyles(theme);
  const commonStyles = getCommonStyles(theme);

  const requestCalendarPermissions = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      if (Platform.OS === 'ios') {
        const { status: remindStatus } = await Calendar.requestRemindersPermissionsAsync();
        return remindStatus === 'granted';
      }
      return true;
    }
    return false;
  };

  const getDefaultCalendarSource = async () => {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar.id;
  };

  const handleAddToCalendar = async () => {
    try {
      const hasPermissions = await requestCalendarPermissions();
      if (!hasPermissions) {
        Alert.alert('Error', 'Calendar permissions are required');
        return;
      }

      const calendarId = await getDefaultCalendarSource();
      
      await Calendar.createEventAsync(calendarId, {
        title: event.title,
        startDate: new Date(event.startsAt),
        endDate: new Date(event.endsAt),
        location: event.locationText,
        notes: event.description,
        timeZone: 'GMT',
      });

      Alert.alert('Success', 'Event added to your calendar!');
    } catch (error) {
      console.error('Error adding to calendar:', error);
      Alert.alert('Error', 'Could not add event to calendar');
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
        {event.isFestival && (
          <View style={styles.detailFestivalBadge}>
            <Ionicons name="sparkles" size={14} color="#FFF" />
            <Text style={styles.detailFestivalText}>{t('dashboard.events')}</Text>
          </View>
        )}

        <Text style={styles.detailTitle}>{event.title}</Text>

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
            icon="calendar-outline" 
            onPress={handleAddToCalendar}
            label={t('event.add_calendar')}
          />

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
          <View style={styles.mapContainer}>
            <OSMMap
              markers={[{
                id: event.id,
                latitude: event.latitude,
                longitude: event.longitude,
                name: event.title,
                mapType: 'event'
              }]}
              initialRegion={{
                latitude: event.latitude,
                longitude: event.longitude
              }}
              style={styles.map}
              theme={theme}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default EventDetailScreen;