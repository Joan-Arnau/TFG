package com.promorural.api.controller;

import com.promorural.api.dto.MerchantDtos.ProductImageResponse;
import com.promorural.api.dto.MerchantDtos.PromotionCreateDto;
import com.promorural.api.dto.MerchantDtos.ShopUpdateDto;
import com.promorural.api.dto.PublicDtos.PromotionResponse;
import com.promorural.api.dto.PublicDtos.ShopResponse;
import com.promorural.api.service.MerchantService;
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

    /**
     * Get the shop associated with the authenticated merchant, returned as ShopResponse DTO.
     * @return ResponseEntity with ShopResponse details or an error.
     */
    @GetMapping("/my-shop")
    public ResponseEntity<ShopResponse> getMyShop() {
        try {
            ShopResponse shopDto = merchantService.getShopForMerchant();
            return ResponseEntity.ok(shopDto);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Update the shop associated with the authenticated merchant.
     * @param shopUpdateDto The DTO containing updated shop information.
     * @return ResponseEntity with the updated ShopResponse DTO or an error.
     */
    @PutMapping("/my-shop")
    public ResponseEntity<ShopResponse> updateMyShop(@RequestBody ShopUpdateDto shopUpdateDto) {
        try {
            ShopResponse updatedShopDto = merchantService.updateShopForMerchant(shopUpdateDto);
            return ResponseEntity.ok(updatedShopDto);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Get all promotions associated with the authenticated merchant's shop, returned as PromotionResponse DTOs.
     * @return ResponseEntity with a list of PromotionResponse DTOs or an empty list.
     */
    @GetMapping("/promotions")
    public ResponseEntity<List<PromotionResponse>> getMyPromotions() {
        try {
            List<PromotionResponse> promotionsDto = merchantService.getMerchantPromotions();
            return ResponseEntity.ok(promotionsDto);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Create a new promotion for the authenticated merchant's shop.
     * @param promotionCreateDto The DTO containing the new promotion details.
     * @return ResponseEntity with the created PromotionResponse DTO or an error.
     */
    @PostMapping("/promotions")
    public ResponseEntity<PromotionResponse> createPromotion(@RequestBody PromotionCreateDto promotionCreateDto) {
        try {
            PromotionResponse createdPromotionDto = merchantService.createMerchantPromotion(promotionCreateDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPromotionDto);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Delete a promotion associated with the authenticated merchant's shop.
     * @param promotionId The ID of the promotion to delete.
     * @return ResponseEntity indicating success or failure.
     */
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

    /**
     * Uploads a new image to the authenticated merchant's shop gallery.
     * @param file The image file to upload.
     * @return ResponseEntity with the ProductImageResponse DTO of the uploaded image.
     */
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

    /**
     * Deletes an image from the authenticated merchant's shop gallery.
     * @param imageId The ID of the image to delete.
     * @return ResponseEntity indicating success or failure.
     */
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
