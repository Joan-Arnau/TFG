package com.promorural.api.core.application.dto.auth;

import com.promorural.api.core.application.validation.ValidationGroups;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "{validation.username.required}", groups = ValidationGroups.Create.class) 
        String username,
        
        @NotBlank(message = "{validation.password.required}", groups = ValidationGroups.Create.class) 
        String password
) {}
