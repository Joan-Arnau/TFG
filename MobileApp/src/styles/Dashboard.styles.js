import { StyleSheet } from 'react-native';

export const getDashboardStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 10,
  },
  header: {
    paddingVertical: 22,
    paddingHorizontal: 16,
    marginBottom: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 6,
    borderLeftColor: '#35524A',
  },
  welcome: {
    fontSize: 16,
    color: '#6C757D',
  },
  villageName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
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
    backgroundColor: '#35524A',
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
