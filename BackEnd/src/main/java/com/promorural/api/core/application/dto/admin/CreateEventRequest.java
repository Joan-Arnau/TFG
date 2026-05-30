package com.promorural.api.core.application.dto.admin;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.promorural.api.core.application.mapper.GeometryMapper;
import com.promorural.api.core.application.validation.ValidI18nMap;
import com.promorural.api.core.application.validation.ValidationGroups;
import com.promorural.api.core.domain.entity.Category;
import com.promorural.api.core.domain.entity.Event;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import java.time.OffsetDateTime;
import java.util.Map;
import org.locationtech.jts.geom.GeometryFactory;

public record CreateEventRequest(
    @ValidI18nMap(max = 150, required = true, groups = ValidationGroups.Create.class) Map<String, String> title,
    @ValidI18nMap(max = 4000, groups = ValidationGroups.Create.class) Map<String, String> description,
    Map<String, String> locationText,
    @NotNull(message = "{validation.event.category.required}", groups = ValidationGroups.Create.class) Long categoryId,
    boolean isFestival,
    @NotNull(groups = ValidationGroups.Create.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssZ")
    OffsetDateTime startsAt,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssZ")
    OffsetDateTime endsAt,
    @DecimalMin(value = "-90.0", groups = ValidationGroups.Create.class)
    @DecimalMax(value = "90.0", groups = ValidationGroups.Create.class)
    Double latitude,
    @DecimalMin(value = "-180.0", groups = ValidationGroups.Create.class)
    @DecimalMax(value = "180.0", groups = ValidationGroups.Create.class)
    Double longitude,
    String imageUrl // Added imageUrl field
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
     * @param event The Event entity to apply the fields to.
     * @param category The Category associated with the event.
     * @param geometryFactory The GeometryFactory to create Point objects.
     */
    public void applyToEntity(Event event, Category category, GeometryFactory geometryFactory) {
        event.setTitle(title);
        event.setDescription(description);
        event.setLocationText(locationText);
        event.setCategory(category);
        event.setIsFestival(isFestival);
        
        event.setStartsAt(startsAt);
        event.setEndsAt(endsAt);
        
        if (latitude != null && longitude != null) {
            event.setLocationGeom(createPoint(latitude, longitude, geometryFactory));
        }
    }
}
