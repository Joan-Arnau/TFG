package com.promorural.api.core.application.dto.admin.config;

import com.promorural.api.core.application.mapper.GeometryMapper;
import com.promorural.api.core.domain.entity.MunicipalityConfig;
import org.locationtech.jts.geom.GeometryFactory;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public record ConfigUpdateRequest(
        Map<String, String> branding,
        String defaultLanguage,
        List<String> supportedLanguages,
        Double latitude,
        Double longitude
) implements GeometryMapper {

    /**
     * Updates the given MunicipalityConfig entity with non-null values from this DTO.
     */
    public void updateEntity(MunicipalityConfig config, GeometryFactory geometryFactory) {
        Optional.ofNullable(branding).ifPresent(config::setBranding);
        Optional.ofNullable(defaultLanguage).ifPresent(config::setDefaultLanguage);
        Optional.ofNullable(supportedLanguages).ifPresent(config::setSupportedLanguages);
        
        if (latitude != null && longitude != null) {
            config.setLocation(createPoint(latitude, longitude, geometryFactory));
        }
    }
}