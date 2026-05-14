package com.promorural.api.infrastructure.controller.admin;

import com.promorural.api.core.application.dto.admin.config.ConfigUpdateRequest;
import com.promorural.api.core.application.service.use_case.admin.MunicipalityBrandingUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.promorural.api.core.application.validation.ValidationGroups;

@RestController
@RequestMapping("/api/admin/config")
@PreAuthorize("hasRole('ADMIN')")
public class ConfigController {

    private final MunicipalityBrandingUseCase municipalityBrandingUseCase;

    public ConfigController(MunicipalityBrandingUseCase municipalityBrandingUseCase) {
        this.municipalityBrandingUseCase = municipalityBrandingUseCase;
    }

    @PostMapping
    public ResponseEntity<Void> updateConfig(
            @Validated(ValidationGroups.Update.class) @RequestBody ConfigUpdateRequest request) {
        municipalityBrandingUseCase.updateConfig(request);
        return ResponseEntity.ok().build();
    }
}