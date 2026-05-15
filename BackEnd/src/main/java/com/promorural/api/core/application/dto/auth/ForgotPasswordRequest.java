package com.promorural.api.core.application.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
    @NotBlank(message = "{validation.email.required}")
    @Email(message = "{validation.email.format}")
    String email
) {}
