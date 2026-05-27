import { httpClient } from '../httpClient';
import { MERCHANT_API } from '../../pages/merchant/constants';

export const merchantService = {
  getMyShop: async () => {
    const r = await httpClient.get(MERCHANT_API.MY_SHOP);
    return r.data;
  },
  updateMyShop: async (data) => {
    const r = await httpClient.put(MERCHANT_API.MY_SHOP, data);
    return r.data;
  },

  getPromotions: async () => {
    const r = await httpClient.get(MERCHANT_API.PROMOTIONS);
    return r.data;
  },
  getPromotion: async (id) => {
    const r = await httpClient.get(MERCHANT_API.PROMOTION(id));
    return r.data;
  },
  createPromotion: async (promotion) => {
    const r = await httpClient.post(MERCHANT_API.PROMOTIONS, promotion);
    return r.data;
  },
  updatePromotion: async (id, promotion) => {
    const r = await httpClient.put(MERCHANT_API.PROMOTION(id), promotion);
    return r.data;
  },
  deletePromotion: async (id) => {
    await httpClient.delete(MERCHANT_API.PROMOTION(id));
  },

  uploadImage: async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const r = await httpClient.post(MERCHANT_API.IMAGES, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return r.data;
  },
  getImages: async () => {
    const r = await httpClient.get(MERCHANT_API.IMAGES);
    return r.data;
  },
  deleteImage: async (id) => {
    await httpClient.delete(MERCHANT_API.IMAGE(id));
  },
};

export default merchantService;
