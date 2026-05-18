import { httpClient } from '../httpClient';
import i18n from '../../i18n';
import { formatImageUrl } from '../../utils/imageUtils';

export const getTranslation = (translatedField) => {
  if (!translatedField) return '';
  if (typeof translatedField === 'string') return translatedField;
  
  const currentLang = i18n.language || 'ca';
  return translatedField[currentLang] || translatedField['ca'] || Object.values(translatedField)[0] || '';
};

export const publicService = {
  getConfig: async () => {
    try {
      const response = await httpClient.get('/public/config');
      return response.data || {};
    } catch (error) {
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
        name: shop.name, // Raw multilingual Map
        description: shop.description, // Raw multilingual Map
        address: shop.address,
        phoneNumber: shop.phoneNumber,
        headerImageUrl: formatImageUrl(shop.headerImageUrl),
        categoryId: shop.category ? shop.category.id : null,
        categoryName: shop.category ? shop.category.name : '', // Raw multilingual Map
        latitude: shop.latitude,
        longitude: shop.longitude
      }));
    } catch (error) {
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
        name: shop.name, // Raw multilingual Map
        description: shop.description, // Raw multilingual Map
        address: shop.address,
        phoneNumber: shop.phoneNumber,
        headerImageUrl: formatImageUrl(shop.headerImageUrl),
        categoryId: shop.category ? shop.category.id : null,
        categoryName: shop.category ? shop.category.name : '', // Raw multilingual Map
        latitude: shop.latitude,
        longitude: shop.longitude,
        images: Array.isArray(shop.images) ? shop.images.map(img => formatImageUrl(img)) : [],
        promotions: Array.isArray(shop.promotions) ? shop.promotions.map(p => ({
          id: p.id,
          title: p.title, // Raw multilingual Map
          description: p.description, // Raw multilingual Map
          imageUrl: formatImageUrl(p.imageUrl),
          startsAt: p.startsAt,
          endsAt: p.endsAt
        })) : []
      };
    } catch (error) {
      console.error(`Error fetching shop detail`);
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
        name: cat.name, // Raw multilingual Map
        icon: cat.icon || 'apps-outline'
      }));
    } catch (error) {
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
        title: item.title, // Raw multilingual Map
        content: item.content, // Raw multilingual Map
        urgent: item.urgent,
        publishedAt: item.publishedAt,
        categoryName: item.category ? item.category.name : '' // Raw multilingual Map
      }));
    } catch (error) {
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
        title: item.title, // Raw multilingual Map
        description: item.description, // Raw multilingual Map
        locationText: item.locationText, // Raw multilingual Map
        startsAt: item.startsAt,
        endsAt: item.endsAt,
        latitude: item.latitude,
        longitude: item.longitude,
        categoryName: item.category ? item.category.name : '' // Raw multilingual Map
      }));
    } catch (error) {
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
        name: item.name, // Raw multilingual Map
        description: item.description, // Raw multilingual Map
        imageUrl: formatImageUrl(item.imageUrl),
        latitude: item.latitude,
        longitude: item.longitude,
        categoryName: item.category ? item.category.name : '' // Raw multilingual Map
      }));
    } catch (error) {
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
        name: item.name, // Raw multilingual Map
        description: item.description, // Raw multilingual Map
        imageUrl: formatImageUrl(item.imageUrl),
        latitude: item.latitude,
        longitude: item.longitude,
        categoryName: item.category ? item.category.name : '' // Raw multilingual Map
      };
    } catch (error) {
      console.error('Error fetching POI detail:', error.response?.status, error.message);
      return null;
    }
  }
};
