package com.promorural.api.service;

import com.promorural.api.dto.AdminDtos.*;
import com.promorural.api.entity.*;
import com.promorural.api.repository.*;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Objects;

@Service
@Transactional
public class AdminService {

    private final MunicipalityConfigRepository municipalityConfigRepository;
    private final AnnouncementRepository announcementRepository;
    private final EventRepository eventRepository;
    private final ShopRepository shopRepository;
    private final CategoryRepository categoryRepository;
    private final GeometryFactory geometryFactory;

    public AdminService(
            MunicipalityConfigRepository municipalityConfigRepository,
            AnnouncementRepository announcementRepository,
            EventRepository eventRepository,
            ShopRepository shopRepository,
            CategoryRepository categoryRepository,
            GeometryFactory geometryFactory
    ) {
        this.municipalityConfigRepository = municipalityConfigRepository;
        this.announcementRepository = announcementRepository;
        this.eventRepository = eventRepository;
        this.shopRepository = shopRepository;
        this.categoryRepository = categoryRepository;
        this.geometryFactory = geometryFactory;
    }

    public void updateConfig(UpdateConfigRequest request) {
        MunicipalityConfig config = Objects.requireNonNull(
            municipalityConfigRepository.findFirstByOrderByIdAsc()
                    .orElseThrow(() -> new RuntimeException("Config not found")),
            "MunicipalityConfig expression is null after orElseThrow"
        );

        if (request.branding() != null) {
            config.setBranding(request.branding()); 
        }

        if (request.latitude() != null && request.longitude() != null) {
            Point location = geometryFactory.createPoint(new Coordinate(request.longitude(), request.latitude()));
            config.setLocation(location);
        }

        municipalityConfigRepository.save(config);
    }

    public void createAnnouncement(CreateAnnouncementRequest request) {
        Long categoryId = Objects.requireNonNull(request.categoryId(), "CategoryId cannot be null");
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Announcement announcement = new Announcement();
        announcement.setTitle(request.title());
        announcement.setContent(request.content());
        announcement.setCategory(category);
        announcement.setUrgent(request.isUrgent());
        
        announcementRepository.save(announcement);
    }

    public void createEvent(CreateEventRequest request) {
        Long categoryId = Objects.requireNonNull(request.categoryId(), "CategoryId cannot be null");
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Event event = new Event();
        event.setTitle(request.title());
        event.setDescription(request.description());
        event.setLocationText(request.locationText());
        event.setCategory(category);
        event.setFestival(request.isFestival());
        event.setStartsAt(request.startsAt());
        event.setEndsAt(request.endsAt());

        if (request.latitude() != null && request.longitude() != null) {
            Point location = geometryFactory.createPoint(new Coordinate(request.longitude(), request.latitude()));
            event.setLocationGeom(location);
        }

        eventRepository.save(event);
    }

    public void updateShopStatus(Long id, UpdateShopStatusRequest request) {
        Long shopId = Objects.requireNonNull(id, "Shop ID cannot be null");
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
                
        shop.setStatus(Objects.requireNonNull(request.status(), "Shop status cannot be null"));
        shopRepository.save(shop);
    }
}
