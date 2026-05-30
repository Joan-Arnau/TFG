import { httpClient } from '../httpClient';

export const adminConfigService = {
  getConfig: async () => {
    const response = await httpClient.get('/public/config');
    return response.data;
  },

  updateConfig: async (configData) => {
    const response = await httpClient.post('/admin/config', configData);
    return response.data;
  },

  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await httpClient.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Expected response: { url: "..." }
  },
};
