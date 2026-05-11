package com.promorural.api.dto.AdminDtos;

import com.promorural.api.dto.GeometryMapper;
import com.promorural.api.entity.Category;
import com.promorural.api.entity.PointOfInterest;
import jakarta.validation.constraints.NotBlank;
import java.util.Map;
import java.util.Optional;
import org.locationtech.jts.geom.GeometryFactory;

public record PointOfInterestRequest(
        @NotBlank(message = "Name is required") Map<String, String> name,
        Map<String, String> description,
        String imageUrl,
        Long categoryId,
        Double latitude,
        Double longitude
) implements GeometryMapper {

    /**
     * Updates the given PointOfInterest entity with fields from this DTO.
     */
    public void updateEntity(PointOfInterest poi, Category category, GeometryFactory geometryFactory) {
        Optional.ofNullable(name).ifPresent(poi::setName);
        Optional.ofNullable(description).ifPresent(poi::setDescription);
        Optional.ofNullable(imageUrl).ifPresent(poi::setImageUrl);
        Optional.ofNullable(category).ifPresent(poi::setCategory);
        
        if (latitude != null && longitude != null) {
            poi.setLocation(createPoint(latitude, longitude, geometryFactory));
        } else if (latitude == null && longitude == null) {
            poi.setLocation(null);
        }
    }
}
