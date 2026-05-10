package com.promorural.api.controller;

import com.promorural.api.dto.AdminDtos.*;
import com.promorural.api.service.AdminService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * Endpoint for Admin to update the municipality configuration.
     * @param request The UpdateConfigRequest containing the new configuration values.
     * @return ResponseEntity indicating success.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/config")
    public ResponseEntity<Void> updateConfig(@RequestBody UpdateConfigRequest request) {
        adminService.updateConfig(request);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/announcements")
    public ResponseEntity<Void> createAnnouncement(@Valid @RequestBody CreateAnnouncementRequest request) {
        adminService.createAnnouncement(request);
        return ResponseEntity.status(201).build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/events")
    public ResponseEntity<Void> createEvent(@Valid @RequestBody CreateEventRequest request) {
        adminService.createEvent(request);
        return ResponseEntity.status(201).build();
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/admin/shops/{id}/status")
    public ResponseEntity<Void> updateShopStatus(@PathVariable Long id, @Valid @RequestBody UpdateShopStatusRequest request) {
        adminService.updateShopStatus(id, request);
        return ResponseEntity.ok().build();
    }
}