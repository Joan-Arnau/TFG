package com.promorural.api.service;

import com.promorural.api.dto.MerchantDtos.*;
import com.promorural.api.dto.PublicDtos.*;
import com.promorural.api.entity.*;
import com.promorural.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class MerchantService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public ShopResponse getShopForMerchant() {
        User currentUser = getCurrentUser();
        Shop shop = Objects.requireNonNull(shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new IllegalStateException("Merchant does not have an associated shop.")), "Shop object is null");
        return mapToShopResponse(shop);
    }

    @Transactional
    public ShopResponse updateShopForMerchant(UpdateShopRequest request) {
        User currentUser = getCurrentUser();
        Shop shop = Objects.requireNonNull(shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new IllegalStateException("Merchant does not have an associated shop.")), "Shop object is null");

        request.updateEntity(shop);
        
        Shop savedShop = shopRepository.save(shop);
        return mapToShopResponse(savedShop);
    }

    public List<PromotionResponse> getMerchantPromotions() {
        User currentUser = getCurrentUser();
        Shop shop = Objects.requireNonNull(shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new IllegalStateException("Merchant does not have an associated shop.")), "Shop object is null");

        return promotionRepository.findByShopId(shop.getId()).stream()
                .map(this::mapToPromotionResponse)
                .toList();
    }

    @Transactional
    public PromotionResponse createMerchantPromotion(CreatePromotionRequest request) {
        User currentUser = getCurrentUser();
        Shop shop = Objects.requireNonNull(shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new IllegalStateException("Merchant does not have an associated shop.")), "Shop object is null");

        Promotion promotion = new Promotion();
        request.applyToEntity(promotion, shop);

        Promotion savedPromotion = promotionRepository.save(promotion);
        return mapToPromotionResponse(savedPromotion);
    }

    @Transactional
    public void deleteMerchantPromotion(Long promotionId) {
        User currentUser = getCurrentUser();
        Shop shop = Objects.requireNonNull(shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new IllegalStateException("Merchant does not have an associated shop.")), "Shop object is null");

        Long nonNullPromotionId = Objects.requireNonNull(promotionId, "Promotion ID cannot be null");
        Optional<Promotion> promotionOptional = promotionRepository.findById(nonNullPromotionId);
        
        if (promotionOptional.isPresent()) {
            Promotion promotion = promotionOptional.get();
            if (promotion.getShop().getId().equals(shop.getId())) {
                promotionRepository.deleteById(nonNullPromotionId);
            } else {
                throw new AccessDeniedException("Promotion does not belong to this merchant.");
            }
        } else {
            throw new RuntimeException("Promotion not found.");
        }
    }

    @Transactional
    public ProductImageResponse uploadImageForShop(MultipartFile file) throws IOException {
        User currentUser = getCurrentUser();
        Shop shop = Objects.requireNonNull(shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new IllegalStateException("Merchant does not have an associated shop.")), "Shop object is null");

        String imageUrl = fileStorageService.storeFile(file);

        ProductImage image = new ProductImage();
        image.setImageUrl(imageUrl);
        image.setShop(shop);

        ProductImage savedImage = productImageRepository.save(image);
        return mapToProductImageResponse(savedImage);
    }

    @Transactional
    public void deleteImageForShop(Long imageId) throws IOException {
        User currentUser = getCurrentUser();
        Shop shop = Objects.requireNonNull(shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new IllegalStateException("Merchant does not have an associated shop.")), "Shop object is null");

        Long nonNullImageId = Objects.requireNonNull(imageId, "Image ID cannot be null");
        ProductImage image = productImageRepository.findById(nonNullImageId)
                .orElseThrow(() -> new RuntimeException("Image not found."));

        if (!image.getShop().getId().equals(shop.getId())) {
            throw new AccessDeniedException("Image does not belong to this merchant's shop.");
        }

        fileStorageService.deleteFile(image.getImageUrl());
        productImageRepository.delete(image);
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
    
    private CategoryResponse mapToCategoryResponse(Category category) {
        if (category == null) return null;
        return new CategoryResponse(category.getId(), category.getName(), category.getType().name());
    }

    private ProductImageResponse mapToProductImageResponse(ProductImage image) {
        if (image == null) return null;
        return new ProductImageResponse(
                image.getId(),
                image.getImageUrl(),
                image.getUploadedAt()
        );
    }
}
