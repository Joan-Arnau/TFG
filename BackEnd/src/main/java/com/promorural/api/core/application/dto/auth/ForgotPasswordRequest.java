package com.promorural.api.core.application.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ForgotPasswordRequest(
    @NotBlank(message = "{validation.email.required}")
    @Email(message = "{validation.email.format}")
    @Size(max = 100, message = "{validation.email.length}")
    String email
) {}
