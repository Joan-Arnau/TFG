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
  getCategories: async (type = 'SHOP') => {
    const r = await httpClient.get(MERCHANT_API.CATEGORIES, { params: { type } });
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
    // Let the browser set the Content-Type with the proper multipart boundary
    const r = await httpClient.post(MERCHANT_API.IMAGES, fd);
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
