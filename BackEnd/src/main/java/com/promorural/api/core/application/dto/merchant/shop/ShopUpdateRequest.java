package com.promorural.api.core.application.dto.merchant.shop;

import java.util.Map;
import com.promorural.api.core.application.validation.ValidI18nMap;
import com.promorural.api.core.application.validation.ValidationGroups;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ShopUpdateRequest(
    @ValidI18nMap(max = 100, required = true, groups = ValidationGroups.Update.class)
    Map<String, String> name,
    @ValidI18nMap(max = 2000, groups = ValidationGroups.Update.class)
    Map<String, String> description,
    @Size(max = 255, groups = ValidationGroups.Update.class) String address,
    @Size(max = 20, groups = ValidationGroups.Update.class) 
    @Pattern(regexp = "^[+0-9 ]*$", message = "{validation.phone.format}", groups = ValidationGroups.Update.class)
    String phoneNumber,
    @Positive(groups = ValidationGroups.Update.class) Long categoryId,
    @DecimalMin(value = "-90.0", groups = ValidationGroups.Update.class)
    @DecimalMax(value = "90.0", groups = ValidationGroups.Update.class)
    Double latitude,
    @DecimalMin(value = "-180.0", groups = ValidationGroups.Update.class)
    @DecimalMax(value = "180.0", groups = ValidationGroups.Update.class)
    Double longitude
) {
    @AssertTrue(message = "{validation.location.pair}", groups = ValidationGroups.Update.class)
    public boolean isLocationPairValid() {
        return (latitude == null && longitude == null) || (latitude != null && longitude != null);
    }

    public boolean hasLocation() {
        return latitude != null && longitude != null;
    }

    public boolean hasCategory() {
        return categoryId != null;
    }
}
