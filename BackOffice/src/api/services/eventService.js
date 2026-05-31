import { httpClient } from '../httpClient';
import { ADMIN_API } from '../../constants';

export const eventService = {
  getAll: async () => {
    const response = await httpClient.get(ADMIN_API.EVENTS);
    return response.data;
  },
  create: async (data) => {
    const response = await httpClient.post(ADMIN_API.EVENTS, data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await httpClient.put(ADMIN_API.EVENT(id), data);
    return response.data;
  },
  delete: async (id) => {
    await httpClient.delete(ADMIN_API.EVENT(id));
  },
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await httpClient.post(ADMIN_API.UPLOAD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url;
  },
};
