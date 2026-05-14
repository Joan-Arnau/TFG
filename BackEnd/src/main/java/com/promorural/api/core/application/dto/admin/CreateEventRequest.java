package com.promorural.api.core.application.dto.admin;

import com.promorural.api.core.application.mapper.GeometryMapper;
import com.promorural.api.core.application.validation.ValidationGroups;
import com.promorural.api.core.domain.entity.Category;
import com.promorural.api.core.domain.entity.Event;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Map;
import java.util.Optional;
import org.locationtech.jts.geom.GeometryFactory;

public record CreateEventRequest(
    @NotEmpty(message = "Title is required", groups = ValidationGroups.Create.class) Map<String, String> title,
        Map<String, String> description,
        Map<String, String> locationText,
    @NotNull(message = "CategoryId is required", groups = ValidationGroups.Create.class) Long categoryId,
        boolean festival,
        LocalDate startsAt,
        LocalDate endsAt,
        Double latitude,
        Double longitude
) implements GeometryMapper {

    /**
     * Applies fields from this DTO to the given Event entity.
     */
    public void applyToEntity(Event event, Category category, GeometryFactory geometryFactory) {
        event.setTitle(title);
        event.setDescription(description);
        event.setLocationText(locationText);
        event.setCategory(category);
        event.setFestival(festival);
        
        Optional.ofNullable(startsAt).ifPresent(date -> 
            event.setStartsAt(date.atStartOfDay().atOffset(ZoneOffset.UTC)));
        Optional.ofNullable(endsAt).ifPresent(date -> 
            event.setEndsAt(date.atStartOfDay().atOffset(ZoneOffset.UTC)));
        
        if (latitude != null && longitude != null) {
            event.setLocationGeom(createPoint(latitude, longitude, geometryFactory));
        }
    }
}
