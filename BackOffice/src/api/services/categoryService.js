import { httpClient } from '../httpClient';
import { ADMIN_API, MERCHANT_API } from '../../constants';

export const categoryService = {
  getAll: async (type) => {
    const url = type ? `${ADMIN_API.CATEGORIES}?type=${type}` : ADMIN_API.CATEGORIES;
    const response = await httpClient.get(url);
    return response.data;
  },
  create: async (categoryData) => {
    const response = await httpClient.post(ADMIN_API.CATEGORIES, categoryData);
    return response.data;
  },
  update: async (id, categoryData) => {
    const response = await httpClient.put(ADMIN_API.CATEGORY(id), categoryData);
    return response.data;
  },
  delete: async (id) => {
    await httpClient.delete(ADMIN_API.CATEGORY(id));
  },
  getMerchantCategories: async (type = 'SHOP') => {
    const r = await httpClient.get(MERCHANT_API.CATEGORIES, { params: { type } });
    return r.data;
  },
};
