package com.promorural.api.dto.PublicDtos;

import java.util.Map;

public record PointOfInterestResponse(
        Long id,
        Map<String, String> name,
        Map<String, String> description,
        String imageUrl,
        CategoryResponse category,
        Double latitude,
        Double longitude
) {}
