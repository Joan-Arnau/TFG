package com.promorural.api.core.application.dto.auth;

import com.promorural.api.core.application.validation.ValidationGroups;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @NotBlank(message = "Username is required", groups = ValidationGroups.Create.class) String username,
        @NotBlank(message = "Password is required", groups = ValidationGroups.Create.class) String password
) {}
