package com.promorural.api.core.application.dto.publicapi;

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
