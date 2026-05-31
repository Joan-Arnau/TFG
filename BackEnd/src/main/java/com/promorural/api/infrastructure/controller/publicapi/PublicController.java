package com.promorural.api.infrastructure.controller.publicapi;

import com.promorural.api.core.application.dto.guest.CategoryResponse;
import com.promorural.api.core.application.dto.guest.ConfigResponse;
import com.promorural.api.core.application.dto.guest.ContactResponse;
import com.promorural.api.core.application.dto.guest.PointOfInterestResponse;
import com.promorural.api.core.application.dto.guest.PromotionResponse;
import com.promorural.api.core.application.dto.guest.announcement.AnnouncementResponse;
import com.promorural.api.core.application.dto.guest.event.EventResponse;
import com.promorural.api.core.application.dto.guest.shop.ShopDetailResponse;
import com.promorural.api.core.application.dto.guest.shop.ShopResponse;
import com.promorural.api.core.domain.entity.CategoryType;
import com.promorural.api.core.application.service.use_case.publicapi.PublicUseCase;
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

    private final PublicUseCase publicUseCase;

    public PublicController(PublicUseCase publicUseCase) {
        this.publicUseCase = publicUseCase;
    }

    /**
     * Endpoint to retrieve the general configuration for the white-label application.
     * This includes branding information, default language, and supported languages.
     * @return ResponseEntity containing the ConfigResponse DTO.
     */
    @GetMapping("/config")
    public ResponseEntity<ConfigResponse> getConfig() {
        return ResponseEntity.ok(publicUseCase.getConfig());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getCategories(@RequestParam(required = false, defaultValue = "SHOP") CategoryType type) {
        return ResponseEntity.ok(publicUseCase.getCategories(type));
    }

    @GetMapping("/shops")
    public ResponseEntity<List<ShopResponse>> getShops() {
        return ResponseEntity.ok(publicUseCase.getShops());
    }

    @GetMapping("/shops/{id}")
    public ResponseEntity<ShopDetailResponse> getShop(@PathVariable Long id) {
        return ResponseEntity.ok(publicUseCase.getShop(id));
    }

    @GetMapping("/promotions")
    public ResponseEntity<List<PromotionResponse>> getPromotions(@RequestParam(required = false) Long shopId) {
        return ResponseEntity.ok(publicUseCase.getPromotions(shopId));
    }

    @GetMapping("/announcements")
    public ResponseEntity<List<AnnouncementResponse>> getAnnouncements() {
        return ResponseEntity.ok(publicUseCase.getAnnouncements());
    }

    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getEvents() {
        return ResponseEntity.ok(publicUseCase.getEvents());
    }

    @GetMapping("/points-of-interest")
    public ResponseEntity<List<PointOfInterestResponse>> getPointsOfInterest() {
        return ResponseEntity.ok(publicUseCase.getPointsOfInterest());
    }

    @GetMapping("/points-of-interest/{id}")
    public ResponseEntity<PointOfInterestResponse> getPointOfInterest(@PathVariable Long id) {
        return ResponseEntity.ok(publicUseCase.getPointOfInterest(id));
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<ContactResponse>> getContacts() {
        return ResponseEntity.ok(publicUseCase.getContacts());
    }
}
