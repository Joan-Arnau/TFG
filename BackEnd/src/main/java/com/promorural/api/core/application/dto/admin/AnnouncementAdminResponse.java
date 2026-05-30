package com.promorural.api.core.application.dto.admin;

import java.time.OffsetDateTime;
import java.util.Map;
import com.promorural.api.core.domain.entity.AnnouncementStatus;

public record AnnouncementAdminResponse(
        Long id,
        Map<String, String> title,
        Map<String, String> content,
        CategoryRef category,
        boolean urgent,
        AnnouncementStatus status,
        OffsetDateTime publishedAt
) {}