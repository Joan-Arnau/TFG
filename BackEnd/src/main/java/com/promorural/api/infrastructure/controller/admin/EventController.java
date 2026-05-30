package com.promorural.api.infrastructure.controller.admin;

import com.promorural.api.core.application.dto.admin.CreateEventRequest;
import com.promorural.api.core.application.dto.admin.EventAdminResponse;
import com.promorural.api.core.application.service.use_case.admin.EventUseCase;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.promorural.api.core.application.validation.ValidationGroups;
import org.springframework.validation.annotation.Validated;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/events")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class EventController {

    private final EventUseCase eventUseCase;

    @GetMapping
    public ResponseEntity<List<EventAdminResponse>> getAllEvents() {
        return ResponseEntity.ok(eventUseCase.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventAdminResponse> getEventById(@PathVariable Long id) {
        return eventUseCase.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EventAdminResponse> createEvent(@Validated(ValidationGroups.Create.class) @RequestBody CreateEventRequest request) {
        EventAdminResponse createdEvent = eventUseCase.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventAdminResponse> updateEvent(@PathVariable Long id, @Validated(ValidationGroups.Update.class) @RequestBody CreateEventRequest request) {
        EventAdminResponse updatedEvent = eventUseCase.update(id, request);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventUseCase.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/between-dates")
    public ResponseEntity<List<EventAdminResponse>> getEventsBetweenDates(
            @RequestParam @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssZ") OffsetDateTime start,
            @RequestParam @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssZ") OffsetDateTime end) {
        return ResponseEntity.ok(eventUseCase.findEventsBetweenDates(start, end));
    }

    @GetMapping("/festival")
    public ResponseEntity<List<EventAdminResponse>> getFestivalEvents() {
        return ResponseEntity.ok(eventUseCase.findFestivalEvents());
    }

    @GetMapping("/non-festival")
    public ResponseEntity<List<EventAdminResponse>> getNonFestivalEvents() {
        return ResponseEntity.ok(eventUseCase.findNonFestivalEvents());
    }
}