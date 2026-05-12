package com.promorural.api.core.application.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @NotBlank(message = "Username is required") String username,
        @NotBlank(message = "Password is required") String password
) {}
