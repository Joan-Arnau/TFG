package com.promorural.api.dto.PublicDtos;

import java.util.List;
import java.util.Map;

public record ConfigResponse(
        String defaultLanguage,
        List<String> supportedLanguages,
        Map<String, String> branding,
        Double latitude,
        Double longitude
) {}
