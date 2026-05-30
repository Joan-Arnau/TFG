package com.promorural.api.core.domain.repository;

import com.promorural.api.core.domain.entity.PointOfInterest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointOfInterestRepository extends JpaRepository<PointOfInterest, Long> {
    long countByCategoryId(Long categoryId);
}
