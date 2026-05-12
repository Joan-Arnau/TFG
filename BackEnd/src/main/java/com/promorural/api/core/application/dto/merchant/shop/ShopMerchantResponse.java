package com.promorural.api.core.application.dto.merchant.shop;

import com.promorural.api.core.application.dto.admin.CategoryRef;
import java.util.Map;

public record ShopMerchantResponse(
        Long id,
        Map<String, String> name,
        Map<String, String> description,
        String address,
        String phoneNumber,
        String headerImageUrl,
        CategoryRef category,
        Double latitude,
        Double longitude
) {}