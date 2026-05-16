import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import ShopDirectoryScreen from '../screens/ShopDirectoryScreen';
import ShopDetailScreen from '../screens/ShopDetailScreen';
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
        options={{ 
          title: 'PromoRural',
          headerTitleStyle: { color: '#212529', fontWeight: 'bold' }
        }}
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
    </Stack.Navigator>
  );
};

export default AppNavigator;
