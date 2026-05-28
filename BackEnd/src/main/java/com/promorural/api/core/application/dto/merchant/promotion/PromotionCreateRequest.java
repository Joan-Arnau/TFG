package com.promorural.api.core.application.dto.merchant.promotion;

import com.promorural.api.core.application.validation.ValidationGroups;
import com.promorural.api.core.application.validation.ValidI18nMap;
import com.promorural.api.core.domain.entity.Promotion;
import com.promorural.api.core.domain.entity.Shop;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.Map;

public record PromotionCreateRequest(
    @ValidI18nMap(max = 100, required = true, groups = {ValidationGroups.Create.class, ValidationGroups.Update.class})
    Map<String, String> title,
    @ValidI18nMap(max = 2000, groups = {ValidationGroups.Create.class, ValidationGroups.Update.class})
    Map<String, String> description,
    @NotNull(groups = {ValidationGroups.Create.class, ValidationGroups.Update.class})
    OffsetDateTime startsAt,
    @NotNull(groups = {ValidationGroups.Create.class, ValidationGroups.Update.class})
    OffsetDateTime endsAt,
    @Size(max = 500, groups = {ValidationGroups.Create.class, ValidationGroups.Update.class})
    String imageUrl
) {
    @AssertTrue(message = "{validation.date.range}", groups = {ValidationGroups.Create.class, ValidationGroups.Update.class})
    public boolean isDateRangeValid() {
        return startsAt == null || endsAt == null || endsAt.isAfter(startsAt);
    }

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
