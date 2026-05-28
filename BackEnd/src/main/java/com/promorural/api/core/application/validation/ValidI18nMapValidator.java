package com.promorural.api.core.application.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Map;
import java.util.Set;

public class ValidI18nMapValidator implements ConstraintValidator<ValidI18nMap, Map<String, String>> {

    private static final Set<String> REQUIRED_LANGUAGES = Set.of("ca", "es", "en");

    private int max;
    private boolean required;

    @Override
    public void initialize(ValidI18nMap constraintAnnotation) {
        this.max = constraintAnnotation.max();
        this.required = constraintAnnotation.required();
    }

    @Override
    public boolean isValid(Map<String, String> value, ConstraintValidatorContext context) {
        if (value == null) {
            return !required;
        }
        if (required && value.isEmpty()) {
            return false;
        }

        if (required) {
            for (String language : REQUIRED_LANGUAGES) {
                String translation = value.get(language);
                if (translation == null || translation.isBlank()) {
                    return false;
                }
            }
        }

        return value.values().stream()
                .allMatch(translation -> translation == null || translation.length() <= max);
    }
}
