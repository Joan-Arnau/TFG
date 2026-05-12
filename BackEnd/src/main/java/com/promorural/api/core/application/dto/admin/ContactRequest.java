package com.promorural.api.core.application.dto.admin;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.util.Map;

public record ContactRequest(
        @NotEmpty(message = "Service name is required") Map<String, String> serviceName,
        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "Invalid phone number format")
        String phoneNumber,
        String iconName,
        Long categoryId
) {}
