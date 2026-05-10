package com.promorural.api.controller;

import com.promorural.api.dto.MerchantDtos;
import com.promorural.api.entity.Promotion;
import com.promorural.api.entity.Shop;
import com.promorural.api.service.MerchantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/merchant")
@PreAuthorize("hasAuthority('ROLE_MERCHANT')")
public class MerchantController {

    @Autowired
    private MerchantService merchantService;

    /**
     * Get the shop associated with the authenticated merchant.
     * @return ResponseEntity with the shop details or an error.
     */
    @GetMapping("/my-shop")
    public ResponseEntity<Shop> getMyShop() {
        try {
            Shop shop = merchantService.getShopForMerchant();
            return ResponseEntity.ok(shop);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    /**
     * Update the shop associated with the authenticated merchant.
     * @param shopUpdateDto The DTO containing updated shop information.
     * @return ResponseEntity with the updated shop details or an error.
     */
    @PutMapping("/my-shop")
    public ResponseEntity<Shop> updateMyShop(@RequestBody MerchantDtos.ShopUpdateDto shopUpdateDto) {
        try {
            Shop updatedShop = merchantService.updateShopForMerchant(shopUpdateDto);
            return ResponseEntity.ok(updatedShop);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Get all promotions associated with the authenticated merchant's shop.
     * @return ResponseEntity with a list of promotions or an empty list.
     */
    @GetMapping("/promotions")
    public ResponseEntity<List<Promotion>> getMyPromotions() {
        try {
            List<Promotion> promotions = merchantService.getMerchantPromotions();
            return ResponseEntity.ok(promotions);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Create a new promotion for the authenticated merchant's shop.
     * @param promotionCreateDto The DTO containing the new promotion details.
     * @return ResponseEntity with the created promotion or an error.
     */
    @PostMapping("/promotions")
    public ResponseEntity<Promotion> createPromotion(@RequestBody MerchantDtos.PromotionCreateDto promotionCreateDto) {
        try {
            Promotion createdPromotion = merchantService.createMerchantPromotion(promotionCreateDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPromotion);
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
}
