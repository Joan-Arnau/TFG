import { StyleSheet } from 'react-native';

export const getShopDetailStyles = (theme) => StyleSheet.create({
  heroImage: {
    width: '100%',
    height: 250,
  },
  heroImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  infoContainer: {
    padding: 20,
    marginTop: -20,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: theme.secondaryColor,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#6C757D',
    lineHeight: 22,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  promoScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  gallery: {
    marginTop: 10,
    marginBottom: 10,
  },
  galleryImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginRight: 10,
  },
  emptyGallery: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    marginTop: 10,
  },
  emptyGalleryText: {
    color: '#999',
    marginTop: 5,
    fontSize: 14,
  },
  promoCard: {
    marginRight: 15,
    width: 200,
    padding: 15,
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#212529',
  },
  promoDate: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 4,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  addressText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#495057',
    flex: 1,
  },
  mapContainer: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  map: {
    flex: 1,
  },
});
