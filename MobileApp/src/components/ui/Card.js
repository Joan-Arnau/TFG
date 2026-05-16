import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getCardStyles } from '../../styles/components/Card.styles';

export const Card = ({ children, style, onPress, ...props }) => {
  const theme = useTheme();
  const styles = getCardStyles(theme);
  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent 
      style={[styles.card, style]} 
      onPress={onPress}
      activeOpacity={0.8}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export const ThemedCard = ({ children, style, ...props }) => {
  const theme = useTheme();
  const styles = getCardStyles(theme);
  return (
    <Card 
      style={[styles.themedCard, style]} 
      {...props}
    >
      {children}
    </Card>
  );
};
