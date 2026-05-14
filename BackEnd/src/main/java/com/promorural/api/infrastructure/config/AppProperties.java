package com.promorural.api.infrastructure.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
        String defaultLanguage,
        List<String> supportedLanguages,
        JwtProperties jwt
) {
    public record JwtProperties(String secret, Long expirationMs) {}
}
