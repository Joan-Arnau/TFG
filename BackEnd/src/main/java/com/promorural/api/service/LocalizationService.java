package com.promorural.api.service;

import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class LocalizationService {

    public String resolveLocalizedText(Map<String, String> values, Locale requestLocale, String defaultLanguage) {
        if (values == null || values.isEmpty()) {
            return "";
        }

        String requestedLanguage = requestLocale != null ? requestLocale.getLanguage() : null;
        if (requestedLanguage != null && values.containsKey(requestedLanguage)) {
            return values.get(requestedLanguage);
        }
        if (values.containsKey(defaultLanguage)) {
            return values.get(defaultLanguage);
        }
        return values.values().stream().findFirst().orElse("");
    }
}
