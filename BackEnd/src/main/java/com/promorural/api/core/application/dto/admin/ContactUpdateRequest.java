package com.promorural.api.core.application.dto.admin;

import com.promorural.api.core.application.validation.ValidationGroups;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.Map;

public record ContactUpdateRequest(
        @Size(min = 1, message = "Service name cannot be empty", groups = ValidationGroups.Update.class) Map<String, String> serviceName,
        @Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "Invalid phone number format", groups = ValidationGroups.Update.class)
        String phoneNumber,
        String iconName,
        Long categoryId
) {}
