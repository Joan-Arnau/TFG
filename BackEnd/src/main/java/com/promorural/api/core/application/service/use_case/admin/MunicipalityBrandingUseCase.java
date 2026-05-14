package com.promorural.api.core.application.service.use_case.admin;

import com.promorural.api.core.application.dto.admin.config.ConfigUpdateRequest;
import com.promorural.api.core.domain.entity.MunicipalityConfig;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import com.promorural.api.core.domain.repository.MunicipalityConfigRepository;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@Transactional
public class MunicipalityBrandingUseCase {

    private final MunicipalityConfigRepository municipalityConfigRepository;
    private final GeometryFactory geometryFactory;

    public MunicipalityBrandingUseCase(MunicipalityConfigRepository municipalityConfigRepository,
                                        GeometryFactory geometryFactory) {
        this.municipalityConfigRepository = municipalityConfigRepository;
        this.geometryFactory = geometryFactory;
    }

    @SuppressWarnings("null")
    public void updateConfig(ConfigUpdateRequest request) {
        MunicipalityConfig config = municipalityConfigRepository.findFirstByOrderByIdAsc()
            .orElseThrow(() -> new ResourceNotFoundException("Municipality configuration not found"));
        request.updateEntity(config, geometryFactory);
        Objects.requireNonNull(municipalityConfigRepository.save(config));
    }
}
