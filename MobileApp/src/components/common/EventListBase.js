import { useState, useMemo } from 'react';
import { View, Text, SectionList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useEvents } from '../../hooks/useEvents';
import { getCommonStyles } from '../../styles/commonStyles';
import { getEventStyles } from '../../styles/Event.styles';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../../navigation/routes';
import EventCard from '../ui/EventCard';

export const EventListBase = ({ navigation, isFestivalOnly }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getEventStyles(theme);
  
  const [activeCategory, setActiveCategory] = useState('all');
  const { events, categories, loading, refetch, filterEvents, groupEventsByDate } = useEvents();

  const formatSectionHeader = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return t('event.today');
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return t('event.tomorrow');
    }
    return date.toLocaleDateString(i18n.language === 'ca' ? 'ca-ES' : i18n.language, {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  // Filter events by type (festival or ordinary) and category
  const filteredEvents = useMemo(() => {
    const subset = events.filter(e => isFestivalOnly ? e.isFestival : !e.isFestival);
    return filterEvents(subset, activeCategory);
  }, [events, activeCategory, filterEvents, isFestivalOnly]);

  const sections = useMemo(() => {
    return groupEventsByDate(filteredEvents);
  }, [filteredEvents, groupEventsByDate]);

  const renderSectionHeader = ({ section }) => {
    if (isFestivalOnly) {
      return (
        <View style={[styles.sectionHeader, { backgroundColor: theme.secondaryColor }]}>
          <Text style={[styles.sectionHeaderText, { color: theme.primaryColor }]}>
            <Ionicons name="sparkles" size={16} color={theme.primaryColor} /> {formatSectionHeader(section.data[0]?.startsAt)}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>
          {formatSectionHeader(section.data[0]?.startsAt)}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <EventCard
      item={item}
      onPress={() => navigation.navigate(ROUTES.EVENT_DETAIL, { event: item })}
    />
  );

  if (loading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={theme.primaryColor} />
      </View>
    );
  }

  // Differentiated category chip colors when active
  const activeChipStyle = isFestivalOnly 
    ? [styles.filterChipActive, { backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }]
    : styles.filterChipActive;

  return (
    <View style={[styles.container, isFestivalOnly && { backgroundColor: theme.secondaryColor }]}>
      {/* Category Chips */}
      <View style={[styles.header, isFestivalOnly && { borderBottomColor: theme.secondaryColor }]}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity 
            style={[styles.filterChip, activeCategory === 'all' && activeChipStyle]}
            onPress={() => setActiveCategory('all')}
          >
            <Text style={[styles.filterText, activeCategory === 'all' && styles.filterTextActive]}>
              {t('event.all_categories')}
            </Text>
          </TouchableOpacity>
          
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat.id}
              style={[styles.filterChip, activeCategory === cat.name && activeChipStyle]}
              onPress={() => setActiveCategory(cat.name)}
            >
              <Text style={[styles.filterText, activeCategory === cat.name && styles.filterTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={loading}
        ListEmptyComponent={
          isFestivalOnly ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="ribbon-outline" size={48} color={theme.primaryColor} />
              <Text style={[styles.emptyText, { color: theme.primaryColor }]}>
                {t('event.no_festivals')}
              </Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color={theme.secondaryColor} />
              <Text style={styles.emptyText}>
                {t('event.no_agenda')}
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};

export default EventListBase;
