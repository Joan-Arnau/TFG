package com.promorural.api.core.application.dto.merchant.promotion;

import com.promorural.api.core.application.validation.ValidI18nMap;
import com.promorural.api.core.application.validation.ValidationGroups;
import com.promorural.api.core.domain.entity.Promotion;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.Optional;

public record PromotionUpdateRequest(
    @ValidI18nMap(max = 100, required = true, groups = ValidationGroups.Update.class)
    Map<String, String> title,
    @ValidI18nMap(max = 2000, groups = ValidationGroups.Update.class)
    Map<String, String> description,
    OffsetDateTime startsAt,
    OffsetDateTime endsAt,
    @Size(max = 500, groups = ValidationGroups.Update.class)
    String imageUrl
) {
    @AssertTrue(message = "{validation.date.range}", groups = ValidationGroups.Update.class)
    public boolean isDateRangeValid() {
        return startsAt == null || endsAt == null || endsAt.isAfter(startsAt);
    }

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
