package com.promorural.api.infrastructure.controller.merchant;

import com.promorural.api.core.application.dto.guest.CategoryResponse;
import com.promorural.api.core.application.dto.merchant.promotion.PromotionCreateRequest;
import com.promorural.api.core.application.dto.merchant.promotion.PromotionMerchantResponse;
import com.promorural.api.core.application.dto.merchant.shop.ProductImageResponse;
import com.promorural.api.core.application.dto.merchant.shop.ShopMerchantResponse;
import com.promorural.api.core.application.dto.merchant.shop.ShopUpdateRequest;
import com.promorural.api.core.application.dto.merchant.shop.UploadFileResponse;
import com.promorural.api.core.application.service.use_case.merchant.ProductImageUseCase;
import com.promorural.api.core.application.service.use_case.merchant.PromotionUseCase;
import com.promorural.api.core.application.service.use_case.merchant.ShopProfileUseCase;
import com.promorural.api.core.application.service.use_case.publicapi.PublicUseCase;
import com.promorural.api.core.application.validation.ValidationGroups;
import com.promorural.api.core.domain.entity.CategoryType;
import com.promorural.api.core.domain.exception.FileStorageException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.promorural.api.core.application.dto.FileData;

import java.util.List;

@RestController
@RequestMapping("/api/merchant")
@PreAuthorize("hasAuthority('ROLE_MERCHANT')")
public class MerchantController {

    private static final Logger log = LoggerFactory.getLogger(MerchantController.class);

    private final ShopProfileUseCase shopProfileUseCase;
    private final PromotionUseCase promotionUseCase;
    private final ProductImageUseCase productImageUseCase;
    private final PublicUseCase publicUseCase;

    public MerchantController(ShopProfileUseCase shopProfileUseCase,
                               PromotionUseCase promotionUseCase,
                               ProductImageUseCase productImageUseCase,
                               PublicUseCase publicUseCase) {
        this.shopProfileUseCase = shopProfileUseCase;
        this.promotionUseCase = promotionUseCase;
        this.productImageUseCase = productImageUseCase;
        this.publicUseCase = publicUseCase;
    }

    @GetMapping("/my-shop")
    public ResponseEntity<ShopMerchantResponse> getMyShop() {
        return ResponseEntity.ok(shopProfileUseCase.getMyShop());
    }

    @PutMapping("/my-shop")
    public ResponseEntity<ShopMerchantResponse> updateMyShop(
            @Validated(ValidationGroups.Update.class) @RequestBody ShopUpdateRequest shopUpdateDto) {
        return ResponseEntity.ok(shopProfileUseCase.updateMyShop(shopUpdateDto));
    }

    @GetMapping("/promotions")
    public ResponseEntity<List<PromotionMerchantResponse>> getMyPromotions() {
        return ResponseEntity.ok(promotionUseCase.getMyPromotions());
    }

    @PostMapping("/promotions")
    public ResponseEntity<PromotionMerchantResponse> createPromotion(
            @Validated(ValidationGroups.Create.class) @RequestBody PromotionCreateRequest promotionCreateDto) {
        PromotionMerchantResponse createdPromotionDto = promotionUseCase.create(promotionCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPromotionDto);
    }

    @DeleteMapping("/promotions/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable("id") Long promotionId) {
        promotionUseCase.delete(promotionId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/my-shop/images")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        log.info("POST /api/merchant/my-shop/images called - filename={}, size={}, contentType={}", file.getOriginalFilename(), file.getSize(), file.getContentType());
        try {
            FileData fd = new FileData(file.getBytes(), file.getOriginalFilename(), file.getContentType(), file.getSize());
            ProductImageResponse imageResponse = productImageUseCase.upload(fd);
            log.info("Image uploaded: id={}, imageUrl={}", imageResponse.id(), imageResponse.imageUrl());
            return ResponseEntity.status(HttpStatus.CREATED).body(imageResponse);
        } catch (java.io.IOException e) {
            throw new FileStorageException("Failed to process uploaded image", e);
        }
    }

    @GetMapping("/my-shop/images")
    public ResponseEntity<List<ProductImageResponse>> getMyShopImages() {
        return ResponseEntity.ok(productImageUseCase.getMyImages());
    }

    @PostMapping("/promotions/images")
    public ResponseEntity<?> uploadPromotionImage(@RequestParam("file") MultipartFile file) {
        log.info("POST /api/merchant/promotions/images called - filename={}, size={}, contentType={}", file.getOriginalFilename(), file.getSize(), file.getContentType());
        try {
            FileData fd = new FileData(file.getBytes(), file.getOriginalFilename(), file.getContentType(), file.getSize());
            UploadFileResponse resp = productImageUseCase.uploadPromotionImage(fd);
            log.info("Promotion image uploaded: id={}, url={}", resp.id(), resp.url());
            return ResponseEntity.status(HttpStatus.CREATED).body(resp);
        } catch (java.io.IOException e) {
            throw new FileStorageException("Failed to process promotion image", e);
        }
    }

    @GetMapping("/promotions/{id}")
    public ResponseEntity<PromotionMerchantResponse> getPromotion(@PathVariable("id") Long promotionId) {
        return ResponseEntity.ok(promotionUseCase.getById(promotionId));
    }

    @PutMapping("/promotions/{id}")
    public ResponseEntity<PromotionMerchantResponse> updatePromotion(@PathVariable("id") Long promotionId,
                                                                     @Validated(ValidationGroups.Update.class) @RequestBody PromotionCreateRequest promotionUpdateDto) {
        return ResponseEntity.ok(promotionUseCase.update(promotionId, promotionUpdateDto));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getCategories(
            @RequestParam(required = false, defaultValue = "SHOP") CategoryType type) {
        return ResponseEntity.ok(publicUseCase.getCategories(type));
    }

    @PostMapping("/my-shop/header-image")
    public ResponseEntity<?> uploadShopHeaderImage(@RequestParam("file") MultipartFile file) {
        log.info("POST /api/merchant/my-shop/header-image called - filename={}, size={}, contentType={}", file.getOriginalFilename(), file.getSize(), file.getContentType());
        try {
            FileData fd = new FileData(file.getBytes(), file.getOriginalFilename(), file.getContentType(), file.getSize());
            UploadFileResponse resp = productImageUseCase.uploadShopHeaderImage(fd);
            log.info("Shop header image uploaded: id={}, url={}", resp.id(), resp.url());
            return ResponseEntity.status(HttpStatus.CREATED).body(resp);
        } catch (java.io.IOException e) {
            throw new FileStorageException("Failed to process shop header image", e);
        }
    }

    @DeleteMapping("/my-shop/images/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable("id") Long imageId) {
        productImageUseCase.delete(imageId);
        return ResponseEntity.noContent().build();
    }
}

