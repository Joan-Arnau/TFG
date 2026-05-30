import { httpClient } from '../httpClient';

export const eventService = {
  getAll: async () => {
    const response = await httpClient.get('/admin/events');
    return response.data;
  },
  create: async (data) => {
    const response = await httpClient.post('/admin/events', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await httpClient.put(`/admin/events/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await httpClient.delete(`/admin/events/${id}`);
  },
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await httpClient.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
  },
};
