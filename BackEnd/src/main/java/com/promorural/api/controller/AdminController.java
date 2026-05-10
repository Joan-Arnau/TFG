package com.promorural.api.controller;

import com.promorural.api.dto.AdminDtos.*;
import com.promorural.api.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/config")
    public ResponseEntity<Void> updateConfig(@Valid @RequestBody UpdateConfigRequest request) {
        adminService.updateConfig(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/announcements")
    public ResponseEntity<Void> createAnnouncement(@Valid @RequestBody CreateAnnouncementRequest request) {
        adminService.createAnnouncement(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/events")
    public ResponseEntity<Void> createEvent(@Valid @RequestBody CreateEventRequest request) {
        adminService.createEvent(request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/shops/{id}/status")
    public ResponseEntity<Void> updateShopStatus(@PathVariable Long id, @Valid @RequestBody UpdateShopStatusRequest request) {
        adminService.updateShopStatus(id, request);
        return ResponseEntity.ok().build();
    }
}
