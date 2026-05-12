package com.promorural.api.core.application.dto.merchant;

import java.time.OffsetDateTime;

public record ProductImageResponse(
    Long id,
    String imageUrl,
    OffsetDateTime uploadedAt
) {}
