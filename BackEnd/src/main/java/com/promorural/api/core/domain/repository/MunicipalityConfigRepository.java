package com.promorural.api.core.domain.repository;

import com.promorural.api.core.domain.entity.MunicipalityConfig;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MunicipalityConfigRepository extends JpaRepository<MunicipalityConfig, Long> {
    Optional<MunicipalityConfig> findFirstByOrderByIdAsc();
}
