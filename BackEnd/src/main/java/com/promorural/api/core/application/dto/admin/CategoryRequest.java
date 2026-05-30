package com.promorural.api.core.application.dto.admin;

import com.promorural.api.core.application.validation.ValidationGroups;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.Map;

public record CategoryRequest(
    @NotEmpty(message = "Name is required", groups = {ValidationGroups.Create.class, ValidationGroups.Update.class}) Map<String, String> name,
    @NotBlank(message = "Type is required", groups = {ValidationGroups.Create.class, ValidationGroups.Update.class}) String type
) {}
