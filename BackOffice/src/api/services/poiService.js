import { httpClient } from '../httpClient';
import { ADMIN_API } from '../../constants';

export const poiService = {
  getAll: async () => {
    const response = await httpClient.get(ADMIN_API.POIS);
    return response.data;
  },
  create: async (data) => {
    const response = await httpClient.post(ADMIN_API.POIS, data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await httpClient.put(ADMIN_API.POI(id), data);
    return response.data;
  },
  delete: async (id) => {
    await httpClient.delete(ADMIN_API.POI(id));
  },
  uploadImage: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await httpClient.post(ADMIN_API.POI_IMAGE(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};
