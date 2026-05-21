package com.promorural.api.core.application.dto.admin;

import java.time.OffsetDateTime;
import java.util.Map;

public record EventAdminResponse(
        Long id,
        Map<String, String> title,
        Map<String, String> description,
        Map<String, String> locationText,
        CategoryRef category,
        boolean festival,
        OffsetDateTime startsAt,
        OffsetDateTime endsAt,
        String imageUrl,
        Double latitude,
        Double longitude
) {}