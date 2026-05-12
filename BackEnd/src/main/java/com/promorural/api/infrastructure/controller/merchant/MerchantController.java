package com.promorural.api.infrastructure.controller.merchant;

import com.promorural.api.core.application.dto.merchant.promotion.PromotionCreateRequest;
import com.promorural.api.core.application.dto.merchant.promotion.PromotionMerchantResponse;
import com.promorural.api.core.application.dto.merchant.shop.ProductImageResponse;
import com.promorural.api.core.application.dto.merchant.shop.ShopMerchantResponse;
import com.promorural.api.core.application.dto.merchant.shop.ShopUpdateRequest;
import com.promorural.api.core.application.service.MerchantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/merchant")
@PreAuthorize("hasAuthority('ROLE_MERCHANT')")
public class MerchantController {

    @Autowired
    private MerchantService merchantService;

    @GetMapping("/my-shop")
    public ResponseEntity<ShopMerchantResponse> getMyShop() {
        try {
            ShopMerchantResponse shopDto = merchantService.getShopForMerchant();
            return ResponseEntity.ok(shopDto);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/my-shop")
    public ResponseEntity<ShopMerchantResponse> updateMyShop(@RequestBody ShopUpdateRequest shopUpdateDto) {
        try {
            ShopMerchantResponse updatedShopDto = merchantService.updateShopForMerchant(shopUpdateDto);
            return ResponseEntity.ok(updatedShopDto);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/promotions")
    public ResponseEntity<List<PromotionMerchantResponse>> getMyPromotions() {
        try {
            List<PromotionMerchantResponse> promotionsDto = merchantService.getMerchantPromotions();
            return ResponseEntity.ok(promotionsDto);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/promotions")
    public ResponseEntity<PromotionMerchantResponse> createPromotion(@RequestBody PromotionCreateRequest promotionCreateDto) {
        try {
            PromotionMerchantResponse createdPromotionDto = merchantService.createMerchantPromotion(promotionCreateDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPromotionDto);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/promotions/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable("id") Long promotionId) {
        try {
            merchantService.deleteMerchantPromotion(promotionId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Promotion not found.")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            } else if (e.getMessage().equals("Promotion does not belong to this merchant.")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
    }

    @PostMapping("/my-shop/images")
    public ResponseEntity<ProductImageResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            ProductImageResponse imageResponse = merchantService.uploadImageForShop(file);
            return ResponseEntity.status(HttpStatus.CREATED).body(imageResponse);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/my-shop/images/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable("id") Long imageId) {
        try {
            merchantService.deleteImageForShop(imageId);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Image not found.")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}