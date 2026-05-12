package com.promorural.api.core.application.dto.publicapi;

import java.time.OffsetDateTime;
import java.util.Map;

public record EventResponse(
        Long id,
        Map<String, String> title,
        Map<String, String> description,
        Map<String, String> locationText,
        CategoryResponse category,
        boolean festival,
        OffsetDateTime startsAt,
        OffsetDateTime endsAt,
        Double latitude,
        Double longitude
) {}
