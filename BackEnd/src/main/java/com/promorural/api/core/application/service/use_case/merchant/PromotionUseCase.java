package com.promorural.api.core.application.service.use_case.merchant;

import com.promorural.api.core.application.dto.merchant.promotion.PromotionCreateRequest;
import com.promorural.api.core.application.dto.merchant.promotion.PromotionMerchantResponse;
import com.promorural.api.core.domain.entity.Promotion;
import com.promorural.api.core.domain.entity.Shop;
import com.promorural.api.core.domain.entity.User;
import com.promorural.api.core.domain.exception.BadRequestException;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import com.promorural.api.core.domain.repository.PromotionRepository;
import com.promorural.api.core.domain.repository.ShopRepository;
import com.promorural.api.core.domain.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PromotionUseCase {

    private final ShopRepository shopRepository;
    private final PromotionRepository promotionRepository;
    private final UserRepository userRepository;

    public PromotionUseCase(ShopRepository shopRepository,
                            PromotionRepository promotionRepository,
                            UserRepository userRepository) {
        this.shopRepository = shopRepository;
        this.promotionRepository = promotionRepository;
        this.userRepository = userRepository;
    }

    public List<PromotionMerchantResponse> getMyPromotions() {
        Shop shop = getCurrentUserShop();
        return promotionRepository.findByShopId(shop.getId()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public PromotionMerchantResponse create(PromotionCreateRequest request) {
        Shop shop = getCurrentUserShop();
        Promotion promotion = new Promotion();
        request.applyToEntity(promotion, shop);
        Promotion savedPromotion = promotionRepository.save(promotion);
        return mapToResponse(savedPromotion);
    }

    public void delete(Long promotionId) {
        Shop shop = getCurrentUserShop();
        if (promotionId == null) {
            throw new BadRequestException("Promotion ID cannot be null");
        }
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with ID: " + promotionId));
        if (promotion.getShop().getId().equals(shop.getId())) {
            promotionRepository.deleteById(promotionId);
        } else {
            throw new AccessDeniedException("Promotion does not belong to this merchant.");
        }
    }

    private Shop getCurrentUserShop() {
        User currentUser = getCurrentUser();
        return shopRepository.findByOwnerUsername(currentUser.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("Merchant does not have an associated shop."));
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

    private PromotionMerchantResponse mapToResponse(Promotion p) {
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
}