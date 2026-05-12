package com.promorural.api.core.application.mapper;

import com.promorural.api.core.application.dto.admin.POIAdminResponse;
import com.promorural.api.core.application.dto.guest.PointOfInterestResponse;
import com.promorural.api.core.domain.entity.PointOfInterest;

public final class PointOfInterestMapper {

    private PointOfInterestMapper() {}

    public static POIAdminResponse toAdminResponse(PointOfInterest poi) {
        if (poi == null) return null;
        return new POIAdminResponse(
                poi.getId(),
                poi.getName(),
                poi.getDescription(),
                poi.getImageUrl(),
                CategoryMapper.toRef(poi.getCategory()),
                poi.getLocation() != null ? poi.getLocation().getY() : null,
                poi.getLocation() != null ? poi.getLocation().getX() : null
        );
    }

    public static PointOfInterestResponse toGuestResponse(PointOfInterest poi) {
        if (poi == null) return null;
        return new PointOfInterestResponse(
                poi.getId(),
                poi.getName(),
                poi.getDescription(),
                poi.getImageUrl(),
                CategoryMapper.toGuestResponse(poi.getCategory()),
                poi.getLocation() != null ? poi.getLocation().getY() : null,
                poi.getLocation() != null ? poi.getLocation().getX() : null
        );
    }
}