import { httpClient } from '../httpClient';
import { MERCHANT_API } from '../../constants';

export const promotionService = {
  getAll: async () => {
    const r = await httpClient.get(MERCHANT_API.PROMOTIONS);
    return r.data;
  },
  getById: async (id) => {
    const r = await httpClient.get(MERCHANT_API.PROMOTION(id));
    return r.data;
  },
  create: async (promotion) => {
    const r = await httpClient.post(MERCHANT_API.PROMOTIONS, promotion);
    return r.data;
  },
  update: async (id, promotion) => {
    const r = await httpClient.put(MERCHANT_API.PROMOTION(id), promotion);
    return r.data;
  },
  delete: async (id) => {
    await httpClient.delete(MERCHANT_API.PROMOTION(id));
  },
};
