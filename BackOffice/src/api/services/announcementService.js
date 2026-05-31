import { httpClient } from '../httpClient';
import { ADMIN_API } from '../../constants';

export const announcementService = {
  getAll: async () => {
    const response = await httpClient.get(ADMIN_API.ANNOUNCEMENTS);
    return response.data;
  },
  create: async (data) => {
    await httpClient.post(ADMIN_API.ANNOUNCEMENTS, data);
  },
  update: async (id, data) => {
    await httpClient.put(ADMIN_API.ANNOUNCEMENT(id), data);
  },
  updateStatus: async (id, status) => {
    await httpClient.patch(`${ADMIN_API.ANNOUNCEMENT_STATUS(id)}?status=${status}`);
  },
  delete: async (id) => {
    await httpClient.delete(ADMIN_API.ANNOUNCEMENT(id));
  }
};
