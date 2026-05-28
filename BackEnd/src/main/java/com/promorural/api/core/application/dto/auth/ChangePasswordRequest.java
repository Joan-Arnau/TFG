package com.promorural.api.core.application.dto.auth;

import com.promorural.api.core.application.validation.ValidationGroups;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
    @NotBlank(message = "{validation.password.required}", groups = ValidationGroups.Update.class)
    String oldPassword,

    @NotBlank(message = "{validation.password.required}", groups = ValidationGroups.Update.class)
    @Size(min = 8, message = "{validation.password.length}", groups = ValidationGroups.Update.class)
    String newPassword
) {}
