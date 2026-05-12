package com.promorural.api.core.application.dto.merchant.promotion;

import java.time.OffsetDateTime;
import java.util.Map;

public record PromotionMerchantResponse(
        Long id,
        Long shopId,
        Map<String, String> title,
        Map<String, String> description,
        String imageUrl,
        OffsetDateTime startsAt,
        OffsetDateTime endsAt
) {}