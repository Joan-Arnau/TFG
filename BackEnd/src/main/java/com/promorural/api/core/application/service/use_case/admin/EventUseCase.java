package com.promorural.api.core.application.service.use_case.admin;

import com.promorural.api.core.application.dto.admin.CreateEventRequest;
import com.promorural.api.core.application.dto.admin.EventAdminResponse;
import com.promorural.api.core.application.mapper.EventMapper;
import com.promorural.api.core.domain.entity.Category;
import com.promorural.api.core.domain.entity.Event;
import com.promorural.api.core.domain.exception.BadRequestException;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import com.promorural.api.core.domain.repository.CategoryRepository;
import com.promorural.api.core.domain.repository.EventRepository;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
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

    public Optional<EventAdminResponse> findById(Long id) {
        return eventRepository.findById(id).map(EventMapper::toAdminResponse);
    }

    public EventAdminResponse create(CreateEventRequest request) {
        Long categoryId = request.categoryId();
        if (categoryId == null) {
            throw new BadRequestException("CategoryId cannot be null");
        }
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));

        if (request.startsAt().isBefore(OffsetDateTime.now())) {
            throw new BadRequestException("StartsAt must be in the future");
        }
        Event event = new Event();
        request.applyToEntity(event, category, geometryFactory);
        event.setImageUrl(request.imageUrl());
        return EventMapper.toAdminResponse(eventRepository.save(event));
    }

    public EventAdminResponse update(Long id, CreateEventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.categoryId()));

        request.applyToEntity(event, category, geometryFactory);
        event.setImageUrl(request.imageUrl());
        return EventMapper.toAdminResponse(eventRepository.save(event));
    }

    public void delete(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with ID: " + id);
        }
        eventRepository.deleteById(id);
    }

    public List<EventAdminResponse> findEventsBetweenDates(OffsetDateTime start, OffsetDateTime end) {
        return eventRepository.findByStartsAtBetweenOrderByStartsAtAsc(start, end).stream()
                .map(EventMapper::toAdminResponse)
                .collect(Collectors.toList());
    }

    public List<EventAdminResponse> findFestivalEvents() {
        return eventRepository.findByIsFestivalTrueOrderByStartsAtAsc().stream()
                .map(EventMapper::toAdminResponse)
                .collect(Collectors.toList());
    }

    public List<EventAdminResponse> findNonFestivalEvents() {
        return eventRepository.findByIsFestivalFalseOrderByStartsAtAsc().stream()
                .map(EventMapper::toAdminResponse)
                .collect(Collectors.toList());
    }
}