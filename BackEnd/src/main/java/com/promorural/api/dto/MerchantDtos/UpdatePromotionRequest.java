package com.promorural.api.dto.MerchantDtos;

import com.promorural.api.entity.Promotion;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.Optional;

public record UpdatePromotionRequest(
    Map<String, String> title,
    Map<String, String> description,
    OffsetDateTime startsAt,
    OffsetDateTime endsAt,
    String imageUrl
) {
    /**
     * Updates an existing Promotion entity with non-null fields.
     */
    public void updateEntity(Promotion promotion) {
        Optional.ofNullable(title).ifPresent(promotion::setTitle);
        Optional.ofNullable(description).ifPresent(promotion::setDescription);
        Optional.ofNullable(startsAt).ifPresent(promotion::setStartsAt);
        Optional.ofNullable(endsAt).ifPresent(promotion::setEndsAt);
        Optional.ofNullable(imageUrl).ifPresent(promotion::setImageUrl);
    }
}
