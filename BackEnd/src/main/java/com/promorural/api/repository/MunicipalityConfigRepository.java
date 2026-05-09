package com.promorural.api.repository;

import com.promorural.api.entity.MunicipalityConfig;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MunicipalityConfigRepository extends JpaRepository<MunicipalityConfig, Long> {
    Optional<MunicipalityConfig> findFirstByOrderByIdAsc();
}
