package com.promorural.api.dto.AdminDtos;

import java.util.List;
import java.util.Map;

public record UpdateConfigRequest(
        Map<String, String> branding,
        String defaultLanguage,
        List<String> supportedLanguages,
        Double latitude,
        Double longitude
) {}
