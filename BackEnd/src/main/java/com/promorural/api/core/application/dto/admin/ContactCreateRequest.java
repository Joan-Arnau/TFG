package com.promorural.api.core.application.dto.admin;

import com.promorural.api.core.application.validation.ValidationGroups;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.util.Map;

public record ContactCreateRequest(
        @NotEmpty(message = "Service name is required", groups = ValidationGroups.Create.class) Map<String, String> serviceName,
        @NotBlank(message = "Phone number is required", groups = ValidationGroups.Create.class)
        @Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "Invalid phone number format", groups = ValidationGroups.Create.class)
        String phoneNumber,
        String iconName,
        @NotNull(message = "CategoryId is required", groups = ValidationGroups.Create.class) Long categoryId
) {}
