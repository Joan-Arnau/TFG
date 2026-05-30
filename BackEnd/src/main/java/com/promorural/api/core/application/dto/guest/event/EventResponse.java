package com.promorural.api.core.application.dto.guest.event;

import com.promorural.api.core.application.dto.guest.CategoryResponse;
import java.time.OffsetDateTime;
import java.util.Map;

public record EventResponse(
        Long id,
        Map<String, String> title,
        Map<String, String> description,
        Map<String, String> locationText,
        CategoryResponse category,
        boolean isFestival,
        OffsetDateTime startsAt,
        OffsetDateTime endsAt,
        String imageUrl,
        Double latitude,
        Double longitude
) {}