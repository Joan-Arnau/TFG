package com.promorural.api.core.application.dto.publicapi;

import java.util.Map;

public record CategoryResponse(
        Long id,
        Map<String, String> name,
        String type
) {}
