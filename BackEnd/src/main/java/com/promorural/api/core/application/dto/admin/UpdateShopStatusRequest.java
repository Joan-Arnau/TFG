package com.promorural.api.core.application.dto.admin;

import com.promorural.api.core.domain.entity.ShopStatus;

public record UpdateShopStatusRequest(
        ShopStatus status
) {}
