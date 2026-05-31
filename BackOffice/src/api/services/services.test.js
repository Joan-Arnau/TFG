import { describe, test, expect, vi, beforeEach } from 'vitest';
import { httpClient } from '../httpClient';
import { promotionService } from './promotionService';
import { shopService } from './shopService';
import { categoryService } from './categoryService';

// Mock the HTTP client entirely
vi.mock('../httpClient', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('Domain-Specific Services API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('promotionService', () => {
    test('getAll fetches promotions successfully', async () => {
      const mockPromotions = [{ id: 1, title: { ca: 'Promo' } }];
      vi.mocked(httpClient.get).mockResolvedValue({ data: mockPromotions });

      const res = await promotionService.getAll();
      expect(httpClient.get).toHaveBeenCalledWith('/merchant/promotions');
      expect(res).toEqual(mockPromotions);
    });

    test('getById fetches a single promotion successfully', async () => {
      const mockPromo = { id: 123, title: { ca: 'One Promo' } };
      vi.mocked(httpClient.get).mockResolvedValue({ data: mockPromo });

      const res = await promotionService.getById(123);
      expect(httpClient.get).toHaveBeenCalledWith('/merchant/promotions/123');
      expect(res).toEqual(mockPromo);
    });

    test('create posts a new promotion successfully', async () => {
      const payload = { title: { ca: 'New' }, imageUrl: 'img.png' };
      const created = { id: 999, ...payload };
      vi.mocked(httpClient.post).mockResolvedValue({ data: created });

      const res = await promotionService.create(payload);
      expect(httpClient.post).toHaveBeenCalledWith('/merchant/promotions', payload);
      expect(res).toEqual(created);
    });

    test('update puts changed promotion successfully', async () => {
      const payload = { title: { ca: 'Updated' } };
      const updated = { id: 123, ...payload };
      vi.mocked(httpClient.put).mockResolvedValue({ data: updated });

      const res = await promotionService.update(123, payload);
      expect(httpClient.put).toHaveBeenCalledWith('/merchant/promotions/123', payload);
      expect(res).toEqual(updated);
    });

    test('delete removes a promotion successfully', async () => {
      vi.mocked(httpClient.delete).mockResolvedValue({});

      await promotionService.delete(123);
      expect(httpClient.delete).toHaveBeenCalledWith('/merchant/promotions/123');
    });
  });

  describe('shopService (Merchant context)', () => {
    test('getMyShop fetches the current merchant shop profile', async () => {
      const mockShop = { id: 10, name: { ca: 'Botiga' } };
      vi.mocked(httpClient.get).mockResolvedValue({ data: mockShop });

      const res = await shopService.getMyShop();
      expect(httpClient.get).toHaveBeenCalledWith('/merchant/my-shop');
      expect(res).toEqual(mockShop);
    });

    test('updateMyShop puts changes to shop profile successfully', async () => {
      const payload = { address: 'Main St 12' };
      const updated = { id: 10, ...payload };
      vi.mocked(httpClient.put).mockResolvedValue({ data: updated });

      const res = await shopService.updateMyShop(payload);
      expect(httpClient.put).toHaveBeenCalledWith('/merchant/my-shop', payload);
      expect(res).toEqual(updated);
    });

    test('getImages fetches shop images list', async () => {
      const mockImages = [{ id: 1, url: 'img.png' }];
      vi.mocked(httpClient.get).mockResolvedValue({ data: mockImages });

      const res = await shopService.getImages();
      expect(httpClient.get).toHaveBeenCalledWith('/merchant/my-shop/images');
      expect(res).toEqual(mockImages);
    });

    test('uploadImage posts an image file as FormData', async () => {
      const fakeFile = new File(['foo'], 'photo.png', { type: 'image/png' });
      const mockResponse = { id: 5, url: 'photo_uploaded.png' };
      vi.mocked(httpClient.post).mockResolvedValue({ data: mockResponse });

      const res = await shopService.uploadImage(fakeFile);
      expect(httpClient.post).toHaveBeenCalledWith(
        '/merchant/my-shop/images',
        expect.any(FormData)
      );
      expect(res).toEqual(mockResponse);
    });

    test('deleteImage deletes a shop image', async () => {
      vi.mocked(httpClient.delete).mockResolvedValue({});

      await shopService.deleteImage(5);
      expect(httpClient.delete).toHaveBeenCalledWith('/merchant/my-shop/images/5');
    });
  });

  describe('categoryService (Merchant context)', () => {
    test('getMerchantCategories fetches merchant-facing category list with parameters', async () => {
      const mockCategories = [{ id: 1, name: { ca: 'Roba' } }];
      vi.mocked(httpClient.get).mockResolvedValue({ data: mockCategories });

      const res = await categoryService.getMerchantCategories('SHOP');
      expect(httpClient.get).toHaveBeenCalledWith(
        '/merchant/categories',
        { params: { type: 'SHOP' } }
      );
      expect(res).toEqual(mockCategories);
    });
  });
});
