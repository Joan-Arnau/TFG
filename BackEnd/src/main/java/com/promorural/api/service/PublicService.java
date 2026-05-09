package com.promorural.api.service;

import com.promorural.api.dto.PublicDtos.*;
import com.promorural.api.entity.*;
import com.promorural.api.repository.*;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PublicService {

    private final MunicipalityConfigRepository municipalityConfigRepository;
    private final ShopRepository shopRepository;
    private final AnnouncementRepository announcementRepository;
    private final EventRepository eventRepository;
    private final PointOfInterestRepository pointOfInterestRepository;
    private final CategoryRepository categoryRepository;
    private final PromotionRepository promotionRepository;
    private final ContactRepository contactRepository;

    public PublicService(
            MunicipalityConfigRepository municipalityConfigRepository,
            ShopRepository shopRepository,
            AnnouncementRepository announcementRepository,
            EventRepository eventRepository,
            PointOfInterestRepository pointOfInterestRepository,
            CategoryRepository categoryRepository,
            PromotionRepository promotionRepository,
            ContactRepository contactRepository
    ) {
        this.municipalityConfigRepository = municipalityConfigRepository;
        this.shopRepository = shopRepository;
        this.announcementRepository = announcementRepository;
        this.eventRepository = eventRepository;
        this.pointOfInterestRepository = pointOfInterestRepository;
        this.categoryRepository = categoryRepository;
        this.promotionRepository = promotionRepository;
        this.contactRepository = contactRepository;
    }

    public ConfigResponse getConfig() {
        MunicipalityConfig config = getMunicipalityConfig();
        return new ConfigResponse(
                config.getDefaultLanguage(),
                config.getSupportedLanguages(),
                config.getBranding(),
                config.getLocation() != null ? config.getLocation().getY() : null,
                config.getLocation() != null ? config.getLocation().getX() : null
        );
    }

    public List<CategoryResponse> getCategories(CategoryType type) {
        return categoryRepository.findByType(type).stream()
                .map(this::mapToCategoryResponse)
                .toList();
    }

    public List<ShopResponse> getShops() {
        return shopRepository.findByStatusOrderByCreatedAtDesc(ShopStatus.APPROVED).stream()
                .map(shop -> new ShopResponse(
                        shop.getId(),
                        shop.getName(),
                        shop.getDescription(),
                        shop.getAddress(),
                        shop.getPhoneNumber(),
                        shop.getHeaderImageUrl(),
                        mapToCategoryResponse(shop.getCategory()),
                        shop.getLocation() != null ? shop.getLocation().getY() : null,
                        shop.getLocation() != null ? shop.getLocation().getX() : null
                ))
                .toList();
    }

    public List<PromotionResponse> getPromotions(Long shopId) {
        List<Promotion> promotions;
        if (shopId != null) {
            promotions = promotionRepository.findByShopId(shopId);
        } else {
            promotions = promotionRepository.findAll();
        }
        return promotions.stream()
                .map(p -> new PromotionResponse(
                        p.getId(),
                        p.getShop().getId(),
                        p.getTitle(),
                        p.getDescription(),
                        p.getImageUrl(),
                        p.getStartsAt(),
                        p.getEndsAt()
                ))
                .toList();
    }

    public List<AnnouncementResponse> getAnnouncements() {
        return announcementRepository.findAllByOrderByPublishedAtDesc().stream()
                .map(item -> new AnnouncementResponse(
                        item.getId(),
                        item.getTitle(),
                        item.getContent(),
                        mapToCategoryResponse(item.getCategory()),
                        item.isUrgent(),
                        item.getPublishedAt()
                ))
                .toList();
    }

    public List<EventResponse> getEvents() {
        return eventRepository.findAllByOrderByStartsAtAsc().stream()
                .map(item -> new EventResponse(
                        item.getId(),
                        item.getTitle(),
                        item.getDescription(),
                        item.getLocationText(),
                        mapToCategoryResponse(item.getCategory()),
                        item.isFestival(),
                        item.getStartsAt(),
                        item.getEndsAt(),
                        item.getLocationGeom() != null ? item.getLocationGeom().getY() : null,
                        item.getLocationGeom() != null ? item.getLocationGeom().getX() : null
                ))
                .toList();
    }

    public List<PointOfInterestResponse> getPointsOfInterest() {
        return pointOfInterestRepository.findAll().stream()
                .map(item -> new PointOfInterestResponse(
                        item.getId(),
                        item.getName(),
                        item.getDescription(),
                        item.getImageUrl(),
                        mapToCategoryResponse(item.getCategory()),
                        item.getLocation() != null ? item.getLocation().getY() : null,
                        item.getLocation() != null ? item.getLocation().getX() : null
                ))
                .toList();
    }

    public List<ContactResponse> getContacts() {
        return contactRepository.findAll().stream()
                .map(item -> new ContactResponse(
                        item.getId(),
                        item.getServiceName(),
                        item.getPhoneNumber(),
                        item.getIconName(),
                        mapToCategoryResponse(item.getCategory())
                ))
                .toList();
    }

    private CategoryResponse mapToCategoryResponse(Category category) {
        if (category == null) return null;
        return new CategoryResponse(category.getId(), category.getName(), category.getType().name());
    }

    private MunicipalityConfig getMunicipalityConfig() {
        return municipalityConfigRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new IllegalStateException("Municipality config not found"));
    }
}
