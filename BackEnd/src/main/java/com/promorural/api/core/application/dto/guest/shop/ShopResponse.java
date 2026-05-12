package com.promorural.api.core.application.dto.guest.shop;

import com.promorural.api.core.application.dto.guest.CategoryResponse;
import java.util.Map;

public record ShopResponse(
        Long id,
        Map<String, String> name,
        Map<String, String> description,
        String address,
        String phoneNumber,
        String headerImageUrl,
        CategoryResponse category,
        Double latitude,
        Double longitude
) {}