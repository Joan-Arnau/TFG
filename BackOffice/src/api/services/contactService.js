import { httpClient } from '../httpClient';

export const contactService = {
  getAll: async () => {
    const response = await httpClient.get('/admin/contacts');
    return response.data;
  },
  create: async (data) => {
    const response = await httpClient.post('/admin/contacts', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await httpClient.put(`/admin/contacts/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await httpClient.delete(`/admin/contacts/${id}`);
  }
};
