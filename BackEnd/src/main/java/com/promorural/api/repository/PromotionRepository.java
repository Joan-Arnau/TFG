package com.promorural.api.repository;

import com.promorural.api.entity.Promotion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    List<Promotion> findByShopId(Long shopId);
}
