package com.promorural.api.dto.PublicDtos;

import java.util.Map;

public record ContactResponse(
        Long id,
        Map<String, String> serviceName,
        String phoneNumber,
        String iconName,
        CategoryResponse category
) {}
