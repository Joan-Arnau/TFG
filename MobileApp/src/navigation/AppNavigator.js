import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import ShopDirectoryScreen from '../screens/ShopDirectoryScreen';
import ShopDetailScreen from '../screens/ShopDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

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
        name="Dashboard" 
        component={DashboardScreen} 
        options={({ navigation }) => ({ 
          title: 'PromoRural',
          headerTitleStyle: { color: '#212529', fontWeight: 'bold' },
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Ionicons name="settings-outline" size={24} color="#333" />
            </TouchableOpacity>
          )
        })}
      />
      <Stack.Screen 
        name="ShopDirectory" 
        component={ShopDirectoryScreen} 
        options={{ title: t('shop.list') }}
      />
      <Stack.Screen 
        name="ShopDetail" 
        component={ShopDetailScreen} 
        options={{ title: t('shop.detail') }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: t('settings.title') }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
