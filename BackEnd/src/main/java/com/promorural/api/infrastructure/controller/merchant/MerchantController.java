package com.promorural.api.infrastructure.controller.merchant;

import com.promorural.api.core.application.dto.merchant.promotion.PromotionCreateRequest;
import com.promorural.api.core.application.dto.merchant.promotion.PromotionMerchantResponse;
import com.promorural.api.core.application.dto.merchant.shop.ProductImageResponse;
import com.promorural.api.core.application.dto.merchant.shop.ShopMerchantResponse;
import com.promorural.api.core.application.dto.merchant.shop.ShopUpdateRequest;
import com.promorural.api.core.application.service.use_case.merchant.ProductImageUseCase;
import com.promorural.api.core.application.service.use_case.merchant.PromotionUseCase;
import com.promorural.api.core.application.service.use_case.merchant.ShopProfileUseCase;
import com.promorural.api.core.application.service.MerchantService;
import com.promorural.api.core.application.dto.merchant.shop.UploadFileResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.promorural.api.core.application.validation.ValidationGroups;

import java.util.List;

@RestController
@RequestMapping("/api/merchant")
@PreAuthorize("hasAuthority('ROLE_MERCHANT')")
public class MerchantController {

    private final ShopProfileUseCase shopProfileUseCase;
    private final PromotionUseCase promotionUseCase;
    private final ProductImageUseCase productImageUseCase;
    private final MerchantService merchantService;

    public MerchantController(ShopProfileUseCase shopProfileUseCase,
                               PromotionUseCase promotionUseCase,
                               ProductImageUseCase productImageUseCase,
                               MerchantService merchantService) {
        this.shopProfileUseCase = shopProfileUseCase;
        this.promotionUseCase = promotionUseCase;
        this.productImageUseCase = productImageUseCase;
        this.merchantService = merchantService;
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
    public ResponseEntity<ProductImageResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        ProductImageResponse imageResponse = productImageUseCase.upload(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(imageResponse);
    }

    @PostMapping("/promotions/images")
    public ResponseEntity<UploadFileResponse> uploadPromotionImage(@RequestParam("file") MultipartFile file) {
        UploadFileResponse resp = merchantService.uploadPromotionImage(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @PostMapping("/my-shop/header-image")
    public ResponseEntity<UploadFileResponse> uploadShopHeaderImage(@RequestParam("file") MultipartFile file) {
        UploadFileResponse resp = merchantService.uploadShopHeaderImage(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @DeleteMapping("/my-shop/images/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable("id") Long imageId) {
        productImageUseCase.delete(imageId);
        return ResponseEntity.noContent().build();
    }
}
