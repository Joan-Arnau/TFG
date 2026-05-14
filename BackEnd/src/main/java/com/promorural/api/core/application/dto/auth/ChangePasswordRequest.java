package com.promorural.api.core.application.dto.auth;

import com.promorural.api.core.application.validation.ValidationGroups;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
    @NotBlank(message = "Current password is required", groups = ValidationGroups.Update.class)
    String oldPassword,

    @NotBlank(message = "New password is required", groups = ValidationGroups.Update.class)
    @Size(min = 6, message = "New password must be at least 6 characters long", groups = ValidationGroups.Update.class)
    String newPassword
) {}
