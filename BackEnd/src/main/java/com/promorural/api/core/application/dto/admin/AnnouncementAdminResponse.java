package com.promorural.api.core.application.dto.admin;

import java.time.OffsetDateTime;
import java.util.Map;

public record AnnouncementAdminResponse(
        Long id,
        Map<String, String> title,
        Map<String, String> content,
        CategoryRef category,
        boolean urgent,
        OffsetDateTime publishedAt
) {}