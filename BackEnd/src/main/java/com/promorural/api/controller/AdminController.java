package com.promorural.api.controller;

import com.promorural.api.dto.AdminDtos.ContactRequest;
import com.promorural.api.dto.AdminDtos.CreateAnnouncementRequest;
import com.promorural.api.dto.AdminDtos.CreateEventRequest;
import com.promorural.api.dto.AdminDtos.PointOfInterestRequest;
import com.promorural.api.dto.AdminDtos.UpdateConfigRequest;
import com.promorural.api.dto.AdminDtos.UpdateShopStatusRequest;
import com.promorural.api.dto.PublicDtos.ContactResponse;
import com.promorural.api.dto.PublicDtos.PointOfInterestResponse;
import com.promorural.api.dto.PublicDtos.ShopResponse;
import com.promorural.api.service.AdminService;
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

    private final AdminService adminService;;

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
    public ResponseEntity<Void> updateShopStatus(@PathVariable Long id, @Valid @RequestBody UpdateShopStatusRequest request) {
        adminService.updateShopStatus(id, request);
        return ResponseEntity.ok().build();
    }

    /**
     * Endpoint for Admin to retrieve a list of shops that are in PENDING status.
     * @return ResponseEntity with a list of ShopResponse DTOs representing pending shops.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/shops/pending")
    public ResponseEntity<List<ShopResponse>> getPendingShops() {
        List<ShopResponse> pendingShops = adminService.getPendingShops();
        return ResponseEntity.ok(pendingShops);
    }

    /**
     * Endpoint for Admin to create a new Point of Interest.
     * @param request The PointOfInterestRequest DTO.
     * @return ResponseEntity with the created PointOfInterestResponse DTO.
     */
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

    /**
     * Endpoint for Admin to update an existing Point of Interest.
     * @param id The ID of the Point of Interest to update.
     * @param request The PointOfInterestRequest DTO.
     * @return ResponseEntity with the updated PointOfInterestResponse DTO.
     */
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

    /**
     * Endpoint for Admin to delete a Point of Interest by its ID.
     * @param id The ID of the Point of Interest to delete.
     * @return ResponseEntity indicating success.
     */
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

    /**
     * Endpoint for Admin to create a new Contact entry.
     * @param request The ContactRequest DTO.
     * @return ResponseEntity with the created ContactResponse DTO.
     */
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

    /**
     * Endpoint for Admin to update an existing Contact entry.
     * @param id The ID of the Contact to update.
     * @param request The ContactRequest DTO.
     * @return ResponseEntity with the updated ContactResponse DTO.
     */
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

    /**
     * Endpoint for Admin to delete a Contact entry by its ID.
     * @param id The ID of the Contact to delete.
     * @return ResponseEntity indicating success.
     */
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

    /**
     * Endpoint for Admin to upload a generic file.
     * @param file The file to upload.
     * @return ResponseEntity with the file URL in the body.
     */
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
