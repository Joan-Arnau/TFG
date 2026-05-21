import { StyleSheet } from 'react-native';

export const getEventStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  filterScroll: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F3F5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  filterChipActive: {
    backgroundColor: theme.primaryColor,
    borderColor: theme.primaryColor,
  },
  filterText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFF',
  },
  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#F1F3F5',
  },
  tabActive: {
    backgroundColor: theme.primaryColor,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  tabTextActive: {
    color: '#FFF',
  },
  // SectionList
  sectionHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F8F9FA',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  listContent: {
    paddingBottom: 30,
  },
  // Event Card
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 15,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  festivalCard: {
    borderLeftColor: theme.primaryColor,
    backgroundColor: '#F0FDF4',
  },
  nowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E03131',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  nowText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#868E96',
    marginLeft: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#868E96',
    marginLeft: 4,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#E9ECEF',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#495057',
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  // Detail styles
  detailContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  detailImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  detailContent: {
    padding: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  detailFestivalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  detailFestivalText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 4,
  },
  detailDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailDateText: {
    fontSize: 14,
    color: '#495057',
    marginLeft: 8,
  },
  detailLocationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailLocationText: {
    fontSize: 14,
    color: '#495057',
    marginLeft: 8,
    flex: 1,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
    marginTop: 16,
  },
  detailDescription: {
    fontSize: 15,
    color: '#343A40',
    lineHeight: 24,
    marginBottom: 20,
  },
  detailActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    marginTop: 10,
  },
  actionButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  actionText: {
    fontSize: 12,
    color: '#495057',
    marginTop: 4,
    fontWeight: '500',
  },
  // Map
  mapContainer: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 10,
    color: '#999',
    fontSize: 14,
  }
});