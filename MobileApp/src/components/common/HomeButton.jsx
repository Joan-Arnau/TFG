import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { ROUTES } from '../../navigation/routes';

export const HomeButton = ({ navigation, style }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.roundButton, style]}
      onPress={() => navigation.navigate(ROUTES.DASHBOARD)}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="home" 
        size={24} 
        color={theme.primaryColor} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  roundButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
});
