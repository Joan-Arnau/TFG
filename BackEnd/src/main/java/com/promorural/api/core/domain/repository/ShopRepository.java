package com.promorural.api.core.domain.repository;

import com.promorural.api.core.domain.entity.Shop;
import com.promorural.api.core.domain.entity.ShopStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopRepository extends JpaRepository<Shop, Long> {
    List<Shop> findByStatusOrderByCreatedAtDesc(ShopStatus status);
    
    Optional<Shop> findByOwnerUsername(String username); 

    long countByCategoryId(Long categoryId);
}
