import { httpClient } from '../httpClient';
import i18n from '../../i18n';

const getTranslation = (translatedField) => {
  if (!translatedField) return '';
  if (typeof translatedField === 'string') return translatedField;
  
  const currentLang = i18n.language || 'ca';
  return translatedField[currentLang] || translatedField['ca'] || Object.values(translatedField)[0] || '';
};

export const publicService = {
  getConfig: async () => {
    try {
      const response = await httpClient.get('/public/config');
      return response.data;
    } catch (error) {
      console.error('Error fetching config');
      throw new Error('Could not fetch config');
    }
  },

  getShops: async (params) => {
    try {
      const response = await httpClient.get('/public/shops', { params });
      return response.data.map(shop => ({
        ...shop,
        name: getTranslation(shop.name),
        description: getTranslation(shop.description),
        categoryId: shop.category ? shop.category.id : null,
        categoryName: shop.category ? getTranslation(shop.category.name) : ''
      }));
    } catch (error) {
      console.error('Error fetching shops');
      throw new Error('Could not fetch shops');
    }
  },

  getShopById: async (id) => {
    try {
      const response = await httpClient.get(`/public/shops/${id}`);
      const shop = response.data;
      return {
        ...shop,
        name: getTranslation(shop.name),
        description: getTranslation(shop.description),
        categoryName: shop.category ? getTranslation(shop.category.name) : '',
        promotions: (shop.promotions || []).map(p => ({
          ...p,
          title: getTranslation(p.title),
          description: getTranslation(p.description)
        }))
      };
    } catch (error) {
      console.error(`Error fetching shop detail`);
      throw new Error('Could not fetch shop detail');
    }
  },

  getCategories: async (type = 'SHOP') => {
    try {
      const response = await httpClient.get('/public/categories', {
        params: { type }
      });
      return response.data.map(cat => ({
        ...cat,
        name: getTranslation(cat.name)
      }));
    } catch (error) {
      console.error('Error fetching categories');
      return [];
    }
  },

  getAnnouncements: async () => {
    try {
      const response = await httpClient.get('/public/announcements');
      return response.data.map(item => ({
        ...item,
        title: getTranslation(item.title),
        content: getTranslation(item.content),
        categoryName: item.category ? getTranslation(item.category.name) : ''
      }));
    } catch (error) {
      console.error('Error fetching announcements');
      return [];
    }
  },

  getEvents: async () => {
    try {
      const response = await httpClient.get('/public/events');
      return response.data.map(item => ({
        ...item,
        title: getTranslation(item.title),
        description: getTranslation(item.description),
        locationText: getTranslation(item.locationText),
        categoryName: item.category ? getTranslation(item.category.name) : ''
      }));
    } catch (error) {
      console.error('Error fetching events');
      return [];
    }
  }
};
