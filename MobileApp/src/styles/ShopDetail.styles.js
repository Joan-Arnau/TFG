import { StyleSheet } from 'react-native';

export const getShopDetailStyles = (theme) => StyleSheet.create({
  heroImage: {
    width: '100%',
    height: 250,
  },
  infoContainer: {
    padding: 20,
    marginTop: -20,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
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
  galleryImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginRight: 10,
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
  },
  addressText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#495057',
    flex: 1,
  },
});
