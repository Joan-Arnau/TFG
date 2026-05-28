package com.promorural.api.core.application.mapper;

import com.promorural.api.core.application.dto.admin.ShopModerationResponse;
import com.promorural.api.core.application.dto.merchant.shop.ShopMerchantResponse;
import com.promorural.api.core.domain.entity.Shop;

public final class ShopMapper {

    private ShopMapper() {}

    public static ShopModerationResponse toModerationResponse(Shop shop) {
        if (shop == null) return null;
        return new ShopModerationResponse(
                shop.getId(),
                shop.getName(),
                shop.getDescription(),
                shop.getAddress(),
                shop.getPhoneNumber(),
                shop.getHeaderImageUrl(),
                shop.getStatus().name(),
                shop.getOwner() != null ? shop.getOwner().getUsername() : null,
                CategoryMapper.toRef(shop.getCategory()),
                shop.getLocation() != null ? shop.getLocation().getY() : null,
                shop.getLocation() != null ? shop.getLocation().getX() : null
        );
    }

    public static ShopMerchantResponse toMerchantResponse(Shop shop) {
        if (shop == null) return null;
        return new ShopMerchantResponse(
                shop.getId(),
                shop.getName(),
                shop.getDescription(),
                shop.getAddress(),
                shop.getPhoneNumber(),
                shop.getHeaderImageUrl(),
                CategoryMapper.toRef(shop.getCategory()),
                shop.getLocation() != null ? shop.getLocation().getY() : null,
            shop.getLocation() != null ? shop.getLocation().getX() : null,
            shop.getStatus()
        );
    }
}