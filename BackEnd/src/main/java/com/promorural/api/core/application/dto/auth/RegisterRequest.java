package com.promorural.api.core.application.dto.auth;

import com.promorural.api.core.application.validation.ValidationGroups;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "{validation.username.required}", groups = ValidationGroups.Create.class)
        @Size(max = 100, message = "{validation.username.length}", groups = ValidationGroups.Create.class)
        String username,

        @NotBlank(message = "{validation.email.required}", groups = ValidationGroups.Create.class)
        @Email(message = "{validation.email.format}", groups = ValidationGroups.Create.class)
        @Size(max = 100, message = "{validation.email.length}", groups = ValidationGroups.Create.class)
        String email,

        @NotBlank(message = "{validation.password.required}", groups = ValidationGroups.Create.class)
        @Size(min = 8, message = "{validation.password.length}", groups = ValidationGroups.Create.class)
        String password,

        @NotBlank(message = "{validation.shopName.required}", groups = ValidationGroups.Create.class)
        @Size(max = 100, message = "{validation.shopName.length}", groups = ValidationGroups.Create.class)
        String shopName,

        @NotBlank(message = "{validation.shopDescription.required}", groups = ValidationGroups.Create.class)
        @Size(max = 2000, message = "{validation.shopDescription.length}", groups = ValidationGroups.Create.class)
        String shopDescription,

        String address,
        String phoneNumber
) {}
