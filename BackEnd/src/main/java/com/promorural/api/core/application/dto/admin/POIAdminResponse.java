package com.promorural.api.core.application.dto.admin;

import java.util.Map;

public record POIAdminResponse(
        Long id,
        Map<String, String> name,
        Map<String, String> description,
        String imageUrl,
        CategoryRef category,
        Double latitude,
        Double longitude
) {}