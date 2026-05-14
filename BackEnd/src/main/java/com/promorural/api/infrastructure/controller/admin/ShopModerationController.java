package com.promorural.api.infrastructure.controller.admin;

import com.promorural.api.core.application.dto.admin.ShopModerationResponse;
import com.promorural.api.core.application.dto.admin.moderation.ShopStatusUpdateRequest;
import com.promorural.api.core.application.service.use_case.admin.ShopModerationUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.promorural.api.core.application.validation.ValidationGroups;

import java.util.List;

@RestController
@RequestMapping("/api/admin/shops")
@PreAuthorize("hasRole('ADMIN')")
public class ShopModerationController {

    private final ShopModerationUseCase shopModerationUseCase;

    public ShopModerationController(ShopModerationUseCase shopModerationUseCase) {
        this.shopModerationUseCase = shopModerationUseCase;
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ShopModerationResponse>> getPendingShops() {
        return ResponseEntity.ok(shopModerationUseCase.getPendingShops());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateShopStatus(@PathVariable Long id,
                                                  @Validated(ValidationGroups.Update.class) @RequestBody ShopStatusUpdateRequest request) {
        shopModerationUseCase.updateShopStatus(id, request);
        return ResponseEntity.ok().build();
    }
}