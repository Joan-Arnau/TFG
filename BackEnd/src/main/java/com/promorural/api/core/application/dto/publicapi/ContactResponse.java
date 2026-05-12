package com.promorural.api.core.application.dto.publicapi;

import java.util.Map;

public record ContactResponse(
        Long id,
        Map<String, String> serviceName,
        String phoneNumber,
        String iconName,
        CategoryResponse category
) {}
