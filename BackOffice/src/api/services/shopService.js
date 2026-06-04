import { httpClient } from '../httpClient';
import { ADMIN_API, PUBLIC_API, MERCHANT_API } from '../../constants';

export const shopService = {
  getAll: async () => {
    const response = await httpClient.get(PUBLIC_API.SHOPS);
    return response.data;
  },
  adminGetAll: async () => {
    const response = await httpClient.get(ADMIN_API.SHOPS);
    return response.data;
  },
  getPendingShops: async () => {
    const response = await httpClient.get(ADMIN_API.SHOPS_PENDING);
    return response.data;
  },
  getById: async (id) => {
    const response = await httpClient.get(PUBLIC_API.SHOP(id));
    return response.data;
  },
  create: async (shopData) => {
    const response = await httpClient.post(MERCHANT_API.BASE, shopData);
    return response.data;
  },
  update: async (id, shopData) => {
    const response = await httpClient.put(MERCHANT_API.BY_ID(id), shopData);
    return response.data;
  },
  delete: async (id) => {
    await httpClient.delete(MERCHANT_API.BY_ID(id));
  },
  updateStatus: async (id, status, rejectionReason) => {
    const response = await httpClient.patch(ADMIN_API.SHOP_STATUS(id), { status, rejectionReason });
    return response.data;
  },
  adminUpdate: async (id, shopData) => {
    const response = await httpClient.put(ADMIN_API.SHOP(id), shopData);
    return response.data;
  },
  adminDelete: async (id) => {
    await httpClient.delete(ADMIN_API.SHOP(id));
  },
  getMyShop: async () => {
    const r = await httpClient.get(MERCHANT_API.MY_SHOP);
    return r.data;
  },
  updateMyShop: async (data) => {
    const r = await httpClient.put(MERCHANT_API.MY_SHOP, data);
    return r.data;
  },
  deleteMyShop: async () => {
    await httpClient.delete(MERCHANT_API.MY_SHOP);
  },
  getImages: async () => {
    const r = await httpClient.get(MERCHANT_API.IMAGES);
    return r.data;
  },
  uploadImage: async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const r = await httpClient.post(MERCHANT_API.IMAGES, fd);
    return r.data;
  },
  deleteImage: async (id) => {
    await httpClient.delete(MERCHANT_API.IMAGE(id));
  },
  uploadHeaderImage: async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const r = await httpClient.post(MERCHANT_API.HEADER_IMAGE, fd);
    return r.data;
  },
};
