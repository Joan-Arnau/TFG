import { httpClient } from '../httpClient';

export const shopService = {
  getAll: async () => {
    const response = await httpClient.get('/public/shops');
    return response.data;
  },
  adminGetAll: async () => {
    const response = await httpClient.get('/admin/shops');
    return response.data;
  },
  getPendingShops: async () => {
    const response = await httpClient.get('/admin/shops/pending');
    return response.data;
  },
  getById: async (id) => {
    const response = await httpClient.get(`/public/shops/${id}`);
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
  },
  updateStatus: async (id, status, rejectionReason) => {
    const response = await httpClient.patch(`/admin/shops/${id}/status`, { status, rejectionReason });
    return response.data;
  },
  adminUpdate: async (id, shopData) => {
    const response = await httpClient.put(`/admin/shops/${id}`, shopData);
    return response.data;
  },
  adminDelete: async (id) => {
    await httpClient.delete(`/admin/shops/${id}`);
  }
};
