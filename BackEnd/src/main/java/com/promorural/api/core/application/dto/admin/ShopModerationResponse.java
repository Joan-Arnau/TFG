package com.promorural.api.core.application.dto.admin;

import java.util.Map;

public record ShopModerationResponse(
        Long id,
        Map<String, String> name,
        Map<String, String> description,
        String address,
        String phoneNumber,
        String headerImageUrl,
        String status,
        String ownerEmail,
        CategoryRef category,
        Double latitude,
        Double longitude
) {}