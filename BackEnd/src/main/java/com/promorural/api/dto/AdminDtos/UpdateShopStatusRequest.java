package com.promorural.api.dto.AdminDtos;

import com.promorural.api.entity.ShopStatus;

public record UpdateShopStatusRequest(
        ShopStatus status
) {}
