import { httpClient } from '../httpClient';
import { AUTH_API } from '../../constants';

export const authService = {
  login: async (credentials) => {
    const response = await httpClient.post(AUTH_API.LOGIN, credentials);
    return response.data;
  },
  register: async (payload) => {
    await httpClient.post(AUTH_API.REGISTER, payload);
  },
  forgotPassword: async (payload) => {
    await httpClient.post(AUTH_API.FORGOT_PASSWORD, payload);
  },
  resetPassword: async (payload) => {
    await httpClient.post(AUTH_API.RESET_PASSWORD, payload);
  },
};
