package com.promorural.api.core.domain.repository;

import com.promorural.api.core.domain.entity.Promotion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    List<Promotion> findByShopId(Long shopId);
}
