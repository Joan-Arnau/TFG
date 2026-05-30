package com.promorural.api.core.application.mapper;

import com.promorural.api.core.application.dto.admin.EventAdminResponse;
import com.promorural.api.core.domain.entity.Event;

public final class EventMapper {

    private EventMapper() {}

    public static EventAdminResponse toAdminResponse(Event item) {
        if (item == null) return null;
        return new EventAdminResponse(
                item.getId(),
                item.getTitle(),
                item.getDescription(),
                item.getLocationText(),
                CategoryMapper.toRef(item.getCategory()),
                item.getIsFestival(),
                item.getStartsAt(),
                item.getEndsAt(),
                item.getImageUrl(),
                item.getLocationGeom() != null ? item.getLocationGeom().getY() : null,
                item.getLocationGeom() != null ? item.getLocationGeom().getX() : null
        );
    }
}