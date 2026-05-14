import { httpClient } from '../httpClient';

export const shopService = {
  getAll: async () => {
    const response = await httpClient.get('/shops');
    return response.data;
  },
  getById: async (id) => {
    const response = await httpClient.get(`/shops/${id}`);
    return response.data;
  },
  create: async (shopData) => {
    const response = await httpClient.post('/shops', shopData);
    return response.data;
  },
  update: async (id, shopData) => {
    const response = await httpClient.put(`/shops/${id}`, shopData);
    return response.data;
  },
  delete: async (id) => {
    await httpClient.delete(`/shops/${id}`);
  }
};
