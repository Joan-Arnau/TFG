package com.promorural.api.core.application.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
    @NotBlank(message = "{validation.token.required}")
    String token,

    @NotBlank(message = "{validation.password.required}")
    @Size(min = 8, message = "{validation.password.length}")
    String newPassword
) {}
