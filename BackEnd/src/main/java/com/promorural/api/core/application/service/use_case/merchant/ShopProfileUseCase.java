package com.promorural.api.core.application.service.use_case.merchant;

import com.promorural.api.core.application.dto.guest.CategoryResponse;
import com.promorural.api.core.application.dto.merchant.shop.ShopMerchantResponse;
import com.promorural.api.core.application.dto.merchant.shop.ShopUpdateRequest;
import com.promorural.api.core.application.mapper.ShopMapper;
import com.promorural.api.core.domain.entity.Category;
import com.promorural.api.core.domain.entity.CategoryType;
import com.promorural.api.core.domain.entity.Shop;
import com.promorural.api.core.domain.entity.User;
import com.promorural.api.core.domain.exception.BadRequestException;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import com.promorural.api.core.domain.repository.CategoryRepository;
import com.promorural.api.core.domain.repository.ShopRepository;
import com.promorural.api.core.domain.repository.UserRepository;
import com.promorural.api.core.domain.repository.PromotionRepository;
import com.promorural.api.core.domain.repository.UploadFileRepository;
import com.promorural.api.core.application.port.FileStoragePort;
import com.promorural.api.core.domain.entity.ProductImage;
import com.promorural.api.core.domain.entity.Promotion;
import com.promorural.api.core.domain.entity.UploadFile;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ShopProfileUseCase {

    private static final Logger log = LoggerFactory.getLogger(ShopProfileUseCase.class);

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final GeometryFactory geometryFactory;
    private final PromotionRepository promotionRepository;
    private final UploadFileRepository uploadFileRepository;
    private final FileStoragePort fileStorageService;

    public ShopProfileUseCase(
            ShopRepository shopRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            GeometryFactory geometryFactory,
            PromotionRepository promotionRepository,
            UploadFileRepository uploadFileRepository,
            FileStoragePort fileStorageService
    ) {
        this.shopRepository = shopRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.geometryFactory = geometryFactory;
        this.promotionRepository = promotionRepository;
        this.uploadFileRepository = uploadFileRepository;
        this.fileStorageService = fileStorageService;
    }

    public ShopMerchantResponse getMyShop() {
        User currentUser = getCurrentUser();
        Shop shop = shopRepository.findByOwnerUsername(currentUser.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("Merchant does not have an associated shop."));
        return ShopMapper.toMerchantResponse(shop);
    }

    public ShopMerchantResponse updateMyShop(ShopUpdateRequest request) {
        User currentUser = getCurrentUser();
        Shop shop = shopRepository.findByOwnerUsername(currentUser.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("Merchant does not have an associated shop."));
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
        return ShopMapper.toMerchantResponse(savedShop);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategories(CategoryType type) {
        return categoryRepository.findByType(type).stream()
                .map(c -> new CategoryResponse(c.getId(), c.getName(), c.getType().name()))
                .toList();
    }

    public void deleteMyShop() {
        User currentUser = getCurrentUser();
        Shop shop = shopRepository.findByOwnerUsername(currentUser.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("Merchant does not have an associated shop."));

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

        // Delete the shop
        shopRepository.delete(shop);

        // Finally delete the user account from auth schema
        userRepository.delete(currentUser);
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        } else {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found."));
        }
    }
}
