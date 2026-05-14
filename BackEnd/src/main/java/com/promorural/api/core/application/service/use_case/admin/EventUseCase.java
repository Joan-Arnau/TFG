package com.promorural.api.core.application.service.use_case.admin;

import com.promorural.api.core.application.dto.admin.CreateEventRequest;
import com.promorural.api.core.application.dto.admin.EventAdminResponse;
import com.promorural.api.core.application.mapper.EventMapper;
import com.promorural.api.core.domain.entity.Category;
import com.promorural.api.core.domain.exception.BadRequestException;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import com.promorural.api.core.domain.repository.CategoryRepository;
import com.promorural.api.core.domain.repository.EventRepository;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventUseCase {

    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final GeometryFactory geometryFactory;

    public EventUseCase(EventRepository eventRepository,
                        CategoryRepository categoryRepository,
                        GeometryFactory geometryFactory) {
        this.eventRepository = eventRepository;
        this.categoryRepository = categoryRepository;
        this.geometryFactory = geometryFactory;
    }

    public List<EventAdminResponse> getAll() {
        return eventRepository.findAllByOrderByStartsAtAsc().stream()
                .map(EventMapper::toAdminResponse)
                .collect(Collectors.toList());
    }

    public void create(CreateEventRequest request) {
        Long categoryId = request.categoryId();
        if (categoryId == null) {
            throw new BadRequestException("CategoryId cannot be null");
        }
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));
        com.promorural.api.core.domain.entity.Event event = new com.promorural.api.core.domain.entity.Event();
        request.applyToEntity(event, category, geometryFactory);
        eventRepository.save(event);
    }
}