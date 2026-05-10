package com.promorural.api.dto.MerchantDtos;

import java.time.OffsetDateTime;

public record ProductImageResponse(
    Long id,
    String imageUrl,
    OffsetDateTime uploadedAt
) {}
