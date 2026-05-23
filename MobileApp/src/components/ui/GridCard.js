import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { useTheme } from '../../context/ThemeContext';
import { getGridCardStyles } from '../../styles/components/GridCard.styles';

export const GridCard = ({ title, icon, onPress, color }) => {
  const theme = useTheme();
  const styles = getGridCardStyles(theme);
  
  return (
    <Card 
      style={styles.gridCard} 
      onPress={onPress}
    >
      <View style={[styles.iconContainer, color ? { backgroundColor: color + '15' } : null]}>
        <Ionicons name={icon} size={32} color={color || theme.primaryColor} />
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
    </Card>
  );
};
