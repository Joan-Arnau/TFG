import { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { getCommonStyles } from '../styles/commonStyles';
import { getAnnouncementStyles } from '../styles/Announcement.styles';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../navigation/routes';

const AnnouncementListScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getAnnouncementStyles(theme);
  
  const [activeCategory, setActiveCategory] = useState('all');
  const { announcements, categories, loading, refetch } = useAnnouncements();

  const filteredAnnouncements = useMemo(() => {
    if (activeCategory === 'all') return announcements;
    return announcements.filter(item => item.categoryName === activeCategory);
  }, [announcements, activeCategory]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, item.urgent && styles.urgentCard]}
      onPress={() => navigation.navigate(ROUTES.ANNOUNCEMENT_DETAIL, { announcement: item })}
    >
      <View style={styles.cardHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {item.urgent && (
            <View style={styles.urgentBadge}>
              <Ionicons name="notifications" size={12} color="#FFF" />
              <Text style={styles.urgentText}>{t('announcement.urgent')}</Text>
            </View>
          )}
          {!item.urgent && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.categoryName}</Text>
            </View>
          )}
        </View>
        <Text style={styles.dateText}>{formatDate(item.publishedAt)}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.contentPreview} numberOfLines={3}>{item.content}</Text>
      
      <View style={styles.readMoreContainer}>
        <Text style={styles.readMoreText}>{t('announcement.read_more')}</Text>
        <Ionicons name="arrow-forward" size={16} color={theme.primaryColor} />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={theme.primaryColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity 
            style={[styles.filterChip, activeCategory === 'all' && styles.filterChipActive]}
            onPress={() => setActiveCategory('all')}
          >
            <Text style={[styles.filterText, activeCategory === 'all' && styles.filterTextActive]}>
              {t('shop.categories.all')}
            </Text>
          </TouchableOpacity>
          
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat.id}
              style={[styles.filterChip, activeCategory === cat.name && styles.filterChipActive]}
              onPress={() => setActiveCategory(cat.name)}
            >
              <Text style={[styles.filterText, activeCategory === cat.name && styles.filterTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredAnnouncements}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={loading}
        ListEmptyComponent={
          <View style={commonStyles.centered}>
            <Ionicons name="newspaper-outline" size={48} color="#CCC" />
            <Text style={{ marginTop: 10, color: '#999' }}>{t('announcement.no_announcements')}</Text>
          </View>
        }
      />
    </View>
  );
};

export default AnnouncementListScreen;
