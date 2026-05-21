import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { getEventStyles } from '../../styles/Event.styles';
import { Ionicons } from '@expo/vector-icons';

export const EventCard = ({ item, onPress }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const styles = getEventStyles(theme);

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString(i18n.language, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventNow = (event) => {
    const now = new Date();
    const start = new Date(event.startsAt);
    const end = new Date(event.endsAt);
    return now >= start && now <= end;
  };

  const isNow = isEventNow(item);

  return (
    <TouchableOpacity 
      style={[styles.card, item.isFestival && styles.festivalCard]}
      onPress={onPress}
    >
      <View style={{ flexDirection: 'row' }}>
        {/* Event Image Thumbnail */}
        {item.imageUrl ? (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.cardImage, { backgroundColor: item.isFestival ? '#FFF9DB' : '#F1F3F5', justifyContent: 'center', alignItems: 'center' }]}>
            <Ionicons 
              name={item.isFestival ? "ribbon-outline" : "calendar-outline"} 
              size={24} 
              color={item.isFestival ? "#E59900" : "#CCC"} 
            />
          </View>
        )}

        <View style={{ flex: 1, marginLeft: 12 }}>
          {isNow && (
            <View style={styles.nowBadge}>
              <Ionicons name="time" size={12} color="#FFF" />
              <Text style={styles.nowText}>{t('event.now')}</Text>
            </View>
          )}
          
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={14} color={item.isFestival ? "#E59900" : "#868E96"} />
            <Text style={[styles.timeText, item.isFestival && { color: '#B45309', fontWeight: '500' }]}>
              {formatTime(item.startsAt)} - {formatTime(item.endsAt)}
            </Text>
          </View>

          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          
          {item.locationText ? (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color="#868E96" />
              <Text style={styles.locationText} numberOfLines={1}>{item.locationText}</Text>
            </View>
          ) : null}

          {item.isFestival && (
            <View style={[styles.categoryBadge, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A', borderWidth: 1 }]}>
              <Ionicons name="ribbon-outline" size={12} color="#D97706" />
              <Text style={[styles.categoryText, { color: '#D97706' }]}>{t('event.festival')}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
