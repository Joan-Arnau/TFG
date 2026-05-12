package com.promorural.api.infrastructure.controller.admin;

import com.promorural.api.core.application.dto.admin.ContactCreateRequest;
import com.promorural.api.core.application.dto.admin.ContactUpdateRequest;
import com.promorural.api.core.application.dto.guest.ContactResponse;
import com.promorural.api.core.application.service.use_case.admin.ContactUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.promorural.api.core.application.validation.ValidationGroups;

@RestController
@RequestMapping("/api/admin/contacts")
@PreAuthorize("hasRole('ADMIN')")
public class ContactController {

    private final ContactUseCase contactUseCase;

    public ContactController(ContactUseCase contactUseCase) {
        this.contactUseCase = contactUseCase;
    }

    @PostMapping
    public ResponseEntity<ContactResponse> createContact(
            @Validated(ValidationGroups.Create.class) @RequestBody ContactCreateRequest request) {
        try {
            ContactResponse createdContact = contactUseCase.create(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdContact);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactResponse> updateContact(@PathVariable Long id,
                                                          @Validated(ValidationGroups.Update.class) @RequestBody ContactUpdateRequest request) {
        try {
            ContactResponse updatedContact = contactUseCase.update(id, request);
            return ResponseEntity.ok(updatedContact);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        try {
            contactUseCase.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}