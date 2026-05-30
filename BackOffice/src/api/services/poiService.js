import { httpClient } from '../httpClient';

export const poiService = {
  getAll: async () => {
    const response = await httpClient.get('/admin/pois');
    return response.data;
  },
  create: async (data) => {
    const response = await httpClient.post('/admin/pois', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await httpClient.put(`/admin/pois/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await httpClient.delete(`/admin/pois/${id}`);
  },
  uploadImage: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await httpClient.post(`/admin/pois/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};
