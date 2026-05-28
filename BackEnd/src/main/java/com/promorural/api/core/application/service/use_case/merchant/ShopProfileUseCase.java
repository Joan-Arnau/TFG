package com.promorural.api.core.application.service.use_case.merchant;

import com.promorural.api.core.application.dto.merchant.shop.ShopMerchantResponse;
import com.promorural.api.core.application.dto.merchant.shop.ShopUpdateRequest;
import com.promorural.api.core.application.mapper.ShopMapper;
import com.promorural.api.core.domain.entity.Category;
import com.promorural.api.core.domain.entity.Shop;
import com.promorural.api.core.domain.entity.User;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import com.promorural.api.core.domain.repository.CategoryRepository;
import com.promorural.api.core.domain.repository.ShopRepository;
import com.promorural.api.core.domain.repository.UserRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
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
    private final CategoryRepository categoryRepository;
    private final GeometryFactory geometryFactory;

    public ShopProfileUseCase(
            ShopRepository shopRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            GeometryFactory geometryFactory
    ) {
        this.shopRepository = shopRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.geometryFactory = geometryFactory;
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
        Category category = null;
        if (request.hasCategory()) {
            category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.categoryId()));
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
