package com.promorural.api.service;

import com.promorural.api.dto.MerchantDtos;
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
     * Retrieves the shop associated with the authenticated merchant.
     * @return The Shop entity.
     * @throws IllegalStateException if the merchant does not have an associated shop.
     */
    public Shop getShopForMerchant() {
        User currentUser = getCurrentUser();
        return shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new IllegalStateException("Merchant does not have an associated shop."));
    }

    /**
     * Updates the shop details for the authenticated merchant.
     * @param shopUpdateDto The DTO containing updated shop information.
     * @return The updated Shop entity.
     * @throws IllegalStateException if the merchant does not have an associated shop.
     */
    @Transactional
    public Shop updateShopForMerchant(MerchantDtos.ShopUpdateDto shopUpdateDto) {
        User currentUser = getCurrentUser();
        Shop shop = shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new IllegalStateException("Merchant does not have an associated shop."));

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
        
        return shopRepository.save(shop);
    }

    /**
     * Retrieves all promotions for the authenticated merchant's shop.
     * @return A list of Promotion entities.
     * @throws IllegalStateException if the merchant does not have an associated shop.
     */
    public List<Promotion> getMerchantPromotions() {
        User currentUser = getCurrentUser();
        Shop shop = shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new IllegalStateException("Merchant does not have an associated shop."));

        return promotionRepository.findByShopId(shop.getId());
    }

    /**
     * Creates a new promotion for the authenticated merchant's shop.
     * @param promotionCreateDto The DTO containing promotion details.
     * @return The created Promotion entity.
     * @throws IllegalStateException if the merchant does not have an associated shop.
     */
    @Transactional
    public Promotion createMerchantPromotion(MerchantDtos.PromotionCreateDto promotionCreateDto) {
        User currentUser = getCurrentUser();
        Shop shop = shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new IllegalStateException("Merchant does not have an associated shop."));

        Promotion promotion = new Promotion();
        promotion.setTitle(promotionCreateDto.getTitle());
        promotion.setDescription(promotionCreateDto.getDescription());
        
        promotion.setStartsAt(promotionCreateDto.getStartsAt());
        promotion.setEndsAt(promotionCreateDto.getEndsAt());
        promotion.setImageUrl(promotionCreateDto.getImageUrl());
        
        promotion.setShop(shop);

        return promotionRepository.save(promotion);
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
}
