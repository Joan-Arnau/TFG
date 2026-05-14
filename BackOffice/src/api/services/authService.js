import { httpClient } from '../httpClient';

export const authService = {
  login: async (credentials) => {
    const response = await httpClient.post('/auth/login', credentials);
    return response.data;
  },
  register: async (payload) => {
    await httpClient.post('/auth/register', payload);
  },
  forgotPassword: async (payload) => {
    await httpClient.post('/auth/forgot-password', payload);
  },
  resetPassword: async (payload) => {
    await httpClient.post('/auth/reset-password', payload);
  },
};
