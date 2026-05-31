import { httpClient } from '../httpClient';
import { ADMIN_API } from '../../constants';

export const contactService = {
  getAll: async () => {
    const response = await httpClient.get(ADMIN_API.CONTACTS);
    return response.data;
  },
  create: async (data) => {
    const response = await httpClient.post(ADMIN_API.CONTACTS, data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await httpClient.put(ADMIN_API.CONTACT(id), data);
    return response.data;
  },
  delete: async (id) => {
    await httpClient.delete(ADMIN_API.CONTACT(id));
  }
};
