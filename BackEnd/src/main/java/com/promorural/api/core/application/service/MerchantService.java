package com.promorural.api.core.application.service;

import com.promorural.api.core.application.dto.admin.CategoryRef;
import com.promorural.api.core.application.dto.merchant.promotion.PromotionCreateRequest;
import com.promorural.api.core.application.dto.merchant.promotion.PromotionMerchantResponse;
import com.promorural.api.core.application.dto.merchant.shop.ProductImageResponse;
import com.promorural.api.core.application.dto.merchant.shop.ShopMerchantResponse;
import com.promorural.api.core.application.dto.merchant.shop.ShopUpdateRequest;
import com.promorural.api.core.domain.entity.*;
import com.promorural.api.core.domain.exception.BadRequestException;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import com.promorural.api.core.domain.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
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

    public ShopMerchantResponse getShopForMerchant() {
        User currentUser = getCurrentUser();
        Shop shop = shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Merchant does not have an associated shop."));
        return mapToShopMerchantResponse(shop);
    }

    @Transactional
    public ShopMerchantResponse updateShopForMerchant(ShopUpdateRequest request) {
        User currentUser = getCurrentUser();
        Shop shop = shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Merchant does not have an associated shop."));

        request.updateEntity(shop);
        
        Shop savedShop = shopRepository.save(shop);
        return mapToShopMerchantResponse(savedShop);
    }

    public List<PromotionMerchantResponse> getMerchantPromotions() {
        User currentUser = getCurrentUser();
        Shop shop = shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Merchant does not have an associated shop."));

        return promotionRepository.findByShopId(shop.getId()).stream()
                .map(this::mapToPromotionMerchantResponse)
                .toList();
    }

    @Transactional
    public PromotionMerchantResponse createMerchantPromotion(PromotionCreateRequest request) {
        User currentUser = getCurrentUser();
        Shop shop = shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Merchant does not have an associated shop."));

        Promotion promotion = new Promotion();
        request.applyToEntity(promotion, shop);

        Promotion savedPromotion = promotionRepository.save(promotion);
        return mapToPromotionMerchantResponse(savedPromotion);
    }

    @Transactional
    public void deleteMerchantPromotion(Long promotionId) {
        User currentUser = getCurrentUser();
        Shop shop = shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Merchant does not have an associated shop."));

        if (promotionId == null) {
            throw new BadRequestException("Promotion ID cannot be null");
        }
        Optional<Promotion> promotionOptional = promotionRepository.findById(promotionId);
        
        if (promotionOptional.isPresent()) {
            Promotion promotion = promotionOptional.get();
            if (promotion.getShop().getId().equals(shop.getId())) {
                promotionRepository.deleteById(promotionId);
            } else {
                throw new AccessDeniedException("Promotion does not belong to this merchant.");
            }
        } else {
            throw new ResourceNotFoundException("Promotion not found with ID: " + promotionId);
        }
    }

    @Transactional
    public ProductImageResponse uploadImageForShop(MultipartFile file) {
        User currentUser = getCurrentUser();
        Shop shop = shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Merchant does not have an associated shop."));

        String imageUrl = fileStorageService.storeFile(file);

        ProductImage image = new ProductImage();
        image.setImageUrl(imageUrl);
        image.setShop(shop);

        ProductImage savedImage = productImageRepository.save(image);
        return mapToProductImageResponse(savedImage);
    }

    @Transactional
    public void deleteImageForShop(Long imageId) {
        User currentUser = getCurrentUser();
        Shop shop = shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Merchant does not have an associated shop."));

        if (imageId == null) {
            throw new BadRequestException("Image ID cannot be null");
        }
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found with ID: " + imageId));

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
    
    private ShopMerchantResponse mapToShopMerchantResponse(Shop shop) {
        if (shop == null) return null;
        return new ShopMerchantResponse(
                shop.getId(),
                shop.getName(),
                shop.getDescription(),
                shop.getAddress(),
                shop.getPhoneNumber(),
                shop.getHeaderImageUrl(),
                mapToCategoryRef(shop.getCategory()),
                shop.getLocation() != null ? shop.getLocation().getY() : null,
                shop.getLocation() != null ? shop.getLocation().getX() : null
        );
    }

    private PromotionMerchantResponse mapToPromotionMerchantResponse(Promotion p) {
        if (p == null) return null;
        return new PromotionMerchantResponse(
                p.getId(),
                p.getShop().getId(),
                p.getTitle(),
                p.getDescription(),
                p.getImageUrl(),
                p.getStartsAt(),
                p.getEndsAt()
        );
    }

    private CategoryRef mapToCategoryRef(Category category) {
        if (category == null) return null;
        return new CategoryRef(
                category.getId(),
                category.getName(),
                category.getType().name()
        );
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
