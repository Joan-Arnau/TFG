package com.promorural.api.core.application.dto.admin.config;

import com.promorural.api.core.application.mapper.GeometryMapper;
import com.promorural.api.core.application.validation.ValidationGroups;
import com.promorural.api.core.domain.entity.MunicipalityConfig;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import org.locationtech.jts.geom.GeometryFactory;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

public record ConfigUpdateRequest(
        @Size(max = 100, message = "{validation.municipalityName.length}", groups = ValidationGroups.Update.class)
        String municipalityName,
        Map<String, String> branding,
        @Size(max = 10, groups = ValidationGroups.Update.class)
        String defaultLanguage,
        List<String> supportedLanguages,
        @DecimalMin(value = "-90.0", groups = ValidationGroups.Update.class)
        @DecimalMax(value = "90.0", groups = ValidationGroups.Update.class)
        Double latitude,
        @DecimalMin(value = "-180.0", groups = ValidationGroups.Update.class)
        @DecimalMax(value = "180.0", groups = ValidationGroups.Update.class)
        Double longitude
) implements GeometryMapper {
    private static final String HEX_COLOR = "^#([A-Fa-f0-9]{6})$";

    @AssertTrue(message = "{validation.location.pair}", groups = ValidationGroups.Update.class)
    public boolean isLocationPairValid() {
        return (latitude == null && longitude == null) || (latitude != null && longitude != null);
    }

    @AssertTrue(message = "{validation.color.hex}", groups = ValidationGroups.Update.class)
    public boolean isPrimaryColorValid() {
        return isMissingOrMatches("primaryColor", HEX_COLOR);
    }

    @AssertTrue(message = "{validation.color.hex}", groups = ValidationGroups.Update.class)
    public boolean isSecondaryColorValid() {
        return isMissingOrMatches("secondaryColor", HEX_COLOR);
    }

    @AssertTrue(message = "{validation.logoUrl.length}", groups = ValidationGroups.Update.class)
    public boolean isLogoUrlValid() {
        String logoUrl = branding == null ? null : branding.get("logoUrl");
        return logoUrl == null || logoUrl.length() <= 500;
    }

    private boolean isMissingOrMatches(String key, String regex) {
        String value = branding == null ? null : branding.get(key);
        return value == null || Pattern.matches(regex, value);
    }

    /**
     * Updates the given MunicipalityConfig entity with non-null values from this DTO.
     */
    public void updateEntity(MunicipalityConfig config, GeometryFactory geometryFactory) {
        Optional.ofNullable(municipalityName).ifPresent(config::setMunicipalityName);
        Optional.ofNullable(branding).ifPresent(config::setBranding);
        Optional.ofNullable(defaultLanguage).ifPresent(config::setDefaultLanguage);
        Optional.ofNullable(supportedLanguages).ifPresent(config::setSupportedLanguages);
        
        if (latitude != null && longitude != null) {
            config.setLocation(createPoint(latitude, longitude, geometryFactory));
        }
    }
}
