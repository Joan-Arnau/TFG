import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import ShopDirectoryScreen from '../screens/ShopDirectoryScreen';
import ShopDetailScreen from '../screens/ShopDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TourismMapScreen from '../screens/TourismMapScreen';
import PointOfInterestDetailScreen from '../screens/PointOfInterestDetailScreen';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: theme.primaryColor,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name={ROUTES.DASHBOARD} 
        component={DashboardScreen} 
        options={({ navigation }) => ({ 
          title: 'PromoRural',
          headerTitleStyle: { color: '#212529', fontWeight: 'bold' },
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
        name={ROUTES.SETTINGS} 
        component={SettingsScreen} 
        options={{ title: t('settings.title') }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
