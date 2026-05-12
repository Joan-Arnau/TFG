package com.promorural.api.core.application.service;

import com.promorural.api.core.application.dto.admin.ContactRequest;
import com.promorural.api.core.application.dto.admin.CreateAnnouncementRequest;
import com.promorural.api.core.application.dto.admin.CreateEventRequest;
import com.promorural.api.core.application.dto.admin.PointOfInterestRequest;
import com.promorural.api.core.application.dto.admin.config.ConfigUpdateRequest;
import com.promorural.api.core.application.dto.admin.moderation.ShopStatusUpdateRequest;
import com.promorural.api.core.application.dto.guest.CategoryResponse;
import com.promorural.api.core.application.dto.guest.ContactResponse;
import com.promorural.api.core.application.dto.guest.PointOfInterestResponse;
import com.promorural.api.core.application.dto.guest.shop.ShopResponse;
import com.promorural.api.core.domain.entity.*;
import com.promorural.api.core.domain.repository.*;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {

    private final MunicipalityConfigRepository municipalityConfigRepository;
    private final AnnouncementRepository announcementRepository;
    private final EventRepository eventRepository;
    private final ShopRepository shopRepository;
    private final CategoryRepository categoryRepository;
    private final PointOfInterestRepository pointOfInterestRepository;
    private final ContactRepository contactRepository;
    private final FileStorageService fileStorageService;
    private final GeometryFactory geometryFactory;

    public AdminService(
            MunicipalityConfigRepository municipalityConfigRepository,
            AnnouncementRepository announcementRepository,
            EventRepository eventRepository,
            ShopRepository shopRepository,
            CategoryRepository categoryRepository,
            PointOfInterestRepository pointOfInterestRepository,
            ContactRepository contactRepository,
            FileStorageService fileStorageService,
            GeometryFactory geometryFactory
    ) {
        this.municipalityConfigRepository = municipalityConfigRepository;
        this.announcementRepository = announcementRepository;
        this.eventRepository = eventRepository;
        this.shopRepository = shopRepository;
        this.categoryRepository = categoryRepository;
        this.pointOfInterestRepository = pointOfInterestRepository;
        this.contactRepository = contactRepository;
        this.fileStorageService = fileStorageService;
        this.geometryFactory = geometryFactory;
    }

    /**
     * Updates the municipality configuration.
     */
    public void updateConfig(ConfigUpdateRequest request) {
        MunicipalityConfig config = Objects.requireNonNull(municipalityConfigRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new RuntimeException("Municipality configuration not found")), "MunicipalityConfig is null");

        request.updateEntity(config, geometryFactory);
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
        announcement.setUrgent(request.urgent()); 
        
        announcementRepository.save(announcement);
    }

    public void createEvent(CreateEventRequest request) {
        Long categoryId = Objects.requireNonNull(request.categoryId(), "CategoryId cannot be null");
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Event event = new Event();
        request.applyToEntity(event, category, geometryFactory);

        eventRepository.save(event);
    }

    public void updateShopStatus(Long id, ShopStatusUpdateRequest request) {
        Long shopId = Objects.requireNonNull(id, "Shop ID cannot be null");
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        shop.setStatus(Objects.requireNonNull(request.status(), "Shop status cannot be null"));
        shopRepository.save(shop);
    }

    public List<ShopResponse> getPendingShops() {
        return shopRepository.findByStatusOrderByCreatedAtDesc(ShopStatus.PENDING).stream()
                .map(this::mapToShopResponse)
                .collect(Collectors.toList());
    }

    public PointOfInterestResponse createPointOfInterest(PointOfInterestRequest request) {
        Long categoryId = Objects.requireNonNull(request.categoryId(), "CategoryId cannot be null for POI");
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        PointOfInterest poi = new PointOfInterest();
        request.updateEntity(poi, category, geometryFactory);

        PointOfInterest savedPoi = pointOfInterestRepository.save(poi);
        return mapToPointOfInterestResponse(savedPoi);
    }

    @SuppressWarnings("null")
    public PointOfInterestResponse updatePointOfInterest(Long id, PointOfInterestRequest request) {
        PointOfInterest poi = pointOfInterestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Point of Interest not found with ID: " + id));

        Category category = null;
        if (request.categoryId() != null) {
            category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        request.updateEntity(poi, category, geometryFactory);

        PointOfInterest updatedPoi = pointOfInterestRepository.save(poi);
        return mapToPointOfInterestResponse(updatedPoi);
    }

    @SuppressWarnings("null")
    public void deletePointOfInterest(Long id) {
        pointOfInterestRepository.deleteById(id);
    }

    public ContactResponse createContact(ContactRequest request) {
        Long categoryId = Objects.requireNonNull(request.categoryId(), "CategoryId cannot be null for Contact");
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Contact contact = new Contact();
        contact.setServiceName(request.serviceName());
        contact.setPhoneNumber(request.phoneNumber());
        contact.setIconName(request.iconName());
        contact.setCategory(category);

        Contact savedContact = contactRepository.save(contact);
        return mapToContactResponse(savedContact);
    }

    @SuppressWarnings("null")
    public ContactResponse updateContact(Long id, ContactRequest request) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with ID: " + id));

        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            contact.setCategory(category);
        }

        if (request.serviceName() != null) {
            contact.setServiceName(request.serviceName());
        }
        if (request.phoneNumber() != null) {
            contact.setPhoneNumber(request.phoneNumber());
        }
        if (request.iconName() != null) {
            contact.setIconName(request.iconName());
        }

        Contact updatedContact = contactRepository.save(contact);
        return mapToContactResponse(updatedContact);
    }

    @SuppressWarnings("null")
    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }

    public String uploadFile(MultipartFile file) throws IOException {
        return fileStorageService.storeFile(file);
    }

    private ShopResponse mapToShopResponse(Shop shop) {
        if (shop == null) return null;
        return new ShopResponse(
                shop.getId(),
                shop.getName(),
                shop.getDescription(),
                shop.getAddress(),
                shop.getPhoneNumber(),
                shop.getHeaderImageUrl(),
                mapToCategoryResponse(shop.getCategory()),
                shop.getLocation() != null ? shop.getLocation().getY() : null,
                shop.getLocation() != null ? shop.getLocation().getX() : null
        );
    }

    private CategoryResponse mapToCategoryResponse(Category category) {
        if (category == null) return null;
        return new CategoryResponse(category.getId(), category.getName(), category.getType().name());
    }

    private PointOfInterestResponse mapToPointOfInterestResponse(PointOfInterest poi) {
        if (poi == null) return null;
        return new PointOfInterestResponse(
                poi.getId(),
                poi.getName(),
                poi.getDescription(),
                poi.getImageUrl(),
                mapToCategoryResponse(poi.getCategory()),
                poi.getLocation() != null ? poi.getLocation().getY() : null,
                poi.getLocation() != null ? poi.getLocation().getX() : null
        );
    }

    private ContactResponse mapToContactResponse(Contact contact) {
        if (contact == null) return null;
        return new ContactResponse(
                contact.getId(),
                contact.getServiceName(),
                contact.getPhoneNumber(),
                contact.getIconName(),
                mapToCategoryResponse(contact.getCategory())
        );
    }
}
