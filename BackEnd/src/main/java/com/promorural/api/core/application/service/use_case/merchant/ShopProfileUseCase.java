package com.promorural.api.core.application.service.use_case.merchant;

import com.promorural.api.core.application.dto.merchant.shop.ShopMerchantResponse;
import com.promorural.api.core.application.dto.merchant.shop.ShopUpdateRequest;
import com.promorural.api.core.application.mapper.ShopMapper;
import com.promorural.api.core.domain.entity.Shop;
import com.promorural.api.core.domain.entity.User;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import com.promorural.api.core.domain.repository.ShopRepository;
import com.promorural.api.core.domain.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@Transactional
public class ShopProfileUseCase {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;

    public ShopProfileUseCase(ShopRepository shopRepository, UserRepository userRepository) {
        this.shopRepository = shopRepository;
        this.userRepository = userRepository;
    }

    public ShopMerchantResponse getMyShop() {
        User currentUser = getCurrentUser();
        Shop shop = shopRepository.findByOwnerUsername(currentUser.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("Merchant does not have an associated shop."));
        return ShopMapper.toMerchantResponse(shop);
    }

    @SuppressWarnings("null")
    public ShopMerchantResponse updateMyShop(ShopUpdateRequest request) {
        User currentUser = getCurrentUser();
        Shop shop = shopRepository.findByOwnerUsername(currentUser.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("Merchant does not have an associated shop."));
        request.updateEntity(shop);
        Shop savedShop = Objects.requireNonNull(shopRepository.save(shop));
        return ShopMapper.toMerchantResponse(savedShop);
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
