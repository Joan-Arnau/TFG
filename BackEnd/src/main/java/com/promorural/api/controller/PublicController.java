package com.promorural.api.controller;

import com.promorural.api.dto.PublicDtos.*;
import com.promorural.api.entity.CategoryType;
import com.promorural.api.service.PublicService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final PublicService publicService;

    public PublicController(PublicService publicService) {
        this.publicService = publicService;
    }

    /**
     * Endpoint to retrieve the general configuration for the white-label application.
     * This includes branding information, default language, and supported languages.
     * @return ResponseEntity containing the ConfigResponse DTO.
     */
    @GetMapping("/config")
    public ResponseEntity<ConfigResponse> getConfig() {
        return ResponseEntity.ok(publicService.getConfig());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getCategories(@RequestParam CategoryType type) {
        return ResponseEntity.ok(publicService.getCategories(type));
    }

    @GetMapping("/shops")
    public ResponseEntity<List<ShopResponse>> getShops() {
        return ResponseEntity.ok(publicService.getShops());
    }

    @GetMapping("/shops/{id}")
    public ResponseEntity<ShopDetailResponse> getShop(@PathVariable Long id) {
        return ResponseEntity.ok(publicService.getShop(id));
    }

    @GetMapping("/promotions")
    public ResponseEntity<List<PromotionResponse>> getPromotions(@RequestParam(required = false) Long shopId) {
        return ResponseEntity.ok(publicService.getPromotions(shopId));
    }

    @GetMapping("/announcements")
    public ResponseEntity<List<AnnouncementResponse>> getAnnouncements() {
        return ResponseEntity.ok(publicService.getAnnouncements());
    }

    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getEvents() {
        return ResponseEntity.ok(publicService.getEvents());
    }

    @GetMapping("/points-of-interest")
    public ResponseEntity<List<PointOfInterestResponse>> getPointsOfInterest() {
        return ResponseEntity.ok(publicService.getPointsOfInterest());
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<ContactResponse>> getContacts() {
        return ResponseEntity.ok(publicService.getContacts());
    }
}
