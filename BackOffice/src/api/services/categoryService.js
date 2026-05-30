import { httpClient } from '../httpClient';

export const categoryService = {
  getAll: async (type) => {
    const url = type ? `/admin/categories?type=${type}` : '/admin/categories';
    const response = await httpClient.get(url);
    return response.data;
  },
  create: async (categoryData) => {
    const response = await httpClient.post('/admin/categories', categoryData);
    return response.data;
  },
  update: async (id, categoryData) => {
    const response = await httpClient.put(`/admin/categories/${id}`, categoryData);
    return response.data;
  },
  delete: async (id) => {
    await httpClient.delete(`/admin/categories/${id}`);
  }
};
