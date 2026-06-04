import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { GridCard } from '../components/ui/GridCard';
import { ThemedCard } from '../components/ui/Card';
import { useDashboard } from '../hooks/useDashboard';
import { getDashboardStyles } from '../styles/Dashboard.styles';
import { ROUTES } from '../navigation/routes';

const DASHBOARD_ACCENT = '#35524A';

const DashboardScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = getDashboardStyles();
  
  const { featuredItem, loading } = useDashboard();

  const menuItems = [
    { id: 'news', title: t('dashboard.news'), icon: 'megaphone-outline', onPress: () => navigation.navigate(ROUTES.ANNOUNCEMENTS) },
    { id: 'agenda', title: t('dashboard.agenda'), icon: 'calendar-outline', onPress: () => navigation.navigate(ROUTES.AGENDA) },
    { id: 'tourism', title: t('dashboard.tourism'), icon: 'map-outline', onPress: () => navigation.navigate(ROUTES.TOURISM_MAP) },
    { id: 'contact', title: t('dashboard.contact'), icon: 'call-outline', onPress: () => navigation.navigate(ROUTES.CONTACTS) },
    { id: 'shops', title: t('dashboard.shops'), icon: 'storefront-outline', onPress: () => navigation.navigate(ROUTES.SHOP_DIRECTORY) },
    { id: 'events', title: t('dashboard.events'), icon: 'sparkles-outline', onPress: () => navigation.navigate(ROUTES.FESTIVALS) },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>


      {loading ? (
        <ActivityIndicator size="small" color={DASHBOARD_ACCENT} style={{ marginBottom: 14 }} />
      ) : featuredItem && (
        <ThemedCard style={styles.highlightCard}>
          <View style={styles.highlightBadge}>
            <Ionicons 
              name={featuredItem.isUrgent ? "megaphone-outline" : "sparkles-outline"} 
              size={14} 
              color="#FFF" 
            />
            <Text style={styles.highlightBadgeText}>
              {featuredItem.isUrgent ? t('dashboard.featured') : t('dashboard.events')}
            </Text>
          </View>
          <Text style={styles.highlightTitle}>{featuredItem.title}</Text>
          <Text style={styles.highlightDate}>{featuredItem.subtitle}</Text>
        </ThemedCard>
      )}

      <View style={styles.grid}>
        {menuItems.map((item) => (
          <GridCard
            key={item.id}
            title={item.title}
            icon={item.icon}
            color={DASHBOARD_ACCENT}
            onPress={item.onPress}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;
