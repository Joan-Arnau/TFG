package com.promorural.api.infrastructure.controller.admin;

import com.promorural.api.core.application.dto.admin.POIAdminResponse;
import com.promorural.api.core.application.dto.admin.PointOfInterestCreateRequest;
import com.promorural.api.core.application.dto.admin.PointOfInterestUpdateRequest;
import com.promorural.api.core.application.dto.guest.PointOfInterestResponse;
import com.promorural.api.core.application.service.use_case.admin.PointOfInterestUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.promorural.api.core.application.validation.ValidationGroups;

import java.util.List;

@RestController
@RequestMapping("/api/admin/pois")
@PreAuthorize("hasRole('ADMIN')")
public class PointOfInterestController {

    private final PointOfInterestUseCase pointOfInterestUseCase;

    public PointOfInterestController(PointOfInterestUseCase pointOfInterestUseCase) {
        this.pointOfInterestUseCase = pointOfInterestUseCase;
    }

    @GetMapping
    public ResponseEntity<List<POIAdminResponse>> getPointsOfInterest() {
        return ResponseEntity.ok(pointOfInterestUseCase.getAll());
    }

    @PostMapping
    public ResponseEntity<PointOfInterestResponse> createPointOfInterest(
            @Validated(ValidationGroups.Create.class) @RequestBody PointOfInterestCreateRequest request) {
        PointOfInterestResponse createdPoi = pointOfInterestUseCase.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPoi);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PointOfInterestResponse> updatePointOfInterest(@PathVariable Long id,
                                                                          @Validated(ValidationGroups.Update.class) @RequestBody PointOfInterestUpdateRequest request) {
        PointOfInterestResponse updatedPoi = pointOfInterestUseCase.update(id, request);
        return ResponseEntity.ok(updatedPoi);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePointOfInterest(@PathVariable Long id) {
        pointOfInterestUseCase.delete(id);
        return ResponseEntity.noContent().build();
    }
}
