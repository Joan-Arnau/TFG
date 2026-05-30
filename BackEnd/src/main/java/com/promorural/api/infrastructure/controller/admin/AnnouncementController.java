package com.promorural.api.infrastructure.controller.admin;

import com.promorural.api.core.application.dto.admin.AnnouncementAdminResponse;
import com.promorural.api.core.application.dto.admin.CreateAnnouncementRequest;
import com.promorural.api.core.application.service.use_case.admin.AnnouncementUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.promorural.api.core.application.validation.ValidationGroups;

import java.util.List;

@RestController
@RequestMapping("/api/admin/announcements")
@PreAuthorize("hasRole('ADMIN')")
public class AnnouncementController {

    private final AnnouncementUseCase announcementUseCase;

    public AnnouncementController(AnnouncementUseCase announcementUseCase) {
        this.announcementUseCase = announcementUseCase;
    }

    @GetMapping
    public ResponseEntity<List<AnnouncementAdminResponse>> getAnnouncements() {
        return ResponseEntity.ok(announcementUseCase.getAll());
    }

    @PostMapping
    public ResponseEntity<Void> createAnnouncement(
            @Validated(ValidationGroups.Create.class) @RequestBody CreateAnnouncementRequest request) {
        announcementUseCase.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateAnnouncement(
            @PathVariable Long id,
            @Validated(ValidationGroups.Update.class) @RequestBody CreateAnnouncementRequest request) {
        announcementUseCase.update(id, request);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateAnnouncementStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        announcementUseCase.updateStatus(id, status);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        announcementUseCase.delete(id);
        return ResponseEntity.noContent().build();
    }
}