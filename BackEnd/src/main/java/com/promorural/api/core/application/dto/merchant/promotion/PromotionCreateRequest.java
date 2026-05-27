package com.promorural.api.core.application.dto.merchant.promotion;

import com.promorural.api.core.application.validation.ValidationGroups;
import com.promorural.api.core.domain.entity.Promotion;
import com.promorural.api.core.domain.entity.Shop;
import jakarta.validation.constraints.NotEmpty;
import java.time.OffsetDateTime;
import java.util.Map;

public record PromotionCreateRequest(
    @NotEmpty(message = "Title is required", groups = {ValidationGroups.Create.class, ValidationGroups.Update.class}) Map<String, String> title,
    Map<String, String> description,
    OffsetDateTime startsAt,
    OffsetDateTime endsAt,
    String imageUrl
) {
    /**
     * Applies fields from this DTO to a new Promotion entity.
     */
    public void applyToEntity(Promotion promotion, Shop shop) {
        promotion.setTitle(title);
        promotion.setDescription(description);
        promotion.setStartsAt(startsAt);
        promotion.setEndsAt(endsAt);
        promotion.setImageUrl(imageUrl);
        promotion.setShop(shop);
    }
}