import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_SIZE = (width - (CARD_MARGIN * 4)) / 2;

export const getGridCardStyles = (theme) => StyleSheet.create({
  gridCard: {
    marginBottom: CARD_MARGIN * 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    width: CARD_SIZE,
    height: CARD_SIZE
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: theme.primaryColor + '15',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#212529',
  },
});
