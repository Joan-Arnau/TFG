import { StyleSheet } from 'react-native';

export const getShopDirectoryStyles = (theme) => StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  categoryList: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  categoryItemActive: {
    backgroundColor: theme.primaryColor,
  },
  categoryLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: '#FFF',
  },
  listContent: {
    padding: 15,
    paddingTop: 0,
  },
  shopCard: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 15,
  },
  shopImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F1F3F5',
  },
  shopImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  shopCategory: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 10,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    color: theme.primaryColor,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
