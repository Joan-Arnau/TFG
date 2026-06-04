package com.promorural.api.core.application.service.use_case.admin;

import com.promorural.api.core.application.dto.admin.ShopModerationResponse;
import com.promorural.api.core.application.dto.admin.moderation.ShopStatusUpdateRequest;
import com.promorural.api.core.application.dto.merchant.shop.ShopUpdateRequest;
import com.promorural.api.core.application.mapper.ShopMapper;
import com.promorural.api.core.domain.entity.Category;
import com.promorural.api.core.domain.entity.CategoryType;
import com.promorural.api.core.domain.entity.Promotion;
import com.promorural.api.core.domain.entity.Shop;
import com.promorural.api.core.domain.entity.ShopStatus;
import com.promorural.api.core.domain.entity.UploadFile;
import com.promorural.api.core.domain.exception.BadRequestException;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import com.promorural.api.core.domain.repository.CategoryRepository;
import com.promorural.api.core.domain.repository.PromotionRepository;
import com.promorural.api.core.domain.repository.ShopRepository;
import com.promorural.api.core.domain.repository.UploadFileRepository;
import com.promorural.api.core.application.port.EmailSender;
import com.promorural.api.core.application.port.EmailTemplateRenderer;
import com.promorural.api.core.application.service.EmailSubjectResolver;
import com.promorural.api.core.application.port.FileStoragePort;
import com.promorural.api.core.domain.entity.ProductImage;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ShopModerationUseCase {

    private static final Logger log = LoggerFactory.getLogger(ShopModerationUseCase.class);

    private final ShopRepository shopRepository;
    private final CategoryRepository categoryRepository;
    private final GeometryFactory geometryFactory;
    private final PromotionRepository promotionRepository;
    private final UploadFileRepository uploadFileRepository;
    private final EmailSender emailService;
    private final EmailTemplateRenderer emailTemplateService;
    private final EmailSubjectResolver emailSubjectResolver;
    private final FileStoragePort fileStorageService;

    public ShopModerationUseCase(
            ShopRepository shopRepository,
            CategoryRepository categoryRepository,
            GeometryFactory geometryFactory,
            PromotionRepository promotionRepository,
            UploadFileRepository uploadFileRepository,
            EmailSender emailService,
            EmailTemplateRenderer emailTemplateService,
            EmailSubjectResolver emailSubjectResolver,
            FileStoragePort fileStorageService
    ) {
        this.shopRepository = shopRepository;
        this.categoryRepository = categoryRepository;
        this.geometryFactory = geometryFactory;
        this.promotionRepository = promotionRepository;
        this.uploadFileRepository = uploadFileRepository;
        this.emailService = emailService;
        this.emailTemplateService = emailTemplateService;
        this.emailSubjectResolver = emailSubjectResolver;
        this.fileStorageService = fileStorageService;
    }

    public List<ShopModerationResponse> getPendingShops() {
        return shopRepository.findByStatusInOrderByCreatedAtDesc(List.of(ShopStatus.PENDING, ShopStatus.SUSPENDED)).stream()
                .map(ShopMapper::toModerationResponse)
                .collect(Collectors.toList());
    }

    public List<ShopModerationResponse> getAllShops() {
        return shopRepository.findAll().stream()
                .map(ShopMapper::toModerationResponse)
                .collect(Collectors.toList());
    }

    public ShopModerationResponse updateShop(Long id, ShopUpdateRequest request) {
        if (id == null) {
            throw new BadRequestException("Shop ID cannot be null");
        }
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with ID: " + id));

        Category category = null;
        if (request.hasCategory()) {
            category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new BadRequestException("Category not found with ID: " + request.categoryId()));
            if (category.getType() != CategoryType.SHOP) {
                throw new BadRequestException("Category must be of type SHOP");
            }
        }

        Point location = null;
        if (request.hasLocation()) {
            location = geometryFactory.createPoint(new Coordinate(request.longitude(), request.latitude()));
        }

        shop.updateProfile(
                request.name(),
                request.description(),
                request.address(),
                request.phoneNumber(),
                category,
                location
        );
        Shop savedShop = shopRepository.save(shop);
        return ShopMapper.toModerationResponse(savedShop);
    }

    public void deleteShop(Long id) {
        if (id == null) {
            throw new BadRequestException("Shop ID cannot be null");
        }
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with ID: " + id));

        // Delete physical files on disk first
        // 1. Shop header image
        if (shop.getHeaderImageUrl() != null && !shop.getHeaderImageUrl().isEmpty()) {
            try {
                fileStorageService.deleteFile(shop.getHeaderImageUrl());
            } catch (Exception e) {
                log.error("Failed to delete shop header image file on disk: {}", e.getMessage());
            }
        }

        // 2. Product images
        if (shop.getImages() != null) {
            for (ProductImage img : shop.getImages()) {
                if (img.getImageUrl() != null && !img.getImageUrl().isEmpty()) {
                    try {
                        fileStorageService.deleteFile(img.getImageUrl());
                    } catch (Exception e) {
                        log.error("Failed to delete product image file on disk: {}", e.getMessage());
                    }
                }
            }
        }

        // 3. Promotions images
        List<Promotion> promotions = promotionRepository.findByShopId(shop.getId());
        for (Promotion p : promotions) {
            if (p.getImageUrl() != null && !p.getImageUrl().isEmpty()) {
                try {
                    fileStorageService.deleteFile(p.getImageUrl());
                } catch (Exception e) {
                    log.error("Failed to delete promotion image file on disk: {}", e.getMessage());
                }
            }
        }

        // 4. Uploaded files (generic shop files)
        List<UploadFile> uploadFiles = uploadFileRepository.findByShopId(shop.getId());
        for (UploadFile uf : uploadFiles) {
            if (uf.getUrl() != null && !uf.getUrl().isEmpty()) {
                try {
                    fileStorageService.deleteFile(uf.getUrl());
                } catch (Exception e) {
                    log.error("Failed to delete uploaded file on disk: {}", e.getMessage());
                }
            }
        }

        // Delete promotions associated with the shop from DB
        promotionRepository.deleteAll(promotions);

        // Delete uploaded files associated with the shop from DB
        uploadFileRepository.deleteAll(uploadFiles);

        // Finally delete the shop
        shopRepository.delete(shop);
    }
    public void updateShopStatus(Long id, ShopStatusUpdateRequest request) {
        if (id == null) {
            throw new BadRequestException("Shop ID cannot be null");
        }
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with ID: " + id));
        ShopStatus status = request.status();
        if (status == null) {
            throw new BadRequestException("Shop status cannot be null");
        }
        shop.setStatus(status);
        shopRepository.save(shop);

        // Send email notification to owner if present
        if (shop.getOwner() != null && shop.getOwner().getEmail() != null) {
            String email = shop.getOwner().getEmail();
            String shopName = null;
            if (shop.getName() != null) {
                shopName = shop.getName().get("ca");
                if (shopName == null) {
                    shopName = shop.getName().values().stream().filter(v -> v != null && !v.isEmpty()).findFirst().orElse(null);
                }
            }
            if (shopName == null) {
                shopName = "Comerç #" + shop.getId();
            }

            try {
                if (status == ShopStatus.APPROVED) {
                    String htmlContent = emailTemplateService.renderShopApprovedTemplate(shopName);
                    String subject = emailSubjectResolver.resolveSubject(shop.getOwner(), com.promorural.api.core.domain.model.EmailType.SHOP_APPROVED);
                    emailService.sendHtmlEmail(email, subject, htmlContent);
                    log.info("Approval email sent to owner of shop id={}", id);
                } else if (status == ShopStatus.REJECTED) {
                    String reason = request.rejectionReason();
                    if (reason == null) {
                        reason = "";
                    }
                    String htmlContent = emailTemplateService.renderShopRejectedTemplate(shopName, reason);
                    String subject = emailSubjectResolver.resolveSubject(shop.getOwner(), com.promorural.api.core.domain.model.EmailType.SHOP_REJECTED);
                    emailService.sendHtmlEmail(email, subject, htmlContent);
                    log.info("Rejection email sent to owner of shop id={} (reason: {})", id, reason);
                } else if (status == ShopStatus.SUSPENDED) {
                    String htmlContent = emailTemplateService.renderShopSuspendedTemplate(shopName);
                    String subject = emailSubjectResolver.resolveSubject(shop.getOwner(), com.promorural.api.core.domain.model.EmailType.SHOP_SUSPENDED);
                    emailService.sendHtmlEmail(email, subject, htmlContent);
                    log.info("Suspension email sent to owner of shop id={}", id);
                }
            } catch (Exception e) {
                log.error("Failed to send moderation email for shop id={}: {}", id, e.getMessage());
            }
        }
    }
}