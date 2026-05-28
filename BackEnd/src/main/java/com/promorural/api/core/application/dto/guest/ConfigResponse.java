package com.promorural.api.core.application.dto.guest;

import java.util.List;
import java.util.Map;

public record ConfigResponse(
        String municipalityName,
        String defaultLanguage,
        List<String> supportedLanguages,
        Map<String, String> branding,
        Double latitude,
        Double longitude
) {}
