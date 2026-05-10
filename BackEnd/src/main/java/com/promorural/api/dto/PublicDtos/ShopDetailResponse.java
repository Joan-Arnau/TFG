package com.promorural.api.dto.PublicDtos;

import java.util.List;
import java.util.Map;

public record ShopDetailResponse(
        Long id,
        Map<String, String> name,
        Map<String, String> description,
        String address,
        String phoneNumber,
        String headerImageUrl,
        CategoryResponse category,
        Double latitude,
        Double longitude,
        List<PromotionResponse> promotions
) {}
