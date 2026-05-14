package com.promorural.api.infrastructure.controller.admin;

import com.promorural.api.core.application.dto.admin.CreateEventRequest;
import com.promorural.api.core.application.dto.admin.EventAdminResponse;
import com.promorural.api.core.application.service.use_case.admin.EventUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.promorural.api.core.application.validation.ValidationGroups;

import java.util.List;

@RestController
@RequestMapping("/api/admin/events")
@PreAuthorize("hasRole('ADMIN')")
public class EventController {

    private final EventUseCase eventUseCase;

    public EventController(EventUseCase eventUseCase) {
        this.eventUseCase = eventUseCase;
    }

    @GetMapping
    public ResponseEntity<List<EventAdminResponse>> getEvents() {
        return ResponseEntity.ok(eventUseCase.getAll());
    }

    @PostMapping
    public ResponseEntity<Void> createEvent(
            @Validated(ValidationGroups.Create.class) @RequestBody CreateEventRequest request) {
        eventUseCase.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}