package com.promorural.api.core.application.service.use_case.admin;

import com.promorural.api.core.application.dto.admin.PointOfInterestCreateRequest;
import com.promorural.api.core.application.dto.admin.PointOfInterestUpdateRequest;
import com.promorural.api.core.application.dto.guest.PointOfInterestResponse;
import com.promorural.api.core.application.mapper.PointOfInterestMapper;
import com.promorural.api.core.domain.entity.Category;
import com.promorural.api.core.domain.entity.PointOfInterest;
import com.promorural.api.core.domain.exception.BadRequestException;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import com.promorural.api.core.domain.repository.CategoryRepository;
import com.promorural.api.core.domain.repository.PointOfInterestRepository;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
public class PointOfInterestUseCase {

    private final PointOfInterestRepository pointOfInterestRepository;
    private final CategoryRepository categoryRepository;
    private final GeometryFactory geometryFactory;

    public PointOfInterestUseCase(
            PointOfInterestRepository pointOfInterestRepository,
            CategoryRepository categoryRepository,
            GeometryFactory geometryFactory) {
        this.pointOfInterestRepository = pointOfInterestRepository;
        this.categoryRepository = categoryRepository;
        this.geometryFactory = geometryFactory;
    }

    public List<com.promorural.api.core.application.dto.admin.POIAdminResponse> getAll() {
        return pointOfInterestRepository.findAll().stream()
                .map(PointOfInterestMapper::toAdminResponse)
                .collect(Collectors.toList());
    }

    public PointOfInterestResponse create(PointOfInterestCreateRequest request) {
        Long categoryId = request.categoryId();
        if (categoryId == null) {
            throw new BadRequestException("CategoryId cannot be null for POI");
        }
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));
        PointOfInterest poi = new PointOfInterest();
        request.updateEntity(poi, category, geometryFactory);
        PointOfInterest savedPoi = pointOfInterestRepository.save(poi);
        return PointOfInterestMapper.toGuestResponse(savedPoi);
    }

    public PointOfInterestResponse update(Long id, PointOfInterestUpdateRequest request) {
        if (id == null) {
            throw new BadRequestException("Point of Interest ID cannot be null");
        }
        PointOfInterest poi = pointOfInterestRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Point of Interest not found with ID: " + id));
        Category category = null;
        Long categoryId = request.categoryId();
        if (categoryId != null) {
            category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));
        }
        request.updateEntity(poi, category, geometryFactory);
        PointOfInterest updatedPoi = pointOfInterestRepository.save(poi);
        return PointOfInterestMapper.toGuestResponse(updatedPoi);
    }

    public void delete(Long id) {
        if (id == null) {
            throw new BadRequestException("Point of Interest ID cannot be null");
        }
        if (!pointOfInterestRepository.existsById(id)) {
            throw new ResourceNotFoundException("Point of Interest not found with ID: " + id);
        }
        pointOfInterestRepository.deleteById(id);
    }
}
