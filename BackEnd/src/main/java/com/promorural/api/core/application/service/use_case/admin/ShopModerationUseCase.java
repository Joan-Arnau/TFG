package com.promorural.api.core.application.service.use_case.admin;

import com.promorural.api.core.application.dto.admin.ShopModerationResponse;
import com.promorural.api.core.application.dto.admin.moderation.ShopStatusUpdateRequest;
import com.promorural.api.core.application.mapper.ShopMapper;
import com.promorural.api.core.domain.entity.Shop;
import com.promorural.api.core.domain.entity.ShopStatus;
import com.promorural.api.core.domain.exception.BadRequestException;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import com.promorural.api.core.domain.repository.ShopRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ShopModerationUseCase {

    private final ShopRepository shopRepository;

    public ShopModerationUseCase(ShopRepository shopRepository) {
        this.shopRepository = shopRepository;
    }

    public List<ShopModerationResponse> getPendingShops() {
        return shopRepository.findByStatusOrderByCreatedAtDesc(ShopStatus.PENDING).stream()
                .map(ShopMapper::toModerationResponse)
                .collect(Collectors.toList());
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
    }
}