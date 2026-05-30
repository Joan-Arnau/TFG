import { httpClient } from '../httpClient';

export const announcementService = {
  getAll: async () => {
    const response = await httpClient.get('/admin/announcements');
    return response.data;
  },
  create: async (data) => {
    await httpClient.post('/admin/announcements', data);
  },
  update: async (id, data) => {
    await httpClient.put(`/admin/announcements/${id}`, data);
  },
  updateStatus: async (id, status) => {
    await httpClient.patch(`/admin/announcements/${id}/status?status=${status}`);
  },
  delete: async (id) => {
    await httpClient.delete(`/admin/announcements/${id}`);
  }
};
