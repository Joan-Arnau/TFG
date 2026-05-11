package com.promorural.api.dto.MerchantDtos;

import com.promorural.api.entity.Promotion;
import com.promorural.api.entity.Shop;
import java.time.OffsetDateTime;
import java.util.Map;

public record CreatePromotionRequest(
    Map<String, String> title,
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
