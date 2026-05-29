package com.promorural.api.core.application.dto.admin.moderation;

import com.promorural.api.core.application.validation.ValidationGroups;
import com.promorural.api.core.domain.entity.ShopStatus;
import jakarta.validation.constraints.NotNull;

public record ShopStatusUpdateRequest(
        @NotNull(message = "Status is required", groups = ValidationGroups.Update.class) ShopStatus status,
        String rejectionReason
) {}