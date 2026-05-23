import { httpClient } from '../httpClient';
import i18n from '../../i18n';
import { formatImageUrl } from '../../utils/imageUtils';

export const getTranslation = (translatedField, language) => {
  if (!translatedField) return '';
  if (typeof translatedField === 'string') return translatedField;
  
  const currentLang = language || i18n.language || 'ca';
  return translatedField[currentLang] || translatedField['ca'] || Object.values(translatedField)[0] || '';
};

export const publicService = {
  getConfig: async () => {
    try {
      const response = await httpClient.get('/public/config');
      return response.data || {};
    } catch {
      console.error('Error fetching config');
      return {};
    }
  },

  getShops: async (params) => {
    try {
      const response = await httpClient.get('/public/shops', { params });
      const data = Array.isArray(response.data) ? response.data : [];
      
      return data.map(shop => ({
        id: shop.id,
        name: getTranslation(shop.name),
        description: getTranslation(shop.description),
        address: shop.address,
        phoneNumber: shop.phoneNumber,
        headerImageUrl: formatImageUrl(shop.headerImageUrl),
        categoryId: shop.category ? shop.category.id : null,
        categoryName: shop.category ? getTranslation(shop.category.name) : '',
        latitude: shop.latitude,
        longitude: shop.longitude
      }));
    } catch {
      console.error('Error fetching shops');
      return [];
    }
  },

  getShopById: async (id) => {
    try {
      const response = await httpClient.get(`/public/shops/${id}`);
      const shop = response.data;
      if (!shop) return null;
      
      return {
        id: shop.id,
        name: getTranslation(shop.name),
        description: getTranslation(shop.description),
        address: shop.address,
        phoneNumber: shop.phoneNumber,
        headerImageUrl: formatImageUrl(shop.headerImageUrl),
        categoryId: shop.category ? shop.category.id : null,
        categoryName: shop.category ? getTranslation(shop.category.name) : '',
        latitude: shop.latitude,
        longitude: shop.longitude,
        images: Array.isArray(shop.images) ? shop.images.map(img => formatImageUrl(img)) : [],
        promotions: Array.isArray(shop.promotions) ? shop.promotions.map(p => ({
          id: p.id,
          title: getTranslation(p.title),
          description: getTranslation(p.description),
          imageUrl: formatImageUrl(p.imageUrl),
          startsAt: p.startsAt,
          endsAt: p.endsAt
        })) : []
      };
    } catch {
      console.error('Error fetching shop detail');
      return null;
    }
  },

  getCategories: async (type = 'SHOP') => {
    try {
      const response = await httpClient.get('/public/categories', {
        params: { type }
      });
      const data = Array.isArray(response.data) ? response.data : [];
      return data.map(cat => ({
        id: cat.id,
        name: getTranslation(cat.name),
        icon: cat.icon || 'apps-outline'
      }));
    } catch {
      console.error('Error fetching categories');
      return [];
    }
  },

  getAnnouncements: async () => {
    try {
      const response = await httpClient.get('/public/announcements');
      const data = Array.isArray(response.data) ? response.data : [];
      return data.map(item => ({
        id: item.id,
        title: getTranslation(item.title),
        content: getTranslation(item.content),
        urgent: item.urgent,
        publishedAt: item.publishedAt,
        categoryName: item.category ? getTranslation(item.category.name) : ''
      }));
    } catch {
      console.error('Error fetching announcements');
      return [];
    }
  },

  getEvents: async () => {
    try {
      const response = await httpClient.get('/public/events');
      const data = Array.isArray(response.data) ? response.data : [];
      return data.map(item => ({
        id: item.id,
        title: getTranslation(item.title),
        description: getTranslation(item.description),
        locationText: getTranslation(item.locationText),
        startsAt: item.startsAt,
        endsAt: item.endsAt,
        latitude: item.latitude,
        longitude: item.longitude,
        isFestival: item.festival || false,
        imageUrl: formatImageUrl(item.imageUrl),
        categoryName: item.category ? getTranslation(item.category.name) : '',
        categoryId: item.category ? item.category.id : null
      }));
    } catch {
      console.error('Error fetching events');
      return [];
    }
  },

  getPointsOfInterest: async () => {
    try {
      const response = await httpClient.get('/public/points-of-interest');
      const data = Array.isArray(response.data) ? response.data : [];
      
      return data.map(item => ({
        id: item.id,
        name: getTranslation(item.name),
        description: getTranslation(item.description),
        imageUrl: formatImageUrl(item.imageUrl),
        latitude: item.latitude,
        longitude: item.longitude,
        categoryName: item.category ? getTranslation(item.category.name) : ''
      }));
    } catch {
      console.error('Error fetching POIs');
      return [];
    }
  },

  getPointOfInterestById: async (id) => {
    try {
      const response = await httpClient.get(`/public/points-of-interest/${id}`);
      const item = response.data;
      if (!item) return null;

      return {
        id: item.id,
        name: getTranslation(item.name),
        description: getTranslation(item.description),
        imageUrl: formatImageUrl(item.imageUrl),
        latitude: item.latitude,
        longitude: item.longitude,
        categoryName: item.category ? getTranslation(item.category.name) : ''
      };
    } catch {
      console.error('Error fetching POI detail');
      return null;
    }
  },

  getContacts: async () => {
    try {
      const response = await httpClient.get('/public/contacts');
      const data = Array.isArray(response.data) ? response.data : [];
      
      return data.map(item => ({
        id: item.id,
        serviceName: getTranslation(item.serviceName),
        phoneNumber: item.phoneNumber,
        iconName: item.iconName || 'call-outline',
        categoryName: item.category ? getTranslation(item.category.name) : ''
      }));
    } catch {
      console.error('Error fetching contacts');
      return [];
    }
  }
};
