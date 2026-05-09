package com.promorural.api.repository;

import com.promorural.api.entity.Shop;
import com.promorural.api.entity.ShopStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopRepository extends JpaRepository<Shop, Long> {
    List<Shop> findByStatusOrderByCreatedAtDesc(ShopStatus status);
}
