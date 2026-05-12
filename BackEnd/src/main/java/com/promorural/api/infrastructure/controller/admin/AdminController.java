package com.promorural.api.infrastructure.controller.admin;

import com.promorural.api.core.application.dto.admin.AnnouncementAdminResponse;
import com.promorural.api.core.application.dto.admin.CategoryAdminResponse;
import com.promorural.api.core.application.dto.admin.ContactRequest;
import com.promorural.api.core.application.dto.admin.CreateAnnouncementRequest;
import com.promorural.api.core.application.dto.admin.CreateEventRequest;
import com.promorural.api.core.application.dto.admin.EventAdminResponse;
import com.promorural.api.core.application.dto.admin.POIAdminResponse;
import com.promorural.api.core.application.dto.admin.PointOfInterestRequest;
import com.promorural.api.core.application.dto.admin.ShopModerationResponse;
import com.promorural.api.core.application.dto.admin.config.ConfigUpdateRequest;
import com.promorural.api.core.application.dto.admin.moderation.ShopStatusUpdateRequest;
import com.promorural.api.core.application.dto.guest.ContactResponse;
import com.promorural.api.core.application.dto.guest.PointOfInterestResponse;
import com.promorural.api.core.application.service.AdminService;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/config")
    public ResponseEntity<Void> updateConfig(@RequestBody ConfigUpdateRequest request) {
        adminService.updateConfig(request);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/announcements")
    public ResponseEntity<Void> createAnnouncement(@Valid @RequestBody CreateAnnouncementRequest request) {
        adminService.createAnnouncement(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/events")
    public ResponseEntity<Void> createEvent(@Valid @RequestBody CreateEventRequest request) {
        adminService.createEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/admin/shops/{id}/status")
    public ResponseEntity<Void> updateShopStatus(@PathVariable Long id, @Valid @RequestBody ShopStatusUpdateRequest request) {
        adminService.updateShopStatus(id, request);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/shops/pending")
    public ResponseEntity<List<ShopModerationResponse>> getPendingShops() {
        return ResponseEntity.ok(adminService.getPendingShops());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/announcements")
    public ResponseEntity<List<AnnouncementAdminResponse>> getAnnouncements() {
        return ResponseEntity.ok(adminService.getAnnouncements());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/events")
    public ResponseEntity<List<EventAdminResponse>> getEvents() {
        return ResponseEntity.ok(adminService.getEvents());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/pois")
    public ResponseEntity<List<POIAdminResponse>> getPointsOfInterest() {
        return ResponseEntity.ok(adminService.getPointsOfInterest());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/pois")
    public ResponseEntity<PointOfInterestResponse> createPointOfInterest(@Valid @RequestBody PointOfInterestRequest request) {
        try {
            PointOfInterestResponse createdPoi = adminService.createPointOfInterest(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPoi);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/pois/{id}")
    public ResponseEntity<PointOfInterestResponse> updatePointOfInterest(@PathVariable Long id, @Valid @RequestBody PointOfInterestRequest request) {
        try {
            PointOfInterestResponse updatedPoi = adminService.updatePointOfInterest(id, request);
            return ResponseEntity.ok(updatedPoi);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/pois/{id}")
    public ResponseEntity<Void> deletePointOfInterest(@PathVariable Long id) {
        try {
            adminService.deletePointOfInterest(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/contacts")
    public ResponseEntity<ContactResponse> createContact(@Valid @RequestBody ContactRequest request) {
        try {
            ContactResponse createdContact = adminService.createContact(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdContact);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/contacts/{id}")
    public ResponseEntity<ContactResponse> updateContact(@PathVariable Long id, @Valid @RequestBody ContactRequest request) {
        try {
            ContactResponse updatedContact = adminService.updateContact(id, request);
            return ResponseEntity.ok(updatedContact);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/contacts/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        try {
            adminService.deleteContact(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = adminService.uploadFile(file);
            return ResponseEntity.ok(Collections.singletonMap("url", fileUrl));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}