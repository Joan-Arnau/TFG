import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { getButtonStyles } from '../../styles/components/Button.styles';

export const IconButton = ({ icon, color, onPress, style, size = 24, disabled }) => {
  const theme = useTheme();
  const styles = getButtonStyles(theme);
  
  return (
    <TouchableOpacity 
      style={[
        styles.iconButton, 
        color ? { backgroundColor: color } : null,
        disabled ? { opacity: 0.5 } : null, 
        style
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Ionicons name={icon} size={size} color="#FFF" />
    </TouchableOpacity>
  );
};

export const PrimaryButton = ({ title, onPress, style, textStyle, disabled }) => {
  const theme = useTheme();
  const styles = getButtonStyles(theme);
  
  return (
    <TouchableOpacity 
      style={[styles.primaryButton, disabled ? { opacity: 0.5 } : null, style]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.primaryButtonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};
