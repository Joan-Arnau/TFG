package com.promorural.api.core.application.dto.admin;

import com.promorural.api.core.application.mapper.GeometryMapper;
import com.promorural.api.core.application.validation.ValidI18nMap;
import com.promorural.api.core.application.validation.ValidationGroups;
import com.promorural.api.core.domain.entity.Category;
import com.promorural.api.core.domain.entity.Event;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Map;
import java.util.Optional;
import org.locationtech.jts.geom.GeometryFactory;

public record CreateEventRequest(
    @ValidI18nMap(max = 150, required = true, groups = ValidationGroups.Create.class) Map<String, String> title,
        @ValidI18nMap(max = 4000, groups = ValidationGroups.Create.class)
        Map<String, String> description,
        Map<String, String> locationText,
    @NotNull(message = "CategoryId is required", groups = ValidationGroups.Create.class) Long categoryId,
        boolean festival,
        @NotNull(groups = ValidationGroups.Create.class)
        LocalDate startsAt,
        @NotNull(groups = ValidationGroups.Create.class)
        LocalDate endsAt,
        @DecimalMin(value = "-90.0", groups = ValidationGroups.Create.class)
        @DecimalMax(value = "90.0", groups = ValidationGroups.Create.class)
        Double latitude,
        @DecimalMin(value = "-180.0", groups = ValidationGroups.Create.class)
        @DecimalMax(value = "180.0", groups = ValidationGroups.Create.class)
        Double longitude
) implements GeometryMapper {
    @AssertTrue(message = "{validation.location.pair}", groups = ValidationGroups.Create.class)
    public boolean isLocationPairValid() {
        return (latitude == null && longitude == null) || (latitude != null && longitude != null);
    }

    @AssertTrue(message = "{validation.date.range}", groups = ValidationGroups.Create.class)
    public boolean isDateRangeValid() {
        return startsAt == null || endsAt == null || endsAt.isAfter(startsAt);
    }

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
