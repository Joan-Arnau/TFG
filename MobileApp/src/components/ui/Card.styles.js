import { StyleSheet } from 'react-native';

export const getCardStyles = (theme) => StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  themedCard: {
    borderLeftWidth: 5,
    borderLeftColor: theme.primaryColor,
  }
});
