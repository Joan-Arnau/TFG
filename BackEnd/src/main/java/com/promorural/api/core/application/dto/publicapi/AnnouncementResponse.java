package com.promorural.api.core.application.dto.publicapi;

import java.time.OffsetDateTime;
import java.util.Map;

public record AnnouncementResponse(
        Long id,
        Map<String, String> title,
        Map<String, String> content,
        CategoryResponse category,
        boolean urgent,
        OffsetDateTime publishedAt
) {}
