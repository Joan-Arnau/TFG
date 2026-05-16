import { StyleSheet } from 'react-native';

export const getDashboardStyles = (theme) => StyleSheet.create({
  content: {
    padding: 10,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  welcome: {
    fontSize: 16,
    color: '#6C757D',
  },
  villageName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.primaryColor,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  highlightCard: {
    marginTop: 10,
  },
  highlightBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: theme.primaryColor,
  },
  highlightBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  highlightTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  highlightDate: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },
});
