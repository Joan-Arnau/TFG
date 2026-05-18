import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { getAnnouncementStyles } from '../styles/Announcement.styles';
import { Ionicons } from '@expo/vector-icons';

const AnnouncementDetailScreen = ({ route }) => {
  const { announcement } = route.params;
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = getAnnouncementStyles(theme);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ScrollView style={styles.detailContainer}>
      <View style={styles.detailHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          {announcement.urgent ? (
            <View style={styles.urgentBadge}>
              <Ionicons name="notifications" size={14} color="#FFF" />
              <Text style={styles.urgentText}>{t('announcement.urgent')}</Text>
            </View>
          ) : (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{announcement.categoryName}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.detailTitle}>{announcement.title}</Text>
        
        <View style={styles.detailDateRow}>
          <Ionicons name="calendar-outline" size={16} color="#868E96" />
          <Text style={[styles.dateText, { marginLeft: 6 }]}>
            {t('announcement.published_at')} {formatDate(announcement.publishedAt)}
          </Text>
        </View>
      </View>

      <View style={styles.detailContent}>
        <Text style={styles.detailBody}>{announcement.content}</Text>
      </View>
    </ScrollView>
  );
};

export default AnnouncementDetailScreen;