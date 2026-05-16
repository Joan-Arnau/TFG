import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { GridCard } from '../components/ui/GridCard';
import { ThemedCard } from '../components/ui/Card';
import { useDashboard } from '../hooks/useDashboard';
import { getCommonStyles } from '../styles/commonStyles';
import { getDashboardStyles } from '../styles/Dashboard.styles';

const DashboardScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getDashboardStyles(theme);
  
  const { featuredItem, loading } = useDashboard();

  const menuItems = [
    { id: 'news', title: t('dashboard.news'), icon: 'megaphone-outline' },
    { id: 'agenda', title: t('dashboard.agenda'), icon: 'calendar-outline' },
    { id: 'tourism', title: t('dashboard.tourism'), icon: 'map-outline' },
    { id: 'contact', title: t('dashboard.contact'), icon: 'call-outline' },
    { id: 'shops', title: t('dashboard.shops'), icon: 'storefront-outline', onPress: () => navigation.navigate('ShopDirectory') },
    { id: 'events', title: t('dashboard.events'), icon: 'ribbon-outline' },
  ];

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.welcome}>{t('app.welcome')}</Text>
        <Text style={styles.villageName}>PromoRural</Text>
      </View>

      <View style={styles.grid}>
        {menuItems.map((item) => (
          <GridCard
            key={item.id}
            title={item.title}
            icon={item.icon}
            color={theme.primaryColor}
            onPress={item.onPress}
          />
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="small" color={theme.primaryColor} />
      ) : featuredItem && (
        <ThemedCard style={styles.highlightCard}>
          <View style={styles.highlightBadge}>
            <Text style={styles.highlightBadgeText}>
              {featuredItem.isUrgent ? t('dashboard.featured') : t('dashboard.events')}
            </Text>
          </View>
          <Text style={styles.highlightTitle}>{featuredItem.title}</Text>
          <Text style={styles.highlightDate}>{featuredItem.subtitle}</Text>
        </ThemedCard>
      )}
    </ScrollView>
  );
};

export default DashboardScreen;
