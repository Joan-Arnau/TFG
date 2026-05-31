import { httpClient } from '../httpClient';
import { ADMIN_API, PUBLIC_API } from '../../constants';

export const adminConfigService = {
  getConfig: async () => {
    const response = await httpClient.get(PUBLIC_API.CONFIG);
    return response.data;
  },

  updateConfig: async (configData) => {
    const response = await httpClient.post(ADMIN_API.CONFIG, configData);
    return response.data;
  },

  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await httpClient.post(ADMIN_API.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Expected response: { url: "..." }
  },
};
