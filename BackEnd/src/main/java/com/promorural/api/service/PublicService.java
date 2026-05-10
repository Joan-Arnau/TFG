package com.promorural.api.service;

import com.promorural.api.dto.PublicDtos.AnnouncementResponse;
import com.promorural.api.dto.PublicDtos.CategoryResponse;
import com.promorural.api.dto.PublicDtos.ConfigResponse;
import com.promorural.api.dto.PublicDtos.ContactResponse;
import com.promorural.api.dto.PublicDtos.EventResponse;
import com.promorural.api.dto.PublicDtos.PointOfInterestResponse;
import com.promorural.api.dto.PublicDtos.PromotionResponse;
import com.promorural.api.dto.PublicDtos.ShopDetailResponse;
import com.promorural.api.dto.PublicDtos.ShopResponse;
import com.promorural.api.entity.Category;
import com.promorural.api.entity.CategoryType;
import com.promorural.api.entity.MunicipalityConfig;
import com.promorural.api.entity.Shop;
import com.promorural.api.entity.ShopStatus;
import com.promorural.api.entity.Promotion;
import com.promorural.api.repository.AnnouncementRepository;
import com.promorural.api.repository.CategoryRepository;
import com.promorural.api.repository.ContactRepository;
import com.promorural.api.repository.EventRepository;
import com.promorural.api.repository.ShopRepository;
import com.promorural.api.repository.MunicipalityConfigRepository;
import com.promorural.api.repository.PointOfInterestRepository;
import com.promorural.api.repository.PromotionRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Objects;

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

    /**
     * Retrieves the municipality configuration for branding and display.
     * @return ConfigResponse containing branding details.
     * @throws IllegalStateException if the municipality configuration is not found.
     */
    public ConfigResponse getConfig() {
        MunicipalityConfig config = Objects.requireNonNull(getMunicipalityConfig(), "MunicipalityConfig is null");
        
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

    public ShopDetailResponse getShop(Long id) {
        Long shopId = Objects.requireNonNull(id, "Shop ID cannot be null");
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        if (shop.getStatus() != ShopStatus.APPROVED) {
            throw new RuntimeException("Shop is not approved");
        }

        List<PromotionResponse> promotions = promotionRepository.findByShopId(shop.getId()).stream()
                .filter(p -> OffsetDateTime.now().isAfter(p.getStartsAt()) && OffsetDateTime.now().isBefore(p.getEndsAt()))
                .map(this::mapToPromotionResponse)
                .toList();

        return new ShopDetailResponse(
                shop.getId(),
                shop.getName(),
                shop.getDescription(),
                shop.getAddress(),
                shop.getPhoneNumber(),
                shop.getHeaderImageUrl(),
                mapToCategoryResponse(shop.getCategory()),
                shop.getLocation() != null ? shop.getLocation().getY() : null,
                shop.getLocation() != null ? shop.getLocation().getX() : null,
                promotions
        );
    }

    public List<PromotionResponse> getPromotions(Long shopId) {
        List<Promotion> promotions;
        if (shopId != null) {
            promotions = promotionRepository.findByShopId(shopId);
        } else {
            promotions = promotionRepository.findAll();
        }
        return promotions.stream()
                .map(this::mapToPromotionResponse)
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

    private PromotionResponse mapToPromotionResponse(Promotion p) {
        if (p == null) return null;
        return new PromotionResponse(
                p.getId(),
                p.getShop().getId(),
                p.getTitle(),
                p.getDescription(),
                p.getImageUrl(),
                p.getStartsAt(),
                p.getEndsAt()
        );
    }

    private MunicipalityConfig getMunicipalityConfig() {
        return Objects.requireNonNull(municipalityConfigRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new IllegalStateException("Municipality config not found")), "MunicipalityConfig is null");
    }
}
