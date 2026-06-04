import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import ShopDirectoryScreen from '../screens/ShopDirectoryScreen';
import ShopDetailScreen from '../screens/ShopDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TourismMapScreen from '../screens/TourismMapScreen';
import PointOfInterestDetailScreen from '../screens/PointOfInterestDetailScreen';
import AnnouncementListScreen from '../screens/AnnouncementListScreen';
import AnnouncementDetailScreen from '../screens/AnnouncementDetailScreen';
import AgendaScreen from '../screens/AgendaScreen';
import FestivalScreen from '../screens/FestivalScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import ContactListScreen from '../screens/ContactListScreen';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: theme.primaryColor,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
        headerLeft: () => (
          navigation.canGoBack() ? (
            <TouchableOpacity 
              onPress={() => navigation.navigate(ROUTES.DASHBOARD)}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="home-outline" size={24} color={theme.primaryColor} />
            </TouchableOpacity>
          ) : null
        ),
      })}
    >
      <Stack.Screen 
        name={ROUTES.DASHBOARD} 
        component={DashboardScreen} 
        options={({ navigation }) => ({ 
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1 }}>
              {theme.logoUrl ? (
                <Image 
                  source={{ uri: theme.logoUrl }} 
                  style={{ width: 28, height: 28, marginRight: 8, resizeMode: 'contain' }} 
                />
              ) : null}
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#212529' }} numberOfLines={1}>
                {theme.municipalityName}
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.SETTINGS)}>
              <Ionicons name="settings-outline" size={24} color="#333" />
            </TouchableOpacity>
          )
        })}
      />
      <Stack.Screen 
        name={ROUTES.SHOP_DIRECTORY} 
        component={ShopDirectoryScreen} 
        options={{ title: t('shop.list') }}
      />
      <Stack.Screen 
        name={ROUTES.SHOP_DETAIL} 
        component={ShopDetailScreen} 
        options={{ title: t('shop.detail') }}
      />
      <Stack.Screen 
        name={ROUTES.TOURISM_MAP} 
        component={TourismMapScreen} 
        options={{ title: t('dashboard.tourism') }}
      />
      <Stack.Screen 
        name={ROUTES.POI_DETAIL} 
        component={PointOfInterestDetailScreen} 
        options={{ title: t('dashboard.tourism') }}
      />
      <Stack.Screen 
        name={ROUTES.ANNOUNCEMENTS} 
        component={AnnouncementListScreen} 
        options={{ title: t('announcement.title') }}
      />
      <Stack.Screen 
        name={ROUTES.ANNOUNCEMENT_DETAIL} 
        component={AnnouncementDetailScreen} 
        options={{ title: t('announcement.detail') }}
      />
      <Stack.Screen 
        name={ROUTES.AGENDA} 
        component={AgendaScreen} 
        options={{ 
          title: t('dashboard.agenda'),
          headerRight: () => <Ionicons name="calendar-outline" size={24} color={theme.primaryColor} style={{ marginRight: 15 }} />
        }}
      />
      <Stack.Screen 
        name={ROUTES.FESTIVALS} 
        component={FestivalScreen} 
        options={{ 
          title: t('dashboard.events'),
          headerRight: () => <Ionicons name="sparkles-outline" size={24} color={theme.primaryColor} style={{ marginRight: 15 }} />
        }}
      />
      <Stack.Screen 
        name={ROUTES.EVENT_DETAIL} 
        component={EventDetailScreen} 
        options={{ title: t('event.detail') }}
      />
      <Stack.Screen 
        name={ROUTES.CONTACTS} 
        component={ContactListScreen} 
        options={{ title: t('dashboard.contact') }}
      />
      <Stack.Screen 
        name={ROUTES.SETTINGS} 
        component={SettingsScreen} 
        options={{ title: t('settings.title') }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
