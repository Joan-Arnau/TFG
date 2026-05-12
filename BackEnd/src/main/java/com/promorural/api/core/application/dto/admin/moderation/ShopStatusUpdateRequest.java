package com.promorural.api.core.application.dto.admin.moderation;

import com.promorural.api.core.domain.entity.ShopStatus;

public record ShopStatusUpdateRequest(
        ShopStatus status
) {}