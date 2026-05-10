package com.promorural.api.service;

import com.promorural.api.dto.MerchantDtos.PromotionCreateDto;
import com.promorural.api.dto.MerchantDtos.ShopUpdateDto;
import com.promorural.api.dto.PublicDtos.CategoryResponse;
import com.promorural.api.dto.PublicDtos.PromotionResponse;
import com.promorural.api.dto.PublicDtos.ShopResponse;
import com.promorural.api.entity.Category;
import com.promorural.api.entity.Promotion;
import com.promorural.api.entity.Shop;
import com.promorural.api.entity.User;
import com.promorural.api.repository.PromotionRepository;
import com.promorural.api.repository.ShopRepository;
import com.promorural.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    /**
     * Retrieves the shop associated with the authenticated merchant, mapped to ShopResponse DTO.
     * @return ShopResponse DTO representing the shop.
     * @throws IllegalStateException if the merchant does not have an associated shop.
     */
    public ShopResponse getShopForMerchant() {
        User currentUser = getCurrentUser();
        Shop shop = Objects.requireNonNull(shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new IllegalStateException("Merchant does not have an associated shop.")), "Shop object is null");
        return mapToShopResponse(shop);
    }

    /**
     * Updates the shop details for the authenticated merchant and returns the updated shop as ShopResponse DTO.
     * @param shopUpdateDto The DTO containing updated shop information.
     * @return ShopResponse DTO of the updated shop.
     * @throws IllegalStateException if the merchant does not have an associated shop.
     */
    @Transactional
    public ShopResponse updateShopForMerchant(ShopUpdateDto shopUpdateDto) {
        User currentUser = getCurrentUser();
        Shop shop = Objects.requireNonNull(shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new IllegalStateException("Merchant does not have an associated shop.")), "Shop object is null");

        if (shopUpdateDto.getName() != null) {
            shop.setName(shopUpdateDto.getName());
        }
        if (shopUpdateDto.getDescription() != null) {
            shop.setDescription(shopUpdateDto.getDescription());
        }
        
        if (shopUpdateDto.getAddress() != null) {
            shop.setAddress(shopUpdateDto.getAddress());
        }
        if (shopUpdateDto.getPhoneNumber() != null) {
            shop.setPhoneNumber(shopUpdateDto.getPhoneNumber());
        }
        
        Shop savedShop = shopRepository.save(shop);
        return mapToShopResponse(savedShop);
    }

    /**
     * Retrieves all promotions for the authenticated merchant's shop, mapped to PromotionResponse DTOs.
     * @return A list of PromotionResponse DTOs.
     * @throws IllegalStateException if the merchant does not have an associated shop.
     */
    public List<PromotionResponse> getMerchantPromotions() {
        User currentUser = getCurrentUser();
        Shop shop = Objects.requireNonNull(shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new IllegalStateException("Merchant does not have an associated shop.")), "Shop object is null");

        return promotionRepository.findByShopId(shop.getId()).stream()
                .map(this::mapToPromotionResponse)
                .toList();
    }

    /**
     * Creates a new promotion for the authenticated merchant's shop.
     * @param promotionCreateDto The DTO containing promotion details.
     * @return The created PromotionResponse DTO.
     * @throws IllegalStateException if the merchant does not have an associated shop.
     */
    @Transactional
    public PromotionResponse createMerchantPromotion(PromotionCreateDto promotionCreateDto) {
        User currentUser = getCurrentUser();
        Shop shop = Objects.requireNonNull(shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new IllegalStateException("Merchant does not have an associated shop.")), "Shop object is null");

        Promotion promotion = new Promotion();
        promotion.setTitle(promotionCreateDto.getTitle());
        promotion.setDescription(promotionCreateDto.getDescription());
        
        promotion.setStartsAt(promotionCreateDto.getStartsAt());
        promotion.setEndsAt(promotionCreateDto.getEndsAt());
        promotion.setImageUrl(promotionCreateDto.getImageUrl());
        
        promotion.setShop(shop);

        Promotion savedPromotion = promotionRepository.save(promotion);
        return mapToPromotionResponse(savedPromotion);
    }

    /**
     * Deletes a specific promotion belonging to the authenticated merchant.
     * @param promotionId The ID of the promotion to delete.
     * @throws IllegalStateException if the merchant does not have an associated shop.
     * @throws AccessDeniedException if the promotion does not belong to the merchant.
     * @throws RuntimeException if the promotion is not found.
     */
    @Transactional
    public void deleteMerchantPromotion(Long promotionId) {
        User currentUser = getCurrentUser();
        
        Shop shop = Objects.requireNonNull(shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new IllegalStateException("Merchant does not have an associated shop.")), "Shop object is null");

        Long nonNullPromotionId = Objects.requireNonNull(promotionId, "Promotion ID cannot be null");
        Optional<Promotion> promotionOptional = promotionRepository.findById(nonNullPromotionId);
        
        if (promotionOptional.isPresent()) {
            Promotion promotion = promotionOptional.get();
            
            Shop promotionShop = Objects.requireNonNull(promotion.getShop(), "Promotion's shop cannot be null");
            Long promotionShopId = Objects.requireNonNull(promotionShop.getId(), "Promotion's shop ID cannot be null");

            Long currentShopId = Objects.requireNonNull(shop.getId(), "Current shop ID cannot be null");

            if (promotionShopId.equals(currentShopId)) {
                promotionRepository.deleteById(nonNullPromotionId);
            } else {
                throw new AccessDeniedException("Promotion does not belong to this merchant.");
            }
        } else {
            throw new RuntimeException("Promotion not found.");
        }
    }

    /**
     * Retrieves the current authenticated user.
     * @return The User entity.
     * @throws IllegalStateException if the authentication principal is not of the expected type.
     */
    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        } else {
            if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                String username = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
                return userRepository.findByUsername(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found."));
            } else {
                 throw new IllegalStateException("Authentication principal is not a User or UserDetails object.");
            }
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
}
