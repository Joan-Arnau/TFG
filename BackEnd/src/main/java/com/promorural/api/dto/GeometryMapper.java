package com.promorural.api.dto;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;

/**
 * Interfície auxiliar per compartir lògica de mapeig de geometria entre records.
 */
public interface GeometryMapper {
    
    default Point createPoint(Double latitude, Double longitude, GeometryFactory geometryFactory) {
        if (latitude != null && longitude != null) {
            return geometryFactory.createPoint(new Coordinate(longitude, latitude));
        }
        return null;
    }
}
